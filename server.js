import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { crawlPage, getDadosPaginas } from './src/crawler/crawl.js';
import { buscar, preencherApontadores } from './src/search/rank.js';

const app = express();
const PORT = 3000;
app.use(cors());

// Configurar __dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// url da página inicial
const urlInicial = 'https://page-films-mu.vercel.app/pages/duna.html';

// variável de controle para primeira requisição
var primeira_requisicao = false;

// Servindo arquivos estáticos da pasta public e src
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/buscar', async (req, res) => {
  const termo = req.query.termo;
  if (!termo) return res.status(400).send({ error: 'Termo de busca não informado.' });

  if (!primeira_requisicao) {
    await crawlPage(urlInicial, urlInicial);
    preencherApontadores();
    primeira_requisicao = true;
  }

  // Obtém os dados coletados
  const dados = getDadosPaginas();

  // Exibe as páginas visitadas
  console.log("\nCrawling finalizado. Páginas visitadas:");
  console.log(Object.keys(dados));

  const ranking = buscar([termo.toLowerCase()]);
  res.json(ranking);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
