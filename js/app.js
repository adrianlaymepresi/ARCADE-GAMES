import { audio } from "./core/audio.js";
import { renderGameCards } from "./components/game-card.js";
import { GameModal } from "./components/game-modal.js";
import { showToast } from "./components/toast.js";
import { snakeGame } from "./games/snake/snake.js";
import { shooterGame } from "./games/shooter/shooter.js";
import { chessGame } from "./games/chess/chess.js";
import { ticTacToeGame } from "./games/tic-tac-toe/tic-tac-toe.js";
import { tetrisGame } from "./games/tetris/tetris.js";

const games = [
  { ...snakeGame, category: "Canvas · Reflex", description: "Route a growing signal through a responsive circuit grid.", scoreKey: "snake", tint: "#4cc9f0", help: "<strong>Objective:</strong> collect data cores and keep the circuit alive. <strong>Keyboard:</strong> Arrow keys or WASD to move; Space pauses. <strong>Touch:</strong> use the directional controls below the board." },
  { ...shooterGame, category: "Canvas · Action", description: "Navigate an endless hostile sector with a hand-built flight system.", scoreKey: "shooter", tint: "#ff6e88", help: "<strong>Objective:</strong> survive an endless enemy fleet and raise your score. <strong>Keyboard:</strong> Arrow keys or WASD to steer, Space to fire, P to pause. <strong>Touch:</strong> hold the controls below the screen." },
  { ...chessGame, category: "Rules · Strategy", description: "A complete local chess board with legal moves and special rules.", detail: "Local 2P", tint: "#a98bff", help: "<strong>Objective:</strong> checkmate your opponent's king. The board enforces turns, check, castling, en passant and promotion. Select a piece, then select one of its highlighted legal destinations." },
  { ...ticTacToeGame, category: "AI · Minimax", description: "Play locally or face a difficulty-tuned computer opponent.", detail: "3 modes", tint: "#69dfb4", help: "<strong>Objective:</strong> make three in a row. Select VS Player for local turns, or VS Computer and choose Easy, Medium or Hard. Hard uses a complete Minimax search and cannot be beaten." },
  { ...tetrisGame, category: "Canvas · Puzzle", description: "Stack seven classic modules, clear lines and beat the matrix.", scoreKey: "tetris", tint: "#ffca6b", help: "<strong>Objective:</strong> make complete horizontal lines. <strong>Keyboard:</strong> Left/Right to move, Down to soft drop, Up or X to rotate, Space to hard drop and P to pause. Touch buttons appear below on mobile." }
];

const grid = document.querySelector("#game-grid");
const soundButton = document.querySelector(".sound-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

function refreshCards() {
  renderGameCards(games, grid);
}

const modal = new GameModal({ onClose: refreshCards });

function updateSoundButton() {
  soundButton.setAttribute("aria-pressed", String(audio.enabled));
  soundButton.innerHTML = `<span aria-hidden="true">${audio.enabled ? "◖" : "◌"}</span> Sound ${audio.enabled ? "on" : "off"}`;
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-play-game]");
  if (!button) return;
  const game = games.find((candidate) => candidate.id === button.dataset.playGame);
  if (!game) return;
  audio.menu();
  modal.open(game);
});

soundButton.addEventListener("click", () => {
  audio.setEnabled(!audio.enabled);
  updateSoundButton();
  showToast(`Sound ${audio.enabled ? "enabled" : "disabled"}`);
});

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open", !expanded);
});

navLinks.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
});

document.addEventListener("arcade:score", refreshCards);
refreshCards();
updateSoundButton();
