// Arquivo Utils para fazer requisições HTTP usando axios e extrair links com cheerio

import axios from 'axios';
import { load } from 'cheerio';

/** Função para extrair conteúdo de links HTML() 
 * @param {string} html - O conteúdo HTML da página da qual os links serão extraídos.
 * @param {string} baseUrl - A URL base usada inicialmente
 * @returns {string[]} Um array contendo todas as URLs extraídas da página. Links duplicados são evitados.
 * 
*/
export function extrairLinks(html, baseUrl) {
    const $ = load(html); // Método load() carrega conteúdo HTML com cheerio
    const links = [];

    $('a').each((_, el) => {
        let href = $(el).attr('href');
        if (href && !href.startsWith('http')) {
            href = new URL(href, baseUrl).href;
        }
        if (href && !links.includes(href)) {
            links.push(href);
        }
    });

    return links;
}

// Função para fazer requisição HTTP com uma URL
export async function fetchHTML(url) {
    const response = await axios.get(url);
    return response.data;
}
