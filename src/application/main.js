// Importa o Axios para fazer requisições HTTP
import axios from 'axios';
// Importa o Cheerio para manipular o HTML e buscar elementos
import { load } from 'cheerio';

// Função assíncrona que recebe uma URL e faz o "crawling" (raspagem) da página
async function crawlPage(url) {
    try {
        // Faz uma requisição GET para a URL fornecida e espera pela resposta
        const response = await axios.get(url);

        // Carrega o HTML da página na variável $ (como no jQuery)
        const $ = load(response.data);

        // Cria um array vazio para armazenar os links encontrados
        const links = [];

        // Percorre todos os elementos <a> (links) da página
        $('a').each((index, element) => {
            // Extrai o atributo 'href' de cada link
            const href = $(element).attr('href');

            // Se o link existe e não foi adicionado antes, adiciona ao array 'links'
            if (href && !links.includes(href)) {
                links.push(href);
            }
        });

        // Exibe a quantidade de links encontrados e a URL que foi processada
        console.log(`Found ${links.length} links on ${url}:`);
    } catch (error) {
        // Caso ocorra um erro na requisição, exibe uma mensagem de erro
        console.error(`Error fetching ${url}:`, error.message);
    }
}

// Chama a função 'crawlPage' passando a URL da página que queremos raspar
crawlPage('https://page-films-mu.vercel.app/pages/duna.html');
