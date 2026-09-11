// =====================================================
//  MEMORY MATCH · DESAFIO DOS PARES
//  script.js — Lógica do jogo em JavaScript puro
//
//  Requisito: exclusivamente HTML, CSS e JavaScript puro
//             (sem bibliotecas externas)
//
//  Conceitos aplicados:
//    - Manipulação do DOM: getElementById, getElementsByClassName
//                          querySelector, classList, textContent, innerHTML
//    - Tratamento de eventos: addEventListener (click, keydown, DOMContentLoaded)
//    - Lógica de jogo: início, pontuação, vitória, reinício, estado da partida
//    - Algoritmo de embaralhamento Fisher-Yates
//    - Histórico de resultados por sessão
// =====================================================

const ICONES = ['💻', '⚡', '🚀', '🌐', '🎮', '🛡️', '⚙️', '🔥'];
const TOTAL_PARES = ICONES.length;

let cartaAtual = null;
let segundaCarta = null;
let tabuQueTrava = false;
let jogadas = 0;
let paresEncontrados = 0;
let intervalo = null;
let segundos = 0;
let jogoIniciado = false;
let totalVitorias = 0;
let melhorTempo = null;
let melhorJogadas = null;

const elJogadas = document.getElementById('jogadas');
const elPares = document.getElementById('pares');
const elCronometro = document.getElementById('cronometro');
const elStatus = document.getElementById('status');
const elTabuleiro = document.getElementById('tabuleiro');
const elModal = document.getElementById('modal');
const elModalTitulo = document.getElementById('modal-titulo');
const elModalMensagem = document.getElementById('modal-mensagem');
const elModalEstat = document.getElementById('modal-estatisticas');
const elConfetti = document.getElementById('confetti-conteiner');
const elQtdVitorias = document.getElementById('qtdVitorias');
const elMelhorTempo = document.getElementById('melhorTempo');
const elMelhorJogadas = document.getElementById('melhorJogadas');

document.addEventListener('DOMContentLoaded', iniciarJogo);
document.getElementById('modal-fundo').addEventListener('click', fecharModalEReiniciar);

function iniciarJogo() {
  resetarEstado();
  renderizarTabuleiro();
  mostrarStatus();
}

function reiniciarJogo() {
  resetarEstado();
  renderizarTabuleiro();
  mostrarStatus();
}

function fecharModalEReiniciar() {
  elModal.classList.add('oculto');
  elConfetti.innerHTML = '';
  reiniciarJogo();
}

function resetarEstado() {
  cartaAtual = null;
  segundaCarta = null;
  tabuQueTrava = false;
  jogadas = 0;
  paresEncontrados = 0;
  segundos = 0;
  jogoIniciado = false;

  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }

  elJogadas.textContent = '0';
  elPares.textContent = `0/${TOTAL_PARES}`;
  elCronometro.textContent = '00:00';
  elCronometro.classList.remove('urgente');
}

function renderizarTabuleiro() {
  const baralho = [...ICONES, ...ICONES];
  embaralhar(baralho);
  elTabuleiro.innerHTML = '';

  baralho.forEach((icone, indice) => {
    elTabuleiro.appendChild(criarCarta(icone, indice));
  });
}

function criarCarta(icone, indice) {
  const carta = document.createElement('div');
  carta.classList.add('carta');
  carta.dataset.icone = icone;
  carta.dataset.indice = indice;
  carta.setAttribute('role', 'button');
  carta.setAttribute('aria-label', 'Carta virada — clique para revelar');
  carta.setAttribute('tabindex', '0');
  carta.innerHTML = `
    <div class="face-carta face-frente" aria-hidden="true"></div>
    <div class="face-carta face-verso" aria-hidden="true">${icone}</div>
  `;

  carta.addEventListener('click', () => virarCarta(carta));
  carta.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      virarCarta(carta);
    }
  });
  return carta;
}

function virarCarta(carta) {
  if (tabuQueTrava || carta === cartaAtual || carta.classList.contains('encontrada')) return;

  if (!jogoIniciado) {
    jogoIniciado = true;
    iniciarCronometro();
  }

  carta.classList.add('virada');
  carta.setAttribute('aria-label', `Carta revelada: ${carta.dataset.icone}`);

  if (!cartaAtual) {
    cartaAtual = carta;
    mostrarStatus();
    return;
  }

  segundaCarta = carta;
  jogadas++;
  elJogadas.textContent = jogadas;
  verificarPar();
}

function verificarPar() {
  if (cartaAtual.dataset.icone === segundaCarta.dataset.icone) {
    acertouPar();
  } else {
    errouPar();
  }
}

function acertouPar() {
  cartaAtual.classList.add('encontrada');
  segundaCarta.classList.add('encontrada');
  paresEncontrados++;
  elPares.textContent = `${paresEncontrados}/${TOTAL_PARES}`;
  resetarSelecao();
  mostrarStatus();

  if (paresEncontrados === TOTAL_PARES) encerrarJogo();
}

