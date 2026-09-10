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

// --- Constantes do jogo ---
const ICONES     = ['💻', '⚡', '🚀', '🌐', '🎮', '🛡️', '⚙️', '🔥'];
const TOTAL_PARES = ICONES.length; // 8 pares = 16 cartas

// =====================================================
//  ESTADO DO JOGO
// =====================================================
let cartaAtual        = null;   // primeira carta selecionada na rodada
let segundaCarta      = null;   // segunda carta selecionada na rodada
let tabuQueTrava      = false;  // bloqueia cliques durante a verificação
let jogadas           = 0;      // contador de jogadas
let paresEncontrados  = 0;      // contador de pares encontrados
let intervalo         = null;   // referência ao setInterval do cronômetro
let segundos          = 0;      // tempo decorrido em segundos
let jogoIniciado      = false;  // controla o início do cronômetro

// Histórico da sessão (mantido entre partidas)
let totalVitorias  = 0;
let melhorTempo    = null;   // menor tempo em segundos
let melhorJogadas  = null;   // menor número de jogadas

// =====================================================
//  REFERÊNCIAS AO DOM (getElementById — padrão do tutorial)
// =====================================================
const elJogadas          = document.getElementById('jogadas');
const elPares            = document.getElementById('pares');
const elCronometro       = document.getElementById('cronometro');
const elStatus           = document.getElementById('status');
const elTabuleiro        = document.getElementById('tabuleiro');
const elModal            = document.getElementById('modal');
const elModalTitulo      = document.getElementById('modal-titulo');
const elModalMensagem    = document.getElementById('modal-mensagem');
const elModalEstat       = document.getElementById('modal-estatisticas');
const elConfetti         = document.getElementById('confetti-conteiner');
const elBgParticulas     = document.getElementById('bg-particles');
const elQtdVitorias      = document.getElementById('qtdVitorias');
const elMelhorTempo      = document.getElementById('melhorTempo');
const elMelhorJogadas    = document.getElementById('melhorJogadas');

// =====================================================
//  INICIALIZAÇÃO
//  addEventListener para DOMContentLoaded (sem jQuery)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
  criarParticulas();
  iniciarJogo();
});

// Fechar modal ao clicar no fundo (addEventListener puro)
document.getElementById('modal-fundo').addEventListener('click', function() {
  fecharModalEReiniciar();
});

// =====================================================
//  FUNÇÕES CHAMADAS PELO onclick INLINE NO HTML
// =====================================================

// Reinicia o jogo (chamada pelo onclick do botão no HTML)
function reiniciarJogo() {
  resetarEstado();
  renderizarTabuleiro();
  mostrarStatus();
}

// Fecha o modal e inicia nova partida (chamada pelo onclick no HTML)
function fecharModalEReiniciar() {
  elModal.classList.add('oculto');
  elConfetti.innerHTML = '';
  reiniciarJogo();
}

// =====================================================
//  CONTROLE DO ESTADO DA PARTIDA
// =====================================================
function resetarEstado() {
  cartaAtual       = null;
  segundaCarta     = null;
  tabuQueTrava     = false;
  jogadas          = 0;
  paresEncontrados = 0;
  segundos         = 0;
  jogoIniciado     = false;

  // Para o cronômetro caso esteja rodando
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }

  // Atualiza o placar no DOM (getElementById)
  elJogadas.textContent    = '0';
  elPares.textContent      = `0/${TOTAL_PARES}`;
  elCronometro.textContent = '00:00';
  elCronometro.classList.remove('urgente');
}

// =====================================================
//  INÍCIO DA PARTIDA
// =====================================================
function iniciarJogo() {
  resetarEstado();
  renderizarTabuleiro();
}

