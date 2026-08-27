import { audio } from "../../core/audio.js";
import { t } from "../../core/i18n.js";

const technologies = [
  ["HTML", "#ff8b68"], ["CSS", "#75b7ff"], ["JS", "#ffd35a"], ["TS", "#68abff"], ["REACT", "#67d8f5"], ["VUE", "#74d99c"], ["ANG", "#ff6e88"], ["SVELTE", "#ff8e68"],
  ["NODE", "#8bd06e"], ["PY", "#91c5f8"], ["JAVA", "#ff9b72"], ["PHP", "#a98bff"], ["CS", "#b78dff"], ["GO", "#76d4e8"], ["RUST", "#e5a26b"], ["GIT", "#ff8068"]
];

export const memoryGame = {
  id: "memory",
  title: "Memory Stack",
  mount(container) {
    container.innerHTML = `<div class="game-shell memory-shell" data-game="memory"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">${t("game.pairs")}<b data-pairs>0 / 8</b></span><span class="stat-chip">${t("game.lives")}<b data-lives>12</b></span><span class="stat-chip">STATUS<b data-state>READY</b></span></div><div class="game-toolbar-actions"><button type="button" data-new>${t("game.newGame")}</button></div></div><div class="memory-settings"><label>${t("game.pairs")}<input data-pair-input type="number" min="4" max="16" value="8"></label><label>${t("game.lives")}<input data-life-input type="number" min="1" max="30" value="12"></label><label>${t("game.mode")}<select data-mode><option value="preview">${t("game.preview")}</option><option value="instant">${t("game.blind")}</option></select></label><button class="button button-primary" type="button" data-start>${t("game.startSession")}</button></div><p class="memory-status" data-message>Choose a deck, lives and opening mode.</p><div class="memory-board" data-board aria-label="Technology memory cards"></div></div>`;
    const boardElement = container.querySelector("[data-board]");
    const pairsElement = container.querySelector("[data-pairs]");
    const livesElement = container.querySelector("[data-lives]");
    const stateElement = container.querySelector("[data-state]");
    const messageElement = container.querySelector("[data-message]");
    const pairInput = container.querySelector("[data-pair-input]");
    const lifeInput = container.querySelector("[data-life-input]");
    const modeInput = container.querySelector("[data-mode]");
    const controller = new AbortController();
    let deck = [];
    let phase = "ready";
    let lives = 12;
    let matches = 0;
    let selected = [];
    let previewTimer;
    let compareTimer;

    function shuffle(cards) {
      return [...cards].sort(() => Math.random() - .5);
    }

    function createDeck(pairCount) {
      return shuffle(technologies.slice(0, pairCount).flatMap(([label, color], index) => [{ id: `${index}-a`, key: index, label, color, shown: true, matched: false }, { id: `${index}-b`, key: index, label, color, shown: true, matched: false }]));
    }

    function updateHud() {
      pairsElement.textContent = `${matches} / ${Math.floor(deck.length / 2) || Number(pairInput.value)}`;
      livesElement.textContent = String(lives);
      stateElement.textContent = phase.toUpperCase();
    }

    function render() {
      boardElement.style.setProperty("--card-count", String(deck.length));
      boardElement.innerHTML = deck.map((card, index) => `<button class="memory-card ${card.shown || card.matched ? "shown" : ""} ${card.matched ? "matched" : ""}" type="button" data-card="${index}" ${phase !== "playing" || card.shown || card.matched ? "disabled" : ""} aria-label="Memory card ${index + 1}"><span class="memory-card-inner"><span class="memory-card-back">&lt;/&gt;</span><span class="memory-card-face" style="--tech-color:${card.color}"><b>${card.label}</b><i>TECH</i></span></span></button>`).join("");
      updateHud();
    }

    function finish(won) {
      phase = won ? "complete" : "failed";
      clearTimeout(compareTimer);
      messageElement.textContent = won ? `Deck solved with ${lives} ${t("game.lives").toLowerCase()} remaining.` : "No lives remaining. The stack is revealed.";
      if (!won) deck.forEach((card) => { card.shown = true; });
      won ? audio.score() : audio.gameOver();
      render();
    }

    function beginRound() {
      clearTimeout(previewTimer);
      clearTimeout(compareTimer);
      const pairCount = Math.max(4, Math.min(16, Number(pairInput.value) || 8));
      lives = Math.max(1, Math.min(30, Number(lifeInput.value) || 12));
      pairInput.value = pairCount;
      lifeInput.value = lives;
      matches = 0;
      selected = [];
      deck = createDeck(pairCount);
      phase = modeInput.value === "preview" ? "preview" : "playing";
      if (phase === "playing") deck.forEach((card) => { card.shown = false; });
      messageElement.textContent = phase === "preview" ? "Memorize the stack. Cards flip in 4 seconds." : "Find every matching technology pair.";
      render();
      audio.menu();
      if (phase === "preview") {
        previewTimer = setTimeout(() => { phase = "playing"; deck.forEach((card) => { card.shown = false; }); messageElement.textContent = "The stack is live. Match technologies before your lives run out."; render(); }, 4000);
      }
    }

    function chooseCard(index) {
      if (phase !== "playing" || selected.length === 2) return;
      const card = deck[index];
      if (!card || card.shown || card.matched) return;
      card.shown = true;
      selected.push(index);
      audio.move();
      render();
      if (selected.length !== 2) return;
      const [first, second] = selected.map((selectedIndex) => deck[selectedIndex]);
      compareTimer = setTimeout(() => {
        if (first.key === second.key) {
          first.matched = true;
          second.matched = true;
          matches += 1;
          audio.score();
          messageElement.textContent = `Match found: ${first.label}.`;
          selected = [];
          if (matches === deck.length / 2) { finish(true); return; }
        } else {
          first.shown = false;
          second.shown = false;
          lives -= 1;
          messageElement.textContent = lives ? "Not a match. Read the stack and try again." : "The stack has exhausted your lives.";
          selected = [];
          audio.hit();
          if (!lives) { finish(false); return; }
        }
        render();
      }, 720);
    }

    boardElement.addEventListener("click", (event) => { const button = event.target.closest("[data-card]"); if (button) chooseCard(Number(button.dataset.card)); }, { signal: controller.signal });
    container.querySelector("[data-start]").addEventListener("click", beginRound, { signal: controller.signal });
    container.querySelector("[data-new]").addEventListener("click", beginRound, { signal: controller.signal });
    deck = createDeck(8);
    deck.forEach((card) => { card.shown = false; });
    render();
    return { destroy() { clearTimeout(previewTimer); clearTimeout(compareTimer); controller.abort(); } };
  }
};