function errouPar() {
  tabuQueTrava = true;
  setTimeout(() => {
    cartaAtual.classList.remove('virada');
    segundaCarta.classList.remove('virada');
    resetarSelecao();
    mostrarStatus();
  }, 950);
}

function resetarSelecao() {
  cartaAtual = null;
  segundaCarta = null;
  tabuQueTrava = false;
}

function mostrarStatus() {
  if (!jogoIniciado) {
    elStatus.textContent = '🃏 Clique em uma carta para começar!';
  } else if (paresEncontrados === TOTAL_PARES) {
    elStatus.textContent = `🎉 Você venceu em ${jogadas} jogadas!`;
  } else if (cartaAtual) {
    elStatus.textContent = '🔎 Agora clique na segunda carta para tentar o par!';
  } else {
    elStatus.textContent = `🔍 ${paresEncontrados} de ${TOTAL_PARES} pares encontrados`;
  }
}

function iniciarCronometro() {
  intervalo = setInterval(() => {
    segundos++;
    const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
    const segundosExibidos = String(segundos % 60).padStart(2, '0');
    elCronometro.textContent = `${minutos}:${segundosExibidos}`;
    if (segundos >= 120) elCronometro.classList.add('urgente');
  }, 1000);
}

function encerrarJogo() {
  clearInterval(intervalo);
  setTimeout(() => {
    atualizarHistorico();
    exibirModalVitoria();
  }, 700);
}

function atualizarHistorico() {
  totalVitorias++;
  if (melhorTempo === null || segundos < melhorTempo) melhorTempo = segundos;
  if (melhorJogadas === null || jogadas < melhorJogadas) melhorJogadas = jogadas;

  const minutos = String(Math.floor(melhorTempo / 60)).padStart(2, '0');
  const segundosExibidos = String(melhorTempo % 60).padStart(2, '0');
  elQtdVitorias.innerHTML = `🏆 Vitórias: <b>${totalVitorias}</b>`;
  elMelhorTempo.innerHTML = `⚡ Melhor Tempo: <b>${minutos}:${segundosExibidos}</b>`;
  elMelhorJogadas.innerHTML = `🎯 Menor Jogadas: <b>${melhorJogadas}</b>`;
}

function exibirModalVitoria() {
  const classificacao = classificarDesempenho(jogadas, segundos);
  elModalTitulo.textContent = `${classificacao.emoji} ${classificacao.titulo}`;
  elModalMensagem.textContent = classificacao.mensagem;
  elModalEstat.innerHTML = `
    <div class="pílula-stat">🎯 <b>${jogadas}</b> jogadas</div>
    <div class="pílula-stat">⏱️ <b>${elCronometro.textContent}</b></div>
    <div class="pílula-stat">⭐ <b>${classificacao.estrelas}</b></div>
  `;
  elModal.classList.remove('oculto');
  dispararConfetti();
}

function classificarDesempenho(totalJogadas, totalSegundos) {
  const minimo = TOTAL_PARES;
  if (totalJogadas <= minimo + 2 && totalSegundos <= 40) {
    return { emoji: '🏆', titulo: 'Lendário!', mensagem: 'Memória incrível! Você é imparável!', estrelas: '★★★★★' };
  }
  if (totalJogadas <= minimo + 5 && totalSegundos <= 70) {
    return { emoji: '🥇', titulo: 'Excelente!', mensagem: 'Memória afiada! Muito bem jogado!', estrelas: '★★★★☆' };
  }
  if (totalJogadas <= minimo + 10 && totalSegundos <= 120) {
    return { emoji: '🥈', titulo: 'Muito Bom!', mensagem: 'Boa performance! Continue praticando!', estrelas: '★★★☆☆' };
  }
  return { emoji: '🎉', titulo: 'Parabéns!', mensagem: 'Você completou o desafio! Tente bater seu recorde!', estrelas: '★★☆☆☆' };
}

function dispararConfetti() {
  const cores = ['#38bdf8', '#a855f7', '#f472b6', '#e3b341', '#3fb950', '#f97316'];
  elConfetti.innerHTML = '';

  for (let indice = 0; indice < 60; indice++) {
    const peca = document.createElement('div');
    const tamanho = Math.random() * 8 + 5;
    const duracao = (Math.random() * 2 + 1.8).toFixed(2);
    const atraso = (Math.random() * 1.2).toFixed(2);
    peca.classList.add('peca-confetti');
    peca.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${cores[Math.floor(Math.random() * cores.length)]};
      width: ${tamanho}px;
      height: ${(tamanho * 1.6).toFixed(1)}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      --dur: ${duracao}s;
      --delay: ${atraso}s;
    `;
    elConfetti.appendChild(peca);
  }
}

function embaralhar(baralho) {
  for (let indice = baralho.length - 1; indice > 0; indice--) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));
    [baralho[indice], baralho[aleatorio]] = [baralho[aleatorio], baralho[indice]];
  }
}
