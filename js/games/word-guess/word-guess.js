import { audio } from "../../core/audio.js";
import { t } from "../../core/i18n.js";

const dictionaries = {
  es: {
    4: ["LUNA", "CASA", "RUTA", "GATO", "AZUL", "ROJO"],
    5: ["NUBE", "JUEGO", "LAPIZ", "FUEGO", "TIGRE", "NOCHE"],
    6: ["CODIGO", "JARDIN", "BOSQUE", "RITMO", "PUENTE", "TURBOS"],
    7: ["CAMINOS", "VIAJERO", "VENTANA", "MUSICAL", "CEREBRO", "PINTURA"],
    8: ["PANTALLA", "ESTRELLA", "CARRERAS", "TECLADOS", "AVENTURA", "RECUERDO"]
  },
  en: {
    4: ["CODE", "GAME", "STAR", "MOON", "ROAD", "WAVE"],
    5: ["PIXEL", "FRAME", "SPACE", "TRACK", "LEVEL", "SNAKE"],
    6: ["CANVAS", "ROCKET", "PLAYER", "PUZZLE", "MEMORY", "CODING"],
    7: ["CIRCUIT", "BROWSER", "JOURNEY", "RACECAR", "SIGNALS", "VIRTUAL"],
    8: ["LANGUAGE", "COMPILER", "KEYBOARD", "FUNCTION", "VARIABLE", "PLATFORM"]
  }
};

function evaluateGuess(guess, word) {
  const marks = Array(word.length).fill("absent");
  const available = word.split("");
  guess.split("").forEach((letter, index) => { if (letter === word[index]) { marks[index] = "correct"; available[index] = null; } });
  guess.split("").forEach((letter, index) => { if (marks[index] === "correct") return; const found = available.indexOf(letter); if (found >= 0) { marks[index] = "present"; available[found] = null; } });
  return marks;
}

export const wordGuessGame = {
  id: "wordguess",
  title: "Word Signal",
  mount(container) {
    container.innerHTML = `<div class="game-shell word-shell" data-game="wordguess"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">LETTERS<b data-length>5</b></span><span class="stat-chip">${t("game.attempts")}<b data-attempts>0 / 6</b></span><span class="stat-chip">LANGUAGE<b data-language-label>ES</b></span></div><div class="game-toolbar-actions"><button type="button" data-new>${t("game.newGame")}</button></div></div><div class="word-settings"><label>LANGUAGE<select data-word-language><option value="es">ES</option><option value="en">EN</option></select></label><label>LETTERS<select data-word-length><option value="4">4</option><option value="5" selected>5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select></label><label>${t("game.attempts")}<input data-attempt-input type="number" min="3" max="10" value="6"></label><button class="button button-primary" type="button" data-start>${t("game.startSession")}</button></div><p class="word-status" data-status>Choose a language, word length and attempts.</p><div class="word-board" data-board aria-label="Word guess board"></div><form class="word-form" data-form><input data-input type="text" autocapitalize="characters" autocomplete="off" spellcheck="false" aria-label="Type your word guess" disabled><button type="submit" class="button button-primary" data-submit disabled>${t("game.submit")}</button></form></div>`;
    const boardElement = container.querySelector("[data-board]");
    const statusElement = container.querySelector("[data-status]");
    const lengthElement = container.querySelector("[data-length]");
    const attemptsElement = container.querySelector("[data-attempts]");
    const languageLabel = container.querySelector("[data-language-label]");
    const languageInput = container.querySelector("[data-word-language]");
    const lengthInput = container.querySelector("[data-word-length]");
    const attemptInput = container.querySelector("[data-attempt-input]");
    const form = container.querySelector("[data-form]");
    const textInput = container.querySelector("[data-input]");
    const submit = container.querySelector("[data-submit]");
    const controller = new AbortController();
    let word = "";
    let guesses = [];
    let maxAttempts = 6;
    let phase = "ready";

    function render() {
      const length = Number(lengthInput.value);
      boardElement.style.setProperty("--word-length", String(length));
      boardElement.innerHTML = Array.from({ length: maxAttempts }, (_, row) => {
        const guess = guesses[row];
        return `<div class="word-row">${Array.from({ length }, (_, column) => `<span class="word-tile ${guess?.marks[column] || ""}">${guess?.word[column] || ""}</span>`).join("")}</div>`;
      }).join("");
      lengthElement.textContent = String(length);
      attemptsElement.textContent = `${guesses.length} / ${maxAttempts}`;
      languageLabel.textContent = languageInput.value.toUpperCase();
    }

    function startRound() {
      const language = languageInput.value;
      const length = Number(lengthInput.value);
      maxAttempts = Math.max(3, Math.min(10, Number(attemptInput.value) || 6));
      attemptInput.value = maxAttempts;
      const words = dictionaries[language][length];
      word = words[Math.floor(Math.random() * words.length)];
      guesses = [];
      phase = "playing";
      textInput.value = "";
      textInput.maxLength = length;
      textInput.disabled = false;
      submit.disabled = false;
      statusElement.textContent = language === "es" ? "La señal está oculta. Escribe una palabra de la longitud indicada." : "The signal is hidden. Type a word with the selected length.";
      render();
      textInput.focus();
      audio.menu();
    }

    function finish(won) {
      phase = won ? "complete" : "failed";
      textInput.disabled = true;
      submit.disabled = true;
      statusElement.textContent = won ? (languageInput.value === "es" ? `¡Correcto! Descubriste ${word}.` : `Correct! You discovered ${word}.`) : (languageInput.value === "es" ? `La palabra era ${word}.` : `The word was ${word}.`);
      won ? audio.score() : audio.gameOver();
      render();
    }

    function submitGuess() {
      if (phase !== "playing") return;
      const guess = textInput.value.trim().toLocaleUpperCase(languageInput.value === "es" ? "es" : "en");
      if (guess.length !== word.length || !/^[A-ZÑ]+$/.test(guess)) {
        statusElement.textContent = languageInput.value === "es" ? `Escribe exactamente ${word.length} letras.` : `Enter exactly ${word.length} letters.`;
        return;
      }
      guesses.push({ word: guess, marks: evaluateGuess(guess, word) });
      textInput.value = "";
      if (guess === word) { finish(true); return; }
      if (guesses.length >= maxAttempts) { finish(false); return; }
      statusElement.textContent = languageInput.value === "es" ? "Verde: letra y posición. Naranja: letra presente." : "Green: letter and position. Orange: letter present.";
      audio.move();
      render();
      textInput.focus();
    }

    form.addEventListener("submit", (event) => { event.preventDefault(); submitGuess(); }, { signal: controller.signal });
    container.querySelector("[data-start]").addEventListener("click", startRound, { signal: controller.signal });
    container.querySelector("[data-new]").addEventListener("click", startRound, { signal: controller.signal });
    textInput.addEventListener("input", () => { textInput.value = textInput.value.replace(/[^a-zA-ZñÑ]/g, "").toUpperCase(); }, { signal: controller.signal });
    render();
    return { destroy() { controller.abort(); } };
  }
};
