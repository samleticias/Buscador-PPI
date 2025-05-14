# 🔍 Web Search

Este projeto tem como objetivo implementar um mecanismo de busca simples que realiza **crawler** em páginas HTML e aplica um **ranqueamento** nos resultados com base em palavras-chave buscadas.

🔗 Repositório complementar com as páginas HTML utilizadas: [Page-Films](https://github.com/KaioGabriel-the/Page-Films)

---

## 🧠 Funcionalidades

- Crawler básico em arquivos HTML
- Indexação de conteúdo textual
- Busca por palavra-chave
- Ranqueamento dos resultados com base na relevância da palavra nos arquivos

---

## ⚙️ Tecnologias Utilizadas

- JavaScript (Node.js)
- Módulos nativos do Node (`fs`, `path`, etc.)
- Express.js para integração com frontend

---

## 🗂️ Estrutura do Projeto

```
Web-Search/
├── arquivos/          # Contém os arquivos HTML que serão varridos
├── index.js           # Ponto de entrada do crawler e sistema de busca
├── ranking.js         # Lógica de ranqueamento dos arquivos encontrados
├── busca.js           # Mecanismo de busca com base nas palavras-chave
└── utils/             # Funções auxiliares para leitura e processamento
```

---

## 🚀 Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/KaioGabriel-the/Web-Search.git
cd Web-Search
```

2. Instale as dependências (caso futuramente adicionadas):

```bash
npm install
```

3. Execute o script principal:

```bash
node index.js
```

4. Siga as instruções no terminal para inserir a palavra-chave desejada e visualizar os arquivos mais relevantes.

---

## 👥 Autores

- [Kaio Gabriel](https://github.com/KaioGabriel-the)
- Enzo Melo Araújo
- João Victor
- Sammya Leticia

---
