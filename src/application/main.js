function getById(id) {
  return document.getElementById(id);
}


getById('button-search').addEventListener('click', async () => {
  const termoBuscado = getById('input-search').value;
  await criarTabela(termoBuscado);
});

async function criarTabela(termo) {
  const response = await fetch(`https://web-search-mauve.vercel.app/buscar?termo=${termo}`);
  const ranking = await response.json();

  const resultsDiv = document.querySelector('.results');
  resultsDiv.innerHTML = ''; // Limpa a div antes

  const titulo = document.createElement('h2');
  titulo.textContent = `Resultados para: ${termo.toUpperCase()}`;
  resultsDiv.appendChild(titulo);

  const table = document.createElement('table');
  table.classList.add('tabela-resultado');

  // Cabeçalho
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Posição</th>
      <th>Página</th>
      <th>Ocorrências (+5)</th>
      <th>Links Recebidos (+10)</th>
      <th>Autoreferência (-15)</th>
      <th>Total</th>
    </tr>
  `;
  table.appendChild(thead);

  // Corpo da tabela
  const tbody = document.createElement('tbody');

  ranking.forEach(({ url, score, linksRecebidos, totalOcorrencias, autoreferencia }, i) => {
    const pagina = url.split('/').pop();
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${pagina}</td>
      <td>${totalOcorrencias}×5 = ${totalOcorrencias * 5}</td>
      <td>${linksRecebidos}×10 = ${linksRecebidos * 10}</td>
      <td>${autoreferencia ? "-15" : "0"}</td>
      <td>${score}</td>
    `;

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  resultsDiv.appendChild(table);
}

