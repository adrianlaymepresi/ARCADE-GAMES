import { audio } from "../../core/audio.js";
import { createCanvasContext } from "../../core/canvas.js";
import { storage } from "../../core/storage.js";
import { showToast } from "../../components/toast.js";

const boardSize = 500;
const cellCount = 20;
const cellSize = boardSize / cellCount;
const directions = {
  ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 }
};

export const snakeGame = {
  id: "snake",
  title: "Snake Circuit",
  mount(container) {
    container.innerHTML = `<div class="game-shell"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">Score <b data-score>0</b></span><span class="stat-chip">Best <b data-best>${storage.getBestScore("snake")}</b></span><span class="stat-chip">Speed <b data-speed>1</b></span></div><div class="game-toolbar-actions"><button type="button" data-pause>Pause</button><button type="button" data-restart>Restart</button></div></div><div class="snake-layout"><div><div class="canvas-frame"><canvas class="game-canvas snake-canvas" width="500" height="500" aria-label="Snake Circuit game area"></canvas><div class="canvas-overlay" data-overlay><strong>Snake Circuit</strong><span>Route the signal, collect data cores and stay within the grid.</span><button type="button" data-start>Start run</button></div></div><div class="touch-pad" aria-label="Snake touch controls"><button data-dir="up" aria-label="Move up">↑</button><button data-dir="left" aria-label="Move left">←</button><button data-dir="down" aria-label="Move down">↓</button><button data-dir="right" aria-label="Move right">→</button></div></div><aside class="game-side-note"><strong>OBJECTIVE</strong>Collect each data core. Your circuit expands and the clock accelerates each five points.<br><br><strong>CONTROLS</strong>Arrow keys or WASD. Space pauses the run. Touch controls appear on mobile.</aside></div></div>`;
    const canvas = container.querySelector("canvas");
    const context = createCanvasContext(canvas, boardSize, boardSize);
    const overlay = container.querySelector("[data-overlay]");
    const scoreElement = container.querySelector("[data-score]");
    const bestElement = container.querySelector("[data-best]");
    const speedElement = container.querySelector("[data-speed]");
    const pauseButton = container.querySelector("[data-pause]");
    const controller = new AbortController();
    let snake;
    let direction;
    let queuedDirection;
    let food;
    let score;
    let status;
    let timer;

    function randomFood() {
      const available = [];
      for (let y = 0; y < cellCount; y += 1) for (let x = 0; x < cellCount; x += 1) {
        if (!snake.some((part) => part.x === x && part.y === y)) available.push({ x, y });
      }
      return available[Math.floor(Math.random() * available.length)] || { x: 10, y: 10 };
    }

    function reset() {
      snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      direction = { x: 1, y: 0 };
      queuedDirection = direction;
      food = randomFood();
      score = 0;
      status = "ready";
      scoreElement.textContent = score;
      speedElement.textContent = "1";
      pauseButton.textContent = "Pause";
      clearInterval(timer);
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Snake Circuit</strong><span>Route the signal, collect data cores and stay within the grid.</span><button type="button" data-start>Start run</button>`;
      overlay.querySelector("[data-start]").addEventListener("click", start, { signal: controller.signal });
      draw();
    }

    function intervalTime() {
      return Math.max(64, 148 - Math.floor(score / 5) * 12);
    }

    function start() {
      if (status === "playing") return;
      if (status === "gameover") reset();
      status = "playing";
      overlay.hidden = true;
      clearInterval(timer);
      timer = setInterval(step, intervalTime());
      audio.menu();
    }

    function setDirection(next) {
      if (next.x === -direction.x && next.y === -direction.y) return;
      queuedDirection = next;
    }

    function step() {
      if (status !== "playing") return;
      direction = queuedDirection;
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      const collided = head.x < 0 || head.y < 0 || head.x >= cellCount || head.y >= cellCount || snake.some((part) => part.x === head.x && part.y === head.y);
      if (collided) {
        endGame();
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 1;
        scoreElement.textContent = score;
        speedElement.textContent = String(1 + Math.floor(score / 5));
        food = randomFood();
        audio.score();
        clearInterval(timer);
        timer = setInterval(step, intervalTime());
      } else {
        snake.pop();
      }
      draw();
    }

    function endGame() {
      status = "gameover";
      clearInterval(timer);
      const newBest = storage.saveBestScore("snake", score);
      bestElement.textContent = storage.getBestScore("snake");
      if (newBest) showToast(`New Snake record: ${score}`, "success");
      audio.gameOver();
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Signal lost</strong><span>Final score: ${score}${newBest ? " · new record" : ""}</span><button type="button" data-start>Run again</button>`;
      overlay.querySelector("[data-start]").addEventListener("click", () => { reset(); start(); }, { signal: controller.signal });
      document.dispatchEvent(new CustomEvent("arcade:score"));
    }

    function togglePause() {
      if (status === "playing") {
        status = "paused";
        clearInterval(timer);
        pauseButton.textContent = "Resume";
        overlay.hidden = false;
        overlay.innerHTML = "<strong>Paused</strong><span>Press Space or Resume when you are ready.</span>";
      } else if (status === "paused") {
        status = "playing";
        clearInterval(timer);
        timer = setInterval(step, intervalTime());
        pauseButton.textContent = "Pause";
        overlay.hidden = true;
      }
    }

    function draw() {
      context.clearRect(0, 0, boardSize, boardSize);
      context.fillStyle = "#061026";
      context.fillRect(0, 0, boardSize, boardSize);
      context.strokeStyle = "rgba(76,201,240,.08)";
      context.lineWidth = 1;
      for (let index = 0; index <= cellCount; index += 1) {
        const position = index * cellSize;
        context.beginPath(); context.moveTo(position, 0); context.lineTo(position, boardSize); context.stroke();
        context.beginPath(); context.moveTo(0, position); context.lineTo(boardSize, position); context.stroke();
      }
      context.fillStyle = "#4cc9f0";
      context.shadowColor = "#4cc9f0";
      context.shadowBlur = 18;
      context.beginPath();
      context.arc((food.x + .5) * cellSize, (food.y + .5) * cellSize, cellSize * .21, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      snake.slice(1).forEach((part, index) => {
        const inset = 3.2;
        context.fillStyle = index % 2 ? "#294fa8" : "#4361ee";
        context.fillRect(part.x * cellSize + inset, part.y * cellSize + inset, cellSize - inset * 2, cellSize - inset * 2);
        context.fillStyle = "#91e5f6";
        context.fillRect(part.x * cellSize + cellSize * .28, part.y * cellSize + cellSize * .42, cellSize * .44, 2);
      });
      const head = snake[0];
      const angle = Math.atan2(direction.y, direction.x) + Math.PI / 2;
      context.save();
      context.translate((head.x + .5) * cellSize, (head.y + .5) * cellSize);
      context.rotate(angle);
      context.scale(cellSize / 30, cellSize / 30);
      context.shadowColor = "#4cc9f0";
      context.shadowBlur = 10;
      context.fillStyle = "#4361ee";
      context.beginPath(); context.moveTo(-13, 10); context.lineTo(-15, 2); context.lineTo(-8, -4); context.lineTo(-3, 5); context.lineTo(0, -14); context.lineTo(3, 5); context.lineTo(8, -4); context.lineTo(15, 2); context.lineTo(13, 10); context.lineTo(5, 14); context.lineTo(-5, 14); context.closePath(); context.fill();
      context.fillStyle = "#c4dafa";
      context.beginPath(); context.moveTo(-8, 1); context.lineTo(0, -10); context.lineTo(8, 1); context.lineTo(5, 10); context.lineTo(-5, 10); context.closePath(); context.fill();
      context.fillStyle = "#4cc9f0";
      context.beginPath(); context.moveTo(0, -10); context.lineTo(4, -2); context.lineTo(0, 2); context.lineTo(-4, -2); context.closePath(); context.fill();
      context.fillStyle = "#071126";
      context.fillRect(-5, -1, 3, 3); context.fillRect(2, -1, 3, 3);
      context.fillStyle = "#ffca6b";
      context.beginPath(); context.moveTo(-3, 10); context.lineTo(3, 10); context.lineTo(0, 16); context.closePath(); context.fill();
      context.restore();
    }

    document.addEventListener("keydown", (event) => {
      if (directions[event.code]) { event.preventDefault(); setDirection(directions[event.code]); }
      if (event.code === "Space") { event.preventDefault(); togglePause(); }
    }, { signal: controller.signal });
    container.querySelector("[data-pause]").addEventListener("click", togglePause, { signal: controller.signal });
    container.querySelector("[data-restart]").addEventListener("click", reset, { signal: controller.signal });
    container.querySelectorAll("[data-dir]").forEach((button) => button.addEventListener("pointerdown", () => {
      const map = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
      setDirection(map[button.dataset.dir]);
    }, { signal: controller.signal }));
    reset();
    return { destroy() { clearInterval(timer); controller.abort(); } };
  }
};
