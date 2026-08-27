import { audio } from "../../core/audio.js";
import { createCanvasContext, randomItem } from "../../core/canvas.js";
import { storage } from "../../core/storage.js";
import { showToast } from "../../components/toast.js";

const columns = 10;
const rows = 20;
const block = 30;
const tetrominoes = [
  { name: "I", color: "#4cc9f0", shape: [[1, 1, 1, 1]] },
  { name: "O", color: "#ffca6b", shape: [[1, 1], [1, 1]] },
  { name: "T", color: "#a98bff", shape: [[0, 1, 0], [1, 1, 1]] },
  { name: "S", color: "#69dfb4", shape: [[0, 1, 1], [1, 1, 0]] },
  { name: "Z", color: "#ff6e88", shape: [[1, 1, 0], [0, 1, 1]] },
  { name: "J", color: "#627eff", shape: [[1, 0, 0], [1, 1, 1]] },
  { name: "L", color: "#ff9d72", shape: [[0, 0, 1], [1, 1, 1]] }
];

const rotate = (shape) => shape[0].map((_, index) => shape.map((row) => row[index]).reverse());
const createBoard = () => Array.from({ length: rows }, () => Array(columns).fill(null));

export const tetrisGame = {
  id: "tetris",
  title: "Tetris Matrix",
  mount(container) {
    container.innerHTML = `<div class="game-shell"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">Score <b data-score>0</b></span><span class="stat-chip">Best <b data-best>${storage.getBestScore("tetris")}</b></span><span class="stat-chip">Lines <b data-lines>0</b></span><span class="stat-chip">Level <b data-level>1</b></span></div><div class="game-toolbar-actions"><button type="button" data-pause>Pause</button><button type="button" data-restart>Restart</button></div></div><div class="tetris-layout"><div class="canvas-frame"><canvas class="game-canvas tetris-canvas" width="300" height="600" aria-label="Tetris Matrix game area"></canvas><div class="canvas-overlay" data-overlay><strong>Tetris Matrix</strong><span>Organize the incoming modules into clean lines.</span><button type="button" data-start>Start stack</button></div></div><aside class="tetris-side"><div class="game-panel"><p>NEXT MODULE</p><canvas class="next-preview" width="160" height="138" aria-label="Next Tetris piece"></canvas></div><div class="game-panel"><p>CONTROLS</p><strong>← → ↑ ↓</strong><p>Space drops · P pauses</p></div></aside></div><div class="mobile-controls" aria-label="Tetris touch controls"><div class="move-controls"><button data-action="left" aria-label="Move left">←</button><button data-action="right" aria-label="Move right">→</button></div><div class="move-controls"><button data-action="rotate" aria-label="Rotate">↻</button><button data-action="drop" aria-label="Hard drop">⇩</button></div></div></div>`;
    const canvas = container.querySelector(".tetris-canvas");
    const preview = container.querySelector(".next-preview");
    const context = createCanvasContext(canvas, columns * block, rows * block);
    const previewContext = createCanvasContext(preview, 160, 138);
    const overlay = container.querySelector("[data-overlay]");
    const scoreElement = container.querySelector("[data-score]");
    const bestElement = container.querySelector("[data-best]");
    const linesElement = container.querySelector("[data-lines]");
    const levelElement = container.querySelector("[data-level]");
    const pauseButton = container.querySelector("[data-pause]");
    const controller = new AbortController();
    let frame;
    let lastTime;
    let game;
    let bag = [];

    function takePiece() {
      if (!bag.length) bag = [...tetrominoes].sort(() => Math.random() - .5);
      const base = bag.pop() || randomItem(tetrominoes);
      return { ...base, shape: base.shape.map((row) => [...row]) };
    }

    function reset() {
      cancelAnimationFrame(frame);
      bag = [];
      game = { board: createBoard(), score: 0, lines: 0, level: 1, status: "ready", next: takePiece(), active: null, dropClock: 0 };
      spawn();
      scoreElement.textContent = "0"; linesElement.textContent = "0"; levelElement.textContent = "1"; pauseButton.textContent = "Pause";
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Tetris Matrix</strong><span>Organize the incoming modules into clean lines.</span><button type="button" data-start>Start stack</button>`;
      overlay.querySelector("[data-start]").addEventListener("click", start, { signal: controller.signal });
      draw();
    }

    function spawn() {
      const piece = game.next;
      game.next = takePiece();
      game.active = { ...piece, x: Math.floor((columns - piece.shape[0].length) / 2), y: -1 };
      if (collides(game.active, 0, 0, game.active.shape)) game.status = "gameover";
    }

    function collides(piece, offsetX, offsetY, shape) {
      return shape.some((line, y) => line.some((value, x) => {
        if (!value) return false;
        const boardX = piece.x + x + offsetX;
        const boardY = piece.y + y + offsetY;
        return boardX < 0 || boardX >= columns || boardY >= rows || boardY >= 0 && game.board[boardY][boardX];
      }));
    }

    function move(offsetX, offsetY) {
      if (game.status !== "playing" || collides(game.active, offsetX, offsetY, game.active.shape)) return false;
      game.active.x += offsetX; game.active.y += offsetY; audio.move(); return true;
    }

    function rotatePiece() {
      if (game.status !== "playing") return;
      const shape = rotate(game.active.shape);
      const kicks = [0, -1, 1, -2, 2];
      const kick = kicks.find((offset) => !collides(game.active, offset, 0, shape));
      if (kick === undefined) return;
      game.active.shape = shape; game.active.x += kick; audio.move();
    }

    function lockPiece() {
      game.active.shape.forEach((line, y) => line.forEach((value, x) => {
        const boardY = game.active.y + y;
        if (value && boardY >= 0) game.board[boardY][game.active.x + x] = game.active.color;
      }));
      const cleared = clearLines();
      if (cleared) {
        game.lines += cleared;
        game.level = 1 + Math.floor(game.lines / 10);
        game.score += [0, 100, 300, 500, 800][cleared] * game.level;
        audio.clear();
      }
      spawn();
      if (game.status === "gameover") endGame();
    }

    function clearLines() {
      let cleared = 0;
      game.board = game.board.filter((line) => {
        const full = line.every(Boolean);
        if (full) cleared += 1;
        return !full;
      });
      while (game.board.length < rows) game.board.unshift(Array(columns).fill(null));
      return cleared;
    }

    function hardDrop() {
      if (game.status !== "playing") return;
      let distance = 0;
      while (move(0, 1)) distance += 1;
      game.score += distance * 2;
      lockPiece();
    }

    function start() {
      if (game.status === "gameover") { reset(); }
      if (game.status === "playing") return;
      game.status = "playing"; overlay.hidden = true; lastTime = performance.now(); frame = requestAnimationFrame(loop); audio.menu();
    }

    function endGame() {
      cancelAnimationFrame(frame);
      const newBest = storage.saveBestScore("tetris", game.score);
      bestElement.textContent = storage.getBestScore("tetris");
      if (newBest) showToast(`New Tetris record: ${game.score}`, "success");
      audio.gameOver();
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Matrix saturated</strong><span>Final score: ${game.score}</span><button type="button" data-start>Start again</button>`;
      overlay.querySelector("[data-start]").addEventListener("click", () => { reset(); start(); }, { signal: controller.signal });
      document.dispatchEvent(new CustomEvent("arcade:score"));
    }

    function update(delta) {
      game.dropClock += delta;
      const speed = Math.max(.08, .78 - (game.level - 1) * .06);
      if (game.dropClock >= speed) {
        game.dropClock = 0;
        if (!move(0, 1)) lockPiece();
      }
      scoreElement.textContent = game.score.toLocaleString();
      linesElement.textContent = String(game.lines);
      levelElement.textContent = String(game.level);
    }

    function drawBlock(target, x, y, color, size = block) {
      target.fillStyle = color; target.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      target.fillStyle = "rgba(255,255,255,.2)"; target.fillRect(x * size + 3, y * size + 3, size - 6, 3);
      target.fillStyle = "rgba(0,0,0,.16)"; target.fillRect(x * size + 3, y * size + size - 6, size - 6, 3);
    }

    function draw() {
      context.fillStyle = "#061026"; context.fillRect(0, 0, columns * block, rows * block);
      context.strokeStyle = "rgba(76,201,240,.07)";
      for (let x = 0; x <= columns; x += 1) { context.beginPath(); context.moveTo(x * block, 0); context.lineTo(x * block, rows * block); context.stroke(); }
      for (let y = 0; y <= rows; y += 1) { context.beginPath(); context.moveTo(0, y * block); context.lineTo(columns * block, y * block); context.stroke(); }
      game.board.forEach((line, y) => line.forEach((color, x) => { if (color) drawBlock(context, x, y, color); }));
      game.active.shape.forEach((line, y) => line.forEach((value, x) => { if (value && game.active.y + y >= 0) drawBlock(context, game.active.x + x, game.active.y + y, game.active.color); }));
      previewContext.fillStyle = "#061026"; previewContext.fillRect(0, 0, 160, 138);
      const previewSize = 23;
      const shape = game.next.shape;
      const offsetX = (160 - shape[0].length * previewSize) / 2;
      const offsetY = (138 - shape.length * previewSize) / 2;
      shape.forEach((line, y) => line.forEach((value, x) => { if (value) { previewContext.fillStyle = game.next.color; previewContext.fillRect(offsetX + x * previewSize + 1, offsetY + y * previewSize + 1, previewSize - 2, previewSize - 2); } }));
    }

    function loop(time) {
      const delta = Math.min(.05, (time - lastTime) / 1000);
      lastTime = time;
      if (game.status === "playing") update(delta);
      draw();
      if (game.status === "playing") frame = requestAnimationFrame(loop);
    }

    function togglePause() {
      if (game.status === "playing") { game.status = "paused"; cancelAnimationFrame(frame); pauseButton.textContent = "Resume"; overlay.hidden = false; overlay.innerHTML = "<strong>Paused</strong><span>The matrix is waiting.</span>"; }
      else if (game.status === "paused") { pauseButton.textContent = "Pause"; overlay.hidden = true; start(); }
    }

    document.addEventListener("keydown", (event) => {
      const actions = { ArrowLeft: () => move(-1, 0), ArrowRight: () => move(1, 0), ArrowDown: () => move(0, 1), ArrowUp: rotatePiece, KeyX: rotatePiece, Space: hardDrop, KeyP: togglePause };
      if (actions[event.code]) { event.preventDefault(); actions[event.code](); draw(); }
    }, { signal: controller.signal });
    container.querySelector("[data-pause]").addEventListener("click", togglePause, { signal: controller.signal });
    container.querySelector("[data-restart]").addEventListener("click", reset, { signal: controller.signal });
    container.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("pointerdown", () => { ({ left: () => move(-1, 0), right: () => move(1, 0), rotate: rotatePiece, drop: hardDrop })[button.dataset.action](); draw(); }, { signal: controller.signal }));
    reset();
    return { destroy() { cancelAnimationFrame(frame); controller.abort(); } };
  }
};
