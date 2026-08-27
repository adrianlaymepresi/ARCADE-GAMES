import { audio } from "../../core/audio.js";
import { createChessState, applyMove, getGameStatus, isInCheck, moveMatches, movesForSquare } from "./chess-engine.js";

const pieces = { white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" }, black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" } };
const names = { white: "White", black: "Black" };

export const chessGame = {
  id: "chess",
  title: "Local Chess",
  mount(container) {
    container.innerHTML = `<div class="game-shell"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">Mode <b>2 players</b></span><span class="stat-chip">Turn <b data-turn>White</b></span></div><div class="game-toolbar-actions"><button type="button" data-restart>New game</button></div></div><div class="chess-layout"><div class="chess-board" data-board aria-label="Chess board"></div><aside class="chess-info"><div class="turn-banner" data-status>STATUS<strong>White to move</strong></div><div><p class="modal-kicker">CAPTURED</p><div class="captured-list" data-captured>None yet</div></div><div><p class="modal-kicker">MOVE LOG</p><div class="move-history" data-history>No moves yet</div></div></aside></div></div>`;
    const boardElement = container.querySelector("[data-board]");
    const turnElement = container.querySelector("[data-turn]");
    const statusElement = container.querySelector("[data-status]");
    const captureElement = container.querySelector("[data-captured]");
    const historyElement = container.querySelector("[data-history]");
    const controller = new AbortController();
    let state = createChessState();
    let selected = null;
    let selectedMoves = [];
    let pendingPromotion = null;

    function statusText(status) {
      if (status === "checkmate") return `${names[state.turn]} is checkmated`;
      if (status === "stalemate") return "Stalemate · drawn game";
      if (status === "check") return `${names[state.turn]} is in check`;
      return `${names[state.turn]} to move`;
    }

    function render() {
      const status = getGameStatus(state);
      turnElement.textContent = names[state.turn];
      statusElement.innerHTML = `STATUS<strong>${statusText(status)}</strong>`;
      const checkColor = isInCheck(state, state.turn) ? state.turn : null;
      boardElement.innerHTML = "";
      for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) {
        const piece = state.board[row][column];
        const square = { row, column };
        const button = document.createElement("button");
        button.type = "button";
        button.className = `chess-square ${(row + column) % 2 ? "dark" : "light"}`;
        button.dataset.row = row;
        button.dataset.column = column;
        button.setAttribute("aria-label", `${"abcdefgh"[column]}${8 - row}${piece ? ` ${piece.color} ${piece.type}` : " empty"}`);
        if (selected && selected.row === row && selected.column === column) button.classList.add("selected");
        const option = selectedMoves.find((move) => moveMatches(move, square));
        if (option) button.classList.add(piece ? "capture" : "valid");
        if (state.lastMove && (moveMatches(state.lastMove, square) || state.lastMove.from.row === row && state.lastMove.from.column === column)) button.classList.add("last-move");
        if (checkColor && piece?.type === "king" && piece.color === checkColor) button.classList.add("check");
        button.innerHTML = `${piece ? pieces[piece.color][piece.type] : ""}${column === 0 ? `<span class="rank">${8 - row}</span>` : ""}${row === 7 ? `<span class="file">${"abcdefgh"[column]}</span>` : ""}`;
        boardElement.append(button);
      }
      captureElement.textContent = state.captured.length ? state.captured.map((piece) => pieces[piece.color][piece.type]).join(" ") : "None yet";
      historyElement.innerHTML = state.history.length ? state.history.map((move, index) => index % 2 === 0 ? `<div class="history-row"><span>${Math.floor(index / 2) + 1}.</span><b>${move}</b><i>${state.history[index + 1] || ""}</i></div>` : "").join("") : "No moves yet";
    }

    function clearSelection() { selected = null; selectedMoves = []; pendingPromotion = null; }

    function playMove(move) {
      const result = applyMove(state, move);
      state = result.state;
      clearSelection();
      audio.move();
      if (result.captured) audio.hit();
      render();
    }

    function showPromotion(move, target) {
      pendingPromotion = move;
      const popup = document.createElement("div");
      popup.className = "promotion-popup";
      ["queen", "rook", "bishop", "knight"].forEach((type) => {
        const button = document.createElement("button");
        button.type = "button"; button.textContent = pieces[state.turn][type]; button.setAttribute("aria-label", `Promote to ${type}`);
        button.addEventListener("click", () => playMove({ ...pendingPromotion, promotion: type }), { signal: controller.signal });
        popup.append(button);
      });
      const rect = target.getBoundingClientRect();
      const boardRect = boardElement.getBoundingClientRect();
      popup.style.left = `${Math.max(0, rect.left - boardRect.left - 15)}px`;
      popup.style.top = `${Math.max(0, rect.top - boardRect.top - 45)}px`;
      boardElement.append(popup);
    }

    function selectSquare(square, target) {
      const piece = state.board[square.row][square.column];
      const matchingMove = selectedMoves.find((move) => moveMatches(move, square));
      if (matchingMove) {
        if (matchingMove.promotionRequired) showPromotion(matchingMove, target);
        else playMove(matchingMove);
        return;
      }
      if (piece?.color === state.turn && ["active", "check"].includes(getGameStatus(state))) {
        selected = square; selectedMoves = movesForSquare(state, square); audio.menu(); render();
      } else { clearSelection(); render(); }
    }

    boardElement.addEventListener("click", (event) => {
      const target = event.target.closest(".chess-square");
      if (!target || event.target.closest(".promotion-popup")) return;
      selectSquare({ row: Number(target.dataset.row), column: Number(target.dataset.column) }, target);
    }, { signal: controller.signal });
    container.querySelector("[data-restart]").addEventListener("click", () => { state = createChessState(); clearSelection(); render(); audio.menu(); }, { signal: controller.signal });
    render();
    return { destroy() { controller.abort(); } };
  }
};
