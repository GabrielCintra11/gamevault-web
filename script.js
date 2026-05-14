// ==============================
// GAMEVAULT — Script Principal
// ==============================

// URL da API no Render (será atualizada após o deploy)
const API_URL = "https://gamevault-api-7pjq.onrender.com";

// Elementos do DOM
const jogosGrid = document.getElementById("jogos-grid");
const loadingEl = document.getElementById("loading");
const erroEl = document.getElementById("erro");
const statTotal = document.getElementById("stat-total");
const statMedia = document.getElementById("stat-media");
const statGeneros = document.getElementById("stat-generos");
const navVersion = document.getElementById("nav-version");
const footerVersion = document.getElementById("footer-version");

// Versão atual do frontend
const VERSAO = "1.0.1";

// Atualizar versão na interface
navVersion.textContent = `v${VERSAO}`;
footerVersion.textContent = VERSAO;

// Criar partículas de fundo
function criarParticulas() {
  const container = document.getElementById("particles");
  const total = 30;

  for (let i = 0; i < total; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = 6 + Math.random() * 6 + "s";
    particle.style.width = 2 + Math.random() * 3 + "px";
    particle.style.height = particle.style.width;

    // Cores variadas
    const cores = ["#6c5ce7", "#a855f7", "#06b6d4", "#8b5cf6"];
    particle.style.background = cores[Math.floor(Math.random() * cores.length)];

    container.appendChild(particle);
  }
}

// Carregar jogos da API
async function carregarJogos() {
  loadingEl.style.display = "flex";
  erroEl.style.display = "none";
  jogosGrid.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/jogos`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    const jogos = data.jogos;

    // Atualizar estatísticas
    atualizarStats(jogos);

    // Renderizar cards
    jogos.forEach((jogo) => {
      const card = criarCard(jogo);
      jogosGrid.appendChild(card);
    });

    loadingEl.style.display = "none";
  } catch (error) {
    console.error("Erro ao carregar jogos:", error);
    loadingEl.style.display = "none";
    erroEl.style.display = "block";
  }
}

// Atualizar estatísticas do hero
function atualizarStats(jogos) {
  // Total de jogos
  statTotal.textContent = jogos.length;

  // Nota média
  const media = jogos.reduce((acc, j) => acc + j.nota, 0) / jogos.length;
  statMedia.textContent = media.toFixed(1);

  // Total de gêneros únicos
  const generos = new Set();
  jogos.forEach((j) => {
    j.genero.split(" / ").forEach((g) => generos.add(g.trim()));
  });
  statGeneros.textContent = generos.size;
}

// Criar card de jogo
function criarCard(jogo) {
  const card = document.createElement("article");
  card.classList.add("jogo-card");

  card.innerHTML = `
    <div class="jogo-card-img-wrapper">
      <img 
        class="jogo-card-img" 
        src="${jogo.imagem}" 
        alt="${jogo.nome}"
        onerror="this.src='https://via.placeholder.com/400x200/1a1a2e/6c5ce7?text=GameVault'"
        loading="lazy"
      />
    </div>
    <div class="jogo-card-body">
      <h3 class="jogo-card-title">${jogo.nome}</h3>
      <p class="jogo-card-desc">${jogo.descricao}</p>
      <div class="jogo-card-meta">
        <span class="jogo-tag">${jogo.genero}</span>
        <span class="jogo-tag">${jogo.plataforma}</span>
      </div>
      <div class="jogo-card-footer">
        <div class="jogo-nota">
          <span class="jogo-nota-star">⭐</span>
          <span>${jogo.nota}</span>
        </div>
        <span class="jogo-ano">${jogo.ano}</span>
      </div>
    </div>
  `;

  return card;
}

// Efeito de scroll no header
function initScrollEffect() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.background = "rgba(10, 10, 15, 0.95)";
      header.style.borderBottomColor = "rgba(108, 92, 231, 0.3)";
    } else {
      header.style.background = "rgba(10, 10, 15, 0.85)";
      header.style.borderBottomColor = "rgba(108, 92, 231, 0.15)";
    }
  });
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  criarParticulas();
  initScrollEffect();
  carregarJogos();
});
