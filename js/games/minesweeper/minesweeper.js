import { audio } from "../../core/audio.js";
import { t } from "../../core/i18n.js";

const levels = { easy: { columns: 9, rows: 9, mines: 10 }, medium: { columns: 12, rows: 12, mines: 24 }, hard: { columns: 16, rows: 16, mines: 40 } };
const around = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export const minesweeperGame = {
  id: "minesweeper",
  title: "Minesweeper",
  mount(container) {
    container.innerHTML = `<div class="game-shell minesweeper-shell" data-game="minesweeper"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">${t("game.time")}<b data-time>0:00</b></span><span class="stat-chip">MINES<b data-mines>10</b></span><span class="stat-chip">FLAGS<b data-flags>0</b></span></div><div class="game-toolbar-actions"><button type="button" data-restart>${t("game.newGame")}</button></div></div><div class="mode-row"><button class="choice-button active" type="button" data-level="easy">${t("game.easy")}</button><button class="choice-button" type="button" data-level="medium">${t("game.medium")}</button><button class="choice-button" type="button" data-level="hard">${t("game.hard")}</button></div><div class="minesweeper-layout"><div class="mine-board" data-board aria-label="Minesweeper board"></div><aside class="mine-side"><div class="turn-banner" data-status>STATUS<strong>Ready to scan</strong></div><button class="choice-button active" type="button" data-mode="reveal">${t("game.reveal")}</button><button class="choice-button" type="button" data-mode="flag">${t("game.flag")}</button><div class="game-panel"><p>TIP</p><strong>1 · 2 · 3</strong><p>Use the numbers to map nearby mines.</p></div></aside></div></div>`;
    const boardElement = container.querySelector("[data-board]");
    const statusElement = container.querySelector("[data-status]");
    const timeElement = container.querySelector("[data-time]");
    const mineElement = container.querySelector("[data-mines]");
    const flagElement = container.querySelector("[data-flags]");
    const controller = new AbortController();
    let level = "easy";
    let mode = "reveal";
    let board;
    let active;
    let started;
    let seconds;
    let timer;

    function config() { return levels[level]; }
    function indexOf(row, column) { return row * config().columns + column; }
    function neighbors(index) {
      const row = Math.floor(index / config().columns);
      const column = index % config().columns;
      return around.map(([rowOffset, columnOffset]) => [row + rowOffset, column + columnOffset]).filter(([nextRow, nextColumn]) => nextRow >= 0 && nextRow < config().rows && nextColumn >= 0 && nextColumn < config().columns).map(([nextRow, nextColumn]) => indexOf(nextRow, nextColumn));
    }

    function placeMines(firstIndex) {
      const excluded = new Set([firstIndex, ...neighbors(firstIndex)]);
      const candidates = board.map((_, index) => index).filter((index) => !excluded.has(index));
      for (let placed = 0; placed < config().mines; placed += 1) {
        const candidate = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
        board[candidate].mine = true;
      }
      board.forEach((cell, index) => { cell.adjacent = neighbors(index).filter((neighbor) => board[neighbor].mine).length; });
    }

    function startClock() {
      if (started) return;
      started = true;
      timer = setInterval(() => { seconds += 1; timeElement.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }, 1000);
    }

    function status(message) { statusElement.innerHTML = `STATUS<strong>${message}</strong>`; }
    function flagCount() { return board.filter((cell) => cell.flagged).length; }

    function render() {
      const settings = config();
      boardElement.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;
      boardElement.innerHTML = board.map((cell, index) => {
        const content = cell.revealed ? cell.mine ? "✦" : cell.adjacent || "" : cell.flagged ? "⚑" : "";
        const classes = `${cell.revealed ? "revealed" : ""} ${cell.flagged ? "flagged" : ""} ${cell.revealed && cell.mine ? "mine" : ""}`;
        return `<button type="button" class="mine-cell ${classes}" data-cell="${index}" ${!active && cell.revealed ? "disabled" : ""} aria-label="Minefield cell ${index + 1}">${content}</button>`;
      }).join("");
      flagElement.textContent = String(flagCount());
      mineElement.textContent = String(settings.mines - flagCount());
      container.querySelectorAll("[data-level]").forEach((button) => button.classList.toggle("active", button.dataset.level === level));
      container.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
    }

    function reveal(index) {
      const cell = board[index];
      if (!active || cell.revealed || cell.flagged) return;
      if (!started) { placeMines(index); startClock(); }
      cell.revealed = true;
      if (cell.mine) { finish(false); return; }
      if (cell.adjacent === 0) neighbors(index).forEach(reveal);
      audio.move();
      if (board.every((candidate) => candidate.mine || candidate.revealed)) finish(true);
      render();
    }

    function toggleFlag(index) {
      const cell = board[index];
      if (!active || cell.revealed) return;
      cell.flagged = !cell.flagged;
      audio.menu();
      render();
    }

    function finish(won) {
      active = false;
      clearInterval(timer);
      if (!won) board.filter((cell) => cell.mine).forEach((cell) => { cell.revealed = true; });
      status(won ? "Sector secured" : "Minefield breached");
      won ? audio.score() : audio.gameOver();
      render();
    }

    function reset() {
      clearInterval(timer);
      board = Array.from({ length: config().columns * config().rows }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }));
      active = true; started = false; seconds = 0; timeElement.textContent = "0:00"; status("Ready to scan"); render();
    }

    boardElement.addEventListener("click", (event) => { const button = event.target.closest("[data-cell]"); if (!button) return; const index = Number(button.dataset.cell); mode === "flag" ? toggleFlag(index) : reveal(index); }, { signal: controller.signal });
    boardElement.addEventListener("contextmenu", (event) => { const button = event.target.closest("[data-cell]"); if (!button) return; event.preventDefault(); toggleFlag(Number(button.dataset.cell)); }, { signal: controller.signal });
    container.querySelectorAll("[data-level]").forEach((button) => button.addEventListener("click", () => { level = button.dataset.level; reset(); }, { signal: controller.signal }));
    container.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => { mode = button.dataset.mode; render(); }, { signal: controller.signal }));
    container.querySelector("[data-restart]").addEventListener("click", reset, { signal: controller.signal });
    reset();
    return { destroy() { clearInterval(timer); controller.abort(); } };
  }
};
