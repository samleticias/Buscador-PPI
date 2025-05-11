// Arquivo para fazer o ranking depois do Rastreamento de páginas(CrawlPage)

import { getDadosPaginas } from "../crawler/crawl.js";

/**
 * Atualiza a propriedade "apontadores" de cada página, indicando quais outras páginas possuem links para ela.
 */
export function preencherApontadores () {
    const dadosPaginas = getDadosPaginas();

    for (const pagina in dadosPaginas) {
        
       // Verifica se a página existe e tem a propriedade 'links'
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
 *
 * @param {string} url - URL da página a ser avaliada.
 * @param {string[]} termos - lista com termos a serem buscados no conteúdo da página.
 * @returns {number} Pontuação total da página.
 */
function pontuacao(url, termos) {
    const pagina = getDadosPaginas()[url];

    // Autoridade 
    const pontosAutoridade = pagina.apontadores.length * 10;

    // Frequência dos termos buscados no HTML
    let pontosTermos = 0;
    for (const termo of termos) {
       const texto = pagina.html.toLowerCase();
        const ocorrencias = texto.split(termo.toLowerCase()).length - 1;
        pontosTermos += ocorrencias * 10;

    }

    // Penalidade por autoreferência
    const penalidade = pagina.links.includes(url) ? -15 : 0;

    return pontosAutoridade + pontosTermos + penalidade;
}

/**
 * Executa uma busca pelos termos informados e retorna as páginas ranqueadas.
 *
 * @param {string[]} termos - lista com termos a serem buscados nas páginas rastreadas.
 * @returns {{url: string, score: number}[]} Lista de páginas ordenadas pela pontuação.
 */
export function buscar(termos) {
    const dadosPaginas = getDadosPaginas();
    const resultados = [];

    for (const url of Object.keys(dadosPaginas)) {
        const score = pontuacao(url, termos);
        resultados.push({ url, score });
    }

    // Ordena da maior para a menor pontuação
    resultados.sort((a, b) => b.score - a.score);

    return resultados;
}