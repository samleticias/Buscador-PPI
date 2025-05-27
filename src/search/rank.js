// Arquivo para fazer o ranking depois do Rastreamento de páginas (CrawlPage)

import { getDadosPaginas } from "../crawler/crawl.js";
import { load } from 'cheerio';

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
 * Remove acentos de um texto (para permitir buscas normalizadas)
 * @param {string} texto 
 * @returns {string}
 */
function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Conta ocorrências de um termo no HTML da página, considerando todo o documento
 * para maior precisão na busca de termos (incluindo meta tags, títulos, etc.)
 * 
 * @param {string} html - HTML da página
 * @param {string} termo - Termo a ser contado
 * @returns {number} - Número de ocorrências
 */
function contarOcorrencias(html, termo) {
    const htmlLower = html.toLowerCase();
    const termoLower = termo.toLowerCase();

    const htmlNormalizado = removerAcentos(htmlLower);
    const termoNormalizado = removerAcentos(termoLower);

    // Contar todas as ocorrências do termo, mesmo dentro de outras palavras
    const regex = new RegExp(termoNormalizado, 'g');
    const matches = htmlNormalizado.match(regex);
    return matches ? matches.length : 0;
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
    
    // Frequência dos termos buscados no HTML (todo o documento)
    let pontosTermos = 0;
    let totalOcorrencias = 0;

    for (const termo of termos) {
        // Contagem de ocorrências usando a função específica
        const ocorrencias = contarOcorrencias(pagina.html, termo);
        pontosTermos += ocorrencias * 5;
        totalOcorrencias += ocorrencias;
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
        totalOcorrencias,
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