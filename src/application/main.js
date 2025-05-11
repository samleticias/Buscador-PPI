import { crawlPage, getDadosPaginas } from '../crawler/crawl.js';
import { buscar, preencherApontadores } from '../search/rank.js';


const urlInicial = 'https://page-films-mu.vercel.app/pages/duna.html';
const termos = ['filme']; 

(async () => {
    await crawlPage(urlInicial, urlInicial);

    preencherApontadores();

    const dados = getDadosPaginas();
    const ranking = buscar(termos);

    console.log("Crawling finalizado. Páginas visitadas:");
    console.log(Object.keys(dados));
    
    ranking.forEach(({ url, score }, i) => {
        console.log(`${i + 1}. ${url} - ${score} pontos`);
    });
})();
