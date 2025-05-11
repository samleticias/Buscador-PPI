// Arquivo para fazer o ranking depois do Rastreamento de páginas (CrawlPage)

import { getDadosPaginas } from "../crawler/crawl.js";

/**
 * Atualiza a propriedade "apontadores" de cada página, indicando quais outras páginas possuem links para ela.
 */
export function preencherApontadores () {
    const dadosPaginas = getDadosPaginas();

    for (const pagina in dadosPaginas) {
        if (dadosPaginas[pagina] && dadosPaginas[pagina].links) {
            const links = dadosPaginas[pagina].links;

            for (const link of links) {
                if (dadosPaginas[link]) {
                    dadosPaginas[link].apontadores.push(pagina);
                }
            }
        }
    }
}

/**
 * Calcula a pontuação total de uma página com base nos critérios:
 * Autoridade, frequência dos termos e penalização por autoreferência.
 *
 * @param {string} url - URL da página a ser avaliada.
 * @param {string[]} termos - Lista com termos a serem buscados no conteúdo da página.
 * @returns {object} Objeto com pontuação total e critérios individuais.
 */
function pontuacao(url, termos) {
    const pagina = getDadosPaginas()[url];
    const texto = pagina.html.toLowerCase();

    // Frequência dos termos buscados no HTML
    let pontosTermos = 0;
    for (const termo of termos) {
        const ocorrencias = texto.split(termo.toLowerCase()).length - 1;
        pontosTermos += ocorrencias * 10;
    }

    // Autoridade: quantidade de páginas que apontam para essa
    const pontosAutoridade = pagina.apontadores.length * 10;

    // Penalidade por autoreferência
    const temAutoreferencia = pagina.links.includes(url);
    const penalidade = temAutoreferencia ? -15 : 0;

    // Pontuação final
    const score = pontosAutoridade + pontosTermos + penalidade;

    return {
        url,
        score,
        linksRecebidos: pagina.apontadores.length,
        totalOcorrencias: pontosTermos / 10,
        autoreferencia: temAutoreferencia
    };
}

/**
 * Executa uma busca pelos termos informados e retorna as páginas ranqueadas com critérios de desempate.
 *
 * @param {string[]} termos - Lista com termos a serem buscados nas páginas rastreadas.
 * @returns {Array} Lista de objetos com dados ranqueados e detalhados.
 */
export function buscar(termos) {
    const dadosPaginas = getDadosPaginas();
    const resultados = [];

    for (const url of Object.keys(dadosPaginas)) {
        resultados.push(pontuacao(url, termos));
    }

    // Ordenação com critérios de desempate:
    resultados.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.linksRecebidos !== a.linksRecebidos) return b.linksRecebidos - a.linksRecebidos;
        if (b.totalOcorrencias !== a.totalOcorrencias) return b.totalOcorrencias - a.totalOcorrencias;
        return (a.autoreferencia === b.autoreferencia) ? 0 : (a.autoreferencia ? 1 : -1);
    });

    return resultados;
}