import { audio } from "./core/audio.js";
import { applyTranslations, setLanguage, t } from "./core/i18n.js";
import { renderGameCards } from "./components/game-card.js";
import { GameModal } from "./components/game-modal.js";
import { showToast } from "./components/toast.js";
import { snakeGame } from "./games/snake/snake.js";
import { shooterGame } from "./games/shooter/shooter.js";
import { chessGame } from "./games/chess/chess.js";
import { ticTacToeGame } from "./games/tic-tac-toe/tic-tac-toe.js";
import { tetrisGame } from "./games/tetris/tetris.js";
import { minesweeperGame } from "./games/minesweeper/minesweeper.js";
import { racerGame } from "./games/racer/racer.js";
import { memoryGame } from "./games/memory/memory.js";
import { wordGuessGame } from "./games/word-guess/word-guess.js";

function getGames() {
  return [
    { ...snakeGame, title: t("title.snake"), category: t("games.snake.category"), description: t("games.snake.description"), scoreKey: "snake", tint: "#4cc9f0", help: t("games.snake.help") },
    { ...shooterGame, title: t("title.shooter"), category: t("games.shooter.category"), description: t("games.shooter.description"), scoreKey: "shooter", tint: "#ff6e88", help: t("games.shooter.help") },
    { ...chessGame, title: t("title.chess"), category: t("games.chess.category"), description: t("games.chess.description"), detail: t("games.chess.detail"), tint: "#a98bff", help: t("games.chess.help") },
    { ...ticTacToeGame, title: t("title.tictactoe"), category: t("games.tictactoe.category"), description: t("games.tictactoe.description"), detail: t("games.tictactoe.detail"), tint: "#69dfb4", help: t("games.tictactoe.help") },
    { ...tetrisGame, title: t("title.tetris"), category: t("games.tetris.category"), description: t("games.tetris.description"), scoreKey: "tetris", tint: "#ffca6b", help: t("games.tetris.help") },
    { ...minesweeperGame, title: t("title.minesweeper"), category: t("games.minesweeper.category"), description: t("games.minesweeper.description"), detail: t("games.minesweeper.detail"), tint: "#ff6e88", help: t("games.minesweeper.help") },
    { ...racerGame, title: t("title.racer"), category: t("games.racer.category"), description: t("games.racer.description"), detail: t("games.racer.detail"), tint: "#4cc9f0", help: t("games.racer.help") },
    { ...memoryGame, title: t("title.memory"), category: t("games.memory.category"), description: t("games.memory.description"), detail: t("games.memory.detail"), tint: "#a98bff", help: t("games.memory.help") },
    { ...wordGuessGame, title: t("title.wordguess"), category: t("games.wordguess.category"), description: t("games.wordguess.description"), detail: t("games.wordguess.detail"), tint: "#ffca6b", help: t("games.wordguess.help") }
  ];
}

const grid = document.querySelector("#game-grid");
const soundButton = document.querySelector(".sound-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

function refreshCards() {
  renderGameCards(getGames(), grid);
}

const modal = new GameModal({ onClose: refreshCards });

function updateSoundButton() {
  soundButton.setAttribute("aria-pressed", String(audio.enabled));
  soundButton.innerHTML = `<span aria-hidden="true">${audio.enabled ? "◖" : "◌"}</span> ${t(audio.enabled ? "sound.on" : "sound.off")}`;
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-play-game]");
  if (!button) return;
  const game = getGames().find((candidate) => candidate.id === button.dataset.playGame);
  if (!game) return;
  audio.menu();
  modal.open(game);
});

soundButton.addEventListener("click", () => {
  audio.setEnabled(!audio.enabled);
  updateSoundButton();
  showToast(t(audio.enabled ? "sound.enabled" : "sound.disabled"));
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

document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
document.addEventListener("arcade:score", refreshCards);
document.addEventListener("arcade:language", () => { applyTranslations(); refreshCards(); updateSoundButton(); });
applyTranslations();
refreshCards();
updateSoundButton();
