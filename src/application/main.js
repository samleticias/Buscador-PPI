import { crawlPage, getDadosPaginas } from '../crawler/crawl.js';
import { buscar, preencherApontadores } from '../search/rank.js';

const urlInicial = 'https://page-films-mu.vercel.app/pages/duna.html';
const termos = ['filme']; 

(async () => {
    // Etapa de rastreamento das páginas
    await crawlPage(urlInicial, urlInicial);

    // Preenche os apontadores (quem aponta para quem)
    preencherApontadores();

    // Obtém os dados coletados
    const dados = getDadosPaginas();

    // Realiza a busca com os critérios de ranqueamento
    const ranking = buscar(termos);

    // Exibe as páginas visitadas
    console.log("\nCrawling finalizado. Páginas visitadas:");
    console.log(Object.keys(dados));

    // Exibe o ranking com os critérios em formato de tabela
    console.log("\nRanking das páginas (com critérios):");
    console.log("----------------------------------------------------------------------------------------------------------------");
    console.log("| Pos | Pontos |   Links Recebidos   |   Ocorrências    |   Autoreferência    | URL");
    console.log("----------------------------------------------------------------------------------------------------------------");

    ranking.forEach(({ url, score, linksRecebidos, totalOcorrencias, autoreferencia }, i) => {
        const pos = (i + 1).toString().padEnd(4);
        const pontos = score.toString().padEnd(7);
        const links = linksRecebidos.toString().padEnd(17);
        const ocorrencias = totalOcorrencias.toString().padEnd(12);
        const auto = autoreferencia ? "Sim" : "Não";
        console.log(`| ${pos}| ${pontos}| ${links}   | ${ocorrencias}     | ${auto.padEnd(15)}     | ${url}`);
    });

    console.log("----------------------------------------------------------------------------------------------------------------");

    console.log("\n>>> Qtd. Pontos <<<\n")
    ranking.forEach(({ url, score }, i) => {
        console.log(`${i + 1}. ${url} - ${score} pontos\n`);
    });
})();