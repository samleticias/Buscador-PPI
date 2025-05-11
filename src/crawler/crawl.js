// Arquivo para fazer rastreamento entre páginas (crawling)

import { fetchHTML, extrairLinks } from '../utils/utils.js';

/*
 * Conjunto que armazena URLs já visitadas para evitar visitas duplicadas.
 * Set() é uma estrutura de dados do JavaScript que só armazena valores únicos.
 * @type {Set<string>}
 */
const paginasvisitadas = new Set();

/*
 * Dicionário que armazena os dados extraídos de cada página visitada.
 * Chave = URL da página 
 * Valores =  Conteúdo HTML, links e págs que apontam para a atual (apontadores)
 */
const dadosPaginas = {};

/**
 * Função recursiva que realiza o rastreamento (crawler) de páginas web.
 *
 * @param {string} url - A URL da página que será visitada.
 * @param {string} baseUrl - A URL base usada para início
 * @returns {Promise<void>}
 * @throws {Error} Se ocorrer um erro ao acessar a página via HTTP.
 *
 */
export async function crawlPage(url, baseUrl) {
    // Verifica se a URL já foi visitada.
    if (paginasvisitadas.has(url)) return;

    console.log(`Visitando: ${url}`);
    paginasvisitadas.add(url);

    try {
        const html = await fetchHTML(url); // Faz requisição HTTP
        const links = extrairLinks(html, baseUrl); // Extrai links na pág atual

        // Adiciona ao dicionário
        dadosPaginas[url] = {
            html,
            links,
            apontadores: [], // Preenchido depois no ranking.
        };

        // Chama recursivamente a função para cada link encontrado na página atual
        for (const link of links) {
            await crawlPage(link, baseUrl);
        }

    } catch (erro) {
        console.error(`Erro ao acessar ${url}:`, erro.message);
    }
}

/**
 * Retorna todos os dados coletados durante o rastreamento(crawling), um objeto contendo os dados de cada página visitada.
 *
 * @returns {Object.<string, {html: string, links: string[], apontadores: string[]}>}
 */
export function getDadosPaginas() {
    return dadosPaginas;
}