// =====================================================
//  RENDERIZAR TABULEIRO
// =====================================================
function renderizarTabuleiro() {
  // Duplica os ícones para formar pares e embaralha
  const baralho = [...ICONES, ...ICONES];
  embaralhar(baralho);

  // Limpa o tabuleiro anterior
  elTabuleiro.innerHTML = '';

  // Cria e insere cada carta no DOM
  baralho.forEach(function(icone, indice) {
    const carta = criarCarta(icone, indice);
    elTabuleiro.appendChild(carta);
  });
}

// =====================================================
//  CRIAR ELEMENTO DE CARTA (DOM puro)
// =====================================================
function criarCarta(icone, indice) {
  const carta = document.createElement('div');
  carta.classList.add('carta');
  carta.dataset.icone  = icone;
  carta.dataset.indice = indice;

  // Acessibilidade: role e aria-label
  carta.setAttribute('role', 'button');
  carta.setAttribute('aria-label', 'Carta virada — clique para revelar');
  carta.setAttribute('tabindex', '0');

  // Duas faces: frente (escondida) e verso (ícone)
  carta.innerHTML = `
    <div class="face-carta face-frente" aria-hidden="true"></div>
    <div class="face-carta face-verso"  aria-hidden="true">${icone}</div>
  `;

  // Tratamento de evento: clique com addEventListener
  carta.addEventListener('click', function() {
    virarCarta(carta);
  });

  // Suporte a teclado: Enter ou Espaço viram a carta
  carta.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      virarCarta(carta);
    }
  });

  return carta;
}

// =====================================================
//  LÓGICA: VIRAR A CARTA (tratamento de evento)
// =====================================================
function virarCarta(carta) {
  // Impede ações inválidas
  if (tabuQueTrava)                              return;
  if (carta === cartaAtual)                      return;
  if (carta.classList.contains('encontrada'))   return;

  // Inicia o cronômetro na primeira jogada
  if (!jogoIniciado) {
    jogoIniciado = true;
    iniciarCronometro();
  }

  carta.classList.add('virada');
  carta.setAttribute('aria-label', `Carta revelada: ${carta.dataset.icone}`);

  if (!cartaAtual) {
    // Primeira carta da rodada
    cartaAtual = carta;
    mostrarStatus();
    return;
  }

  // Segunda carta da rodada: verifica par
  segundaCarta = carta;
  incrementarJogadas();
  verificarPar();
}

// =====================================================
//  PONTUAÇÃO: INCREMENTAR JOGADAS
// =====================================================
function incrementarJogadas() {
  jogadas++;

  // Atualiza DOM com textContent (DOM puro)
  elJogadas.textContent = jogadas;

  // Anima o valor com classList (sem jQuery)
  elJogadas.classList.remove('pulsando');
  void elJogadas.offsetWidth;         // força reflow para reiniciar animação CSS
  elJogadas.classList.add('pulsando');
}

// =====================================================
//  VERIFICAR SE AS DUAS CARTAS FORMAM UM PAR
// =====================================================
function verificarPar() {
  if (cartaAtual.dataset.icone === segundaCarta.dataset.icone) {
    acertouPar();
  } else {
    errouPar();
  }
}

// --- Par correto ---
function acertouPar() {
  // Marca as cartas como encontradas via classList
  cartaAtual.classList.add('encontrada');
  segundaCarta.classList.add('encontrada');
  cartaAtual.setAttribute('aria-label',  `Par encontrado: ${cartaAtual.dataset.icone}`);
  segundaCarta.setAttribute('aria-label', `Par encontrado: ${segundaCarta.dataset.icone}`);

  paresEncontrados++;

  // Atualiza pares com textContent (DOM puro)
  elPares.textContent = `${paresEncontrados}/${TOTAL_PARES}`;

  // Anima o valor
  elPares.classList.remove('pulsando');
  void elPares.offsetWidth;
  elPares.classList.add('pulsando');

  resetarSelecao();
  mostrarStatus();

  // Verifica condição de vitória
  if (paresEncontrados === TOTAL_PARES) {
    encerrarJogo();
  }
}

