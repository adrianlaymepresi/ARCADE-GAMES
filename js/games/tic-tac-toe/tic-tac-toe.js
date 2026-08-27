import { audio } from "../../core/audio.js";
import { getComputerMove, getWinner, openCells } from "./minimax.js";

export const ticTacToeGame = {
  id: "tictactoe",
  title: "Tic-Tac-Toe",
  mount(container) {
    container.innerHTML = `<div class="game-shell ttt-shell"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">Game <b data-mode-label>VS Computer</b></span><span class="stat-chip">AI <b data-difficulty-label>Hard</b></span></div><div class="game-toolbar-actions"><button type="button" data-restart>New round</button></div></div><div class="mode-row" aria-label="Game mode"><button class="choice-button" type="button" data-mode="computer">VS Computer</button><button class="choice-button" type="button" data-mode="local">VS Player</button></div><div class="mode-row" data-difficulties aria-label="Computer difficulty"><button class="choice-button" type="button" data-difficulty="easy">Easy</button><button class="choice-button" type="button" data-difficulty="medium">Medium</button><button class="choice-button" type="button" data-difficulty="hard">Hard</button></div><p class="ttt-status" data-status></p><div class="tic-board" data-board aria-label="Tic-Tac-Toe board"></div></div>`;
    const boardElement = container.querySelector("[data-board]");
    const statusElement = container.querySelector("[data-status]");
    const modeLabel = container.querySelector("[data-mode-label]");
    const difficultyLabel = container.querySelector("[data-difficulty-label]");
    const difficultyRow = container.querySelector("[data-difficulties]");
    const controller = new AbortController();
    let board;
    let turn;
    let mode = "computer";
    let difficulty = "hard";
    let completed;
    let computerTimer;

    function reset() {
      clearTimeout(computerTimer);
      board = Array(9).fill(null);
      turn = "X";
      completed = false;
      render();
    }

    function status() {
      const winner = getWinner(board);
      if (winner) return mode === "computer" ? winner.player === "X" ? "You won the round." : "Computer wins this round." : `${winner.player} wins this round.`;
      if (!openCells(board).length) return "Draw game. No moves left.";
      if (mode === "computer") return turn === "X" ? "Your turn · place an X" : "Computer is calculating…";
      return `${turn}'s turn`;
    }

    function render() {
      const winner = getWinner(board);
      modeLabel.textContent = mode === "computer" ? "VS Computer" : "VS Player";
      difficultyLabel.textContent = mode === "computer" ? difficulty[0].toUpperCase() + difficulty.slice(1) : "—";
      difficultyRow.hidden = mode !== "computer";
      container.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
      container.querySelectorAll("[data-difficulty]").forEach((button) => button.classList.toggle("active", button.dataset.difficulty === difficulty));
      statusElement.textContent = status();
      boardElement.innerHTML = board.map((value, index) => `<button class="tic-cell ${value === "O" ? "o" : ""} ${winner?.line.includes(index) ? "winner" : ""}" type="button" data-cell="${index}" ${value || completed || mode === "computer" && turn === "O" ? "disabled" : ""} aria-label="Cell ${index + 1}${value ? ` occupied by ${value}` : " empty"}">${value === "O" ? "<span class=\"o-mark\"></span>" : value === "X" ? "<span class=\"x-mark\">×</span>" : ""}</button>`).join("");
    }

    function finishIfNeeded() {
      if (getWinner(board) || !openCells(board).length) { completed = true; audio.score(); return true; }
      return false;
    }

    function placeMark(index) {
      if (completed || board[index]) return;
      board[index] = turn;
      audio.move();
      if (finishIfNeeded()) { render(); return; }
      turn = turn === "X" ? "O" : "X";
      render();
      if (mode === "computer" && turn === "O") {
        computerTimer = setTimeout(() => {
          if (completed || turn !== "O") return;
          const move = getComputerMove(board, difficulty);
          board[move] = "O";
          audio.move();
          if (!finishIfNeeded()) turn = "X";
          render();
        }, 350);
      }
    }

    boardElement.addEventListener("click", (event) => { const button = event.target.closest("[data-cell]"); if (button) placeMark(Number(button.dataset.cell)); }, { signal: controller.signal });
    container.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => { mode = button.dataset.mode; reset(); audio.menu(); }, { signal: controller.signal }));
    container.querySelectorAll("[data-difficulty]").forEach((button) => button.addEventListener("click", () => { difficulty = button.dataset.difficulty; reset(); audio.menu(); }, { signal: controller.signal }));
    container.querySelector("[data-restart]").addEventListener("click", () => { reset(); audio.menu(); }, { signal: controller.signal });
    reset();
    return { destroy() { clearTimeout(computerTimer); controller.abort(); } };
  }
};
