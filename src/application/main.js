import { crawlPage, getDadosPaginas } from '../crawler/crawl.js';
import { buscar, preencherApontadores } from '../search/rank.js';

const urlInicial = 'https://page-films-mu.vercel.app/pages/duna.html';
const termosTeste = ['matrix', 'ficção científica', 'realidade', 'universo', 'viagem'];

(async () => {
    // Etapa de rastreamento das páginas
    await crawlPage(urlInicial, urlInicial);

    // Preenche os apontadores (quem aponta para quem)
    preencherApontadores();

    // Obtém os dados coletados
    const dados = getDadosPaginas();

    // Exibe as páginas visitadas
    console.log("\nCrawling finalizado. Páginas visitadas:");
    console.log(Object.keys(dados));

    for (const termo of termosTeste) {
        const termoFormatado = termo.toUpperCase();
        console.log(`\n================ BUSCANDO: ${termoFormatado} ================\n`);

        const ranking = buscar([termo.toLowerCase()]);

        console.log(`Busca pelo termo: ${termoFormatado}`);
        console.log("| Posição | Página             | Ocorrências (+5) | Links Recebidos (+10) | Autoreferência (-15) | Total |");
        console.log("|---------|--------------------|-------------------|------------------------|-----------------------|-------|");

        ranking.forEach(({ url, score, linksRecebidos, totalOcorrencias, autoreferencia }, i) => {
            const pagina = url.split('/').pop();
            const ocorrenciasStr = `${totalOcorrencias}×5 = ${totalOcorrencias * 5}`.padEnd(19);
            const linksStr = `${linksRecebidos}×10 = ${linksRecebidos * 10}`.padEnd(22);
            const autoStr = autoreferencia ? "-15".padEnd(23) : "0".padEnd(23);
            const totalStr = `${score}`.padEnd(5);
            console.log(`| ${String(i + 1).padEnd(8)}| ${pagina.padEnd(19)}| ${ocorrenciasStr}| ${linksStr}| ${autoStr}| ${totalStr}|`);
        });

        console.log("\n");
    }
})();