// --- Par errado ---
function errouPar() {
  tabuQueTrava = true;

  // Animação de erro (shake via classList)
  cartaAtual.classList.add('errada');
  segundaCarta.classList.add('errada');

  // Desvira após 950ms
  setTimeout(function() {
    if (cartaAtual) {
      cartaAtual.classList.remove('virada', 'errada');
      cartaAtual.setAttribute('aria-label', 'Carta virada — clique para revelar');
    }
    if (segundaCarta) {
      segundaCarta.classList.remove('virada', 'errada');
      segundaCarta.setAttribute('aria-label', 'Carta virada — clique para revelar');
    }
    resetarSelecao();
    mostrarStatus();
  }, 950);
}

// Reseta os ponteiros de seleção da rodada
function resetarSelecao() {
  [cartaAtual, segundaCarta] = [null, null];
  tabuQueTrava = false;
}

// =====================================================
//  MENSAGENS E STATUS PARA O JOGADOR (p#status)
// =====================================================
function mostrarStatus() {
  let mensagem = '';

  if (!jogoIniciado) {
    mensagem = '🃏 Clique em uma carta para começar!';
  } else if (paresEncontrados === TOTAL_PARES) {
    mensagem = `🎉 Você venceu em ${jogadas} jogadas!`;
  } else if (cartaAtual) {
    mensagem = `🔎 Agora clique na segunda carta para tentar o par!`;
  } else {
    mensagem = `🔍 ${paresEncontrados} de ${TOTAL_PARES} pares encontrados`;
  }

  // Atualiza o DOM com textContent (DOM puro)
  elStatus.textContent = mensagem;
}

// =====================================================
//  CRONÔMETRO (início da partida)
// =====================================================
function iniciarCronometro() {
  if (intervalo) clearInterval(intervalo);

  intervalo = setInterval(function() {
    segundos++;

    const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
    const ss = String(segundos % 60).padStart(2, '0');

    // Atualiza via textContent (DOM puro)
    elCronometro.textContent = `${mm}:${ss}`;

    // Indica urgência após 2 minutos com classList
    if (segundos >= 120) {
      elCronometro.classList.add('urgente');
    }
  }, 1000);
}

// =====================================================
//  VITÓRIA: ENCERRAR JOGO
// =====================================================
function encerrarJogo() {
  clearInterval(intervalo);
  mostrarStatus();

  // Aguarda animação das cartas antes do modal
  setTimeout(function() {
    atualizarHistorico();
    exibirModalVitoria();
  }, 700);
}

// =====================================================
//  HISTÓRICO DE PARTIDAS (atualiza DOM com innerHTML)
// =====================================================
function atualizarHistorico() {
  totalVitorias++;

  // Melhor tempo (menor valor)
  if (melhorTempo === null || segundos < melhorTempo) {
    melhorTempo = segundos;
  }

  // Menor número de jogadas
  if (melhorJogadas === null || jogadas < melhorJogadas) {
    melhorJogadas = jogadas;
  }

  const mm = String(Math.floor(melhorTempo / 60)).padStart(2, '0');
  const ss = String(melhorTempo % 60).padStart(2, '0');

  // Atualiza histórico no DOM via innerHTML (DOM puro)
  elQtdVitorias.innerHTML   = `🏆 Vitórias: <b>${totalVitorias}</b>`;
  elMelhorTempo.innerHTML   = `⚡ Melhor Tempo: <b>${mm}:${ss}</b>`;
  elMelhorJogadas.innerHTML = `🎯 Menor Jogadas: <b>${melhorJogadas}</b>`;
}

