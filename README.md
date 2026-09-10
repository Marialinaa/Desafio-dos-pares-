# Memory Match · Desafio dos Pares

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/Jogo-HTML-brightgreen.svg" alt="HTML">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Jogo-CSS-blue.svg" alt="CSS">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Jogo-JavaScript-orange.svg" alt="JavaScript">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  </a>
</p>

> 🚀 **Jogue online:** [https://marialinaa.github.io/Desafio-dos-pares-/](https://marialinaa.github.io/Desafio-dos-pares-/)  
---

## Índice

* [Objetivo do Jogo](#objetivo-do-jogo)
* [Regras do Jogo](#regras-do-jogo)
* [Recursos Utilizados](#recursos-utilizados)
* [Instalação e Execução](#instalação-e-execução)
* [Desenvolvimento do Projeto](#desenvolvimento-do-projeto)

---

## Objetivo do Jogo

O **Memory Match · Desafio dos Pares** é um jogo de memória com temática de tecnologia, desenvolvido como projeto prático da disciplina **GAC116 - Programação Web** da Universidade Federal de Lavras (UFLA).

O jogador deve encontrar todos os **8 pares de ícones ** distribuídos em um tabuleiro de 16 cartas. O desafio está em memorizar a posição de cada carta já revelada para realizar pares com o menor número de jogadas e no menor tempo possível.

O projeto aplica na prática os conceitos da disciplina:

- **Estruturação de páginas** com HTML semântico (`<header>`, `<main>`, `<footer>`, `<section>`)
- **Estilização** com CSS moderno (variáveis, flexbox, grid, animações, efeito 3D)
- **Manipulação do DOM** com `getElementById`, `getElementsByClassName` e jQuery
- **Tratamento de eventos** (`onclick`, `addEventListener`, `keydown`)
- **Lógica de programação** (embaralhamento Fisher-Yates, verificação de pares, cronômetro, histórico)

---

## Regras do Jogo

1. Ao iniciar, 16 cartas são distribuídas aleatoriamente com a face escondida.
2. Clique em uma carta para revelá-la.
3. Clique em uma segunda carta para tentar formar um par.
4. **Par encontrado:** as cartas ficam viradas e destacadas em verde. ✅
5. **Par errado:** as cartas voltam para a posição escondida após 1 segundo. ❌
6. O jogo é vencido quando todos os **8 pares** são encontrados.
7. Seu desempenho é classificado ao final com base no tempo e no número de jogadas:
   - 🏆 **Lendário** — ≤ 10 jogadas e ≤ 40 segundos
   - 🥇 **Excelente** — ≤ 13 jogadas e ≤ 70 segundos
   - 🥈 **Muito Bom** — ≤ 18 jogadas e ≤ 120 segundos
   - 🎉 **Parabéns** — acima desses limites, mas o jogo foi concluído!
8. Use o botão **Reiniciar Jogo** a qualquer momento para começar uma nova partida.
9. O histórico da sessão (vitórias, melhor tempo, menor número de jogadas) fica visível na tela.

---

## Recursos Utilizados

### Linguagens

* **HTML** — Responsável pela estrutura e semântica do conteúdo
* **CSS** — Responsável pela apresentação visual e animações
* **JavaScript** — Responsável pelo comportamento e interatividade

### Tipografia

  * [Google Fonts](https://fonts.google.com/specimen/Outfit)



### Ferramentas

* **Visual Studio Code** — Ambiente de Desenvolvimento Integrado
  * [Site do Visual Studio Code](https://code.visualstudio.com/)
* **Git** — Sistema de controle de versão
  * [Site do Git](https://git-scm.com/)
* **GitHub** — Plataforma de hospedagem e colaboração em projetos de software
  * [Site do GitHub](https://github.com/)
* **GitHub Pages** — Hospedagem gratuita de páginas estáticas
  * [Documentação do GitHub Pages](https://pages.github.com/)
* **Live Server (Extensão VS Code)** — Servidor web para desenvolvimento local
  * [Marketplace — Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
* **http.server** — Servidor web simples incluso na biblioteca padrão do Python
  * [Documentação do http.server](https://docs.python.org/3/library/http.server.html)

---

## Instalação e Execução

O projeto não requer instalação de dependências. Basta abrir o arquivo `index.html` em um navegador .

### Opção 1 — Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/desafio-dos-pares.git
```

Depois, abra a pasta no VS Code e acesse o arquivo `index.html`.

### Opção 2 — Baixar o ZIP

Acesse o repositório no GitHub, clique em **Code** e depois em **Download ZIP**. Extraia e abra o arquivo `index.html`.


### Opção 4 — Servidor Python

```bash
cd desafio-dos-pares
python3 -m http.server
```

Acesse no navegador: `http://localhost:8000`

---

## Desenvolvimento do Projeto

O projeto foi desenvolvido de forma incremental.

| Etapa | Tecnologia | Conteúdo |
|-------|-----------|----------|
| 1 | HTML | Estrutura semântica com `header`, `main`, `footer`, `section` |
| 2 | CSS | Variáveis CSS, Flexbox, Grid, responsividade |
| 3 | JS | Manipulação do DOM: `getElementById`, `addEventListener`, eventos `onclick` |
| 4 | CSS + JS | Efeito flip 3D nas cartas, animações `@keyframes`, `classList` |
| 5 | JS | Lógica do jogo: embaralhamento Fisher-Yates, verificação de pares, vitória |
| 6 | JS | Cronômetro (`setInterval`), histórico de partidas, classificação de desempenho |
| 7 | CSS | Glassmorphism, confetti gerado por DOM puro, partículas de fundo |

### Estrutura de Arquivos

```
desafio-dos-pares/
├── index.html    # Estrutura HTML semântica da aplicação
├── style.css     # Estilos, animações e responsividade
├── script.js     # Lógica do jogo e manipulação do DOM
├── LICENSE       # Licença MIT
└── README.md     # Este arquivo
```

---


## Informações do Projeto

```json
{
  "nome": "Memory Match · Desafio dos Pares",
  "descricao": "Jogo da memória interativo desenvolvido como trabalho prático para a disciplina de Programação Web (GAC116 - UFLA).",
  "autores": "Maria Lina da Silva",
  "turma": "14A"
}