// =====================================================
//  MODAL DE VITÓRIA
// =====================================================
function exibirModalVitoria() {
  const tempoFinal    = elCronometro.textContent;
  const classificacao = classificarDesempenho(jogadas, segundos);

  // Atualiza modal via textContent e innerHTML (DOM puro)
  elModalTitulo.textContent   = `${classificacao.emoji} ${classificacao.titulo}`;
  elModalMensagem.textContent = classificacao.mensagem;

  elModalEstat.innerHTML = `
    <div class="pílula-stat">🎯 <b>${jogadas}</b> jogadas</div>
    <div class="pílula-stat">⏱️ <b>${tempoFinal}</b></div>
    <div class="pílula-stat">⭐ <b>${classificacao.estrelas}</b></div>
  `;

  // Exibe o modal removendo a classe 'oculto' via classList
  elModal.classList.remove('oculto');

  dispararConfetti();
}

// =====================================================
//  CLASSIFICAÇÃO DE DESEMPENHO (pontuação)
// =====================================================
function classificarDesempenho(totalJogadas, totalSegundos) {
  const minimo = TOTAL_PARES; // 8 = mínimo de jogadas possível

  if (totalJogadas <= minimo + 2 && totalSegundos <= 40) {
    return { emoji: '🏆', titulo: 'Lendário!',  mensagem: 'Memória incrível! Você é imparável!',              estrelas: '★★★★★' };
  }
  if (totalJogadas <= minimo + 5 && totalSegundos <= 70) {
    return { emoji: '🥇', titulo: 'Excelente!', mensagem: 'Memória afiada! Muito bem jogado!',                 estrelas: '★★★★☆' };
  }
  if (totalJogadas <= minimo + 10 && totalSegundos <= 120) {
    return { emoji: '🥈', titulo: 'Muito Bom!', mensagem: 'Boa performance! Continue praticando!',             estrelas: '★★★☆☆' };
  }
  return       { emoji: '🎉', titulo: 'Parabéns!',  mensagem: 'Você completou o desafio! Tente bater seu recorde!', estrelas: '★★☆☆☆' };
}

// =====================================================
//  CONFETTI ANIMADO (gerado via DOM puro)
// =====================================================
function dispararConfetti() {
  elConfetti.innerHTML = '';

  const cores = ['#38bdf8','#a855f7','#f472b6','#e3b341','#3fb950','#f97316'];

  for (let i = 0; i < 60; i++) {
    const peca  = document.createElement('div');
    peca.classList.add('peca-confetti');

    const cor   = cores[Math.floor(Math.random() * cores.length)];
    const left  = Math.random() * 100;
    const dur   = (Math.random() * 2 + 1.8).toFixed(2);
    const delay = (Math.random() * 1.2).toFixed(2);
    const size  = Math.random() * 8 + 5;

    peca.style.cssText = `
      left: ${left}%;
      background: ${cor};
      width: ${size}px;
      height: ${(size * 1.6).toFixed(1)}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      --dur: ${delay}s;
      --delay: ${delay}s;
    `;

    elConfetti.appendChild(peca);
  }
}

// =====================================================
//  PARTÍCULAS DECORATIVAS DO FUNDO
// =====================================================
function criarParticulas() {
  const cores = [
    'hsla(192,100%,50%,0.5)',
    'hsla(270,90%,65%,0.4)',
    'hsla(330,100%,65%,0.35)',
    'hsla(152,68%,46%,0.35)',
  ];

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.classList.add('particula');

    const tamanho = Math.random() * 5 + 2;
    const posLeft = Math.random() * 100;
    const delay   = Math.random() * 10;
    const dur     = Math.random() * 8 + 6;
    const cor     = cores[Math.floor(Math.random() * cores.length)];
    const opac    = (Math.random() * 0.35 + 0.15).toFixed(2);

    p.style.cssText = `
      width: ${tamanho}px;
      height: ${tamanho}px;
      left: ${posLeft}%;
      background: ${cor};
      box-shadow: 0 0 ${tamanho * 2}px ${cor};
      --dur: ${dur}s;
      --delay: ${delay}s;
      --op: ${opac};
    `;

    elBgParticulas.appendChild(p);
  }
}

// =====================================================
//  ALGORITMO DE EMBARALHAMENTO (Fisher-Yates)
// =====================================================
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}