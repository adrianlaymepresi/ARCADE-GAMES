import { audio } from "../../core/audio.js";
import { clamp, createCanvasContext, rectsOverlap } from "../../core/canvas.js";
import { storage } from "../../core/storage.js";
import { showToast } from "../../components/toast.js";

const width = 600;
const height = 720;

export const shooterGame = {
  id: "shooter",
  title: "Void Runner",
  mount(container) {
    container.innerHTML = `<div class="game-shell"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">Score <b data-score>0</b></span><span class="stat-chip">Best <b data-best>${storage.getBestScore("shooter")}</b></span><span class="stat-chip">Hull <b data-health>3</b></span><span class="stat-chip">Wave <b data-wave>1</b></span></div><div class="game-toolbar-actions"><button type="button" data-pause>Pause</button><button type="button" data-restart>Restart</button></div></div><div class="canvas-frame shooter-canvas"><canvas class="game-canvas" width="600" height="720" aria-label="Void Runner shooter game area"></canvas><div class="canvas-overlay" data-overlay><strong>Void Runner</strong><span>Hold fire, navigate the fleet and survive the expanding void.</span><button type="button" data-start>Launch</button></div></div><div class="mobile-controls" aria-label="Shooter touch controls"><div class="move-controls"><button data-move="left" aria-label="Move left">←</button><button data-move="right" aria-label="Move right">→</button></div><button data-fire aria-label="Fire weapon">FIRE</button></div></div>`;
    const canvas = container.querySelector("canvas");
    const context = createCanvasContext(canvas, width, height);
    const scoreElement = container.querySelector("[data-score]");
    const bestElement = container.querySelector("[data-best]");
    const healthElement = container.querySelector("[data-health]");
    const waveElement = container.querySelector("[data-wave]");
    const overlay = container.querySelector("[data-overlay]");
    const pauseButton = container.querySelector("[data-pause]");
    const controller = new AbortController();
    const keys = new Set();
    let frame;
    let lastTime;
    let state;

    function makeStars() {
      return Array.from({ length: 70 }, () => ({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + .5, speed: Math.random() * 85 + 30 }));
    }

    function reset() {
      cancelAnimationFrame(frame);
      state = {
        status: "ready", score: 0, wave: 1, spawnClock: 0, shotClock: 0, invulnerable: 0,
        player: { x: width / 2 - 22, y: height - 100, width: 44, height: 52, health: 3 }, bullets: [], enemies: [], particles: [], stars: makeStars()
      };
      scoreElement.textContent = "0";
      healthElement.textContent = "3";
      waveElement.textContent = "1";
      pauseButton.textContent = "Pause";
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Void Runner</strong><span>Hold fire, navigate the fleet and survive the expanding void.</span><button type="button" data-start>Launch</button>`;
      overlay.querySelector("[data-start]").addEventListener("click", start, { signal: controller.signal });
      draw();
    }

    function start() {
      if (state.status === "playing") return;
      state.status = "playing";
      overlay.hidden = true;
      lastTime = performance.now();
      frame = requestAnimationFrame(loop);
      audio.menu();
    }

    function createEnemy() {
      const types = [
        { type: "scout", width: 34, height: 34, health: 1, speed: 95, points: 90 },
        { type: "drifter", width: 42, height: 36, health: 2, speed: 72, points: 170 },
        { type: "tank", width: 56, height: 48, health: 4, speed: 48, points: 360 }
      ];
      const selection = types[Math.min(2, Math.floor(Math.random() * 3 + state.wave / 5))] || types[0];
      state.enemies.push({ ...selection, x: 35 + Math.random() * (width - selection.width - 70), y: -60, age: 0, phase: Math.random() * Math.PI * 2 });
    }

    function fire() {
      if (state.status !== "playing" || state.shotClock > 0) return;
      const player = state.player;
      state.bullets.push({ x: player.x + player.width / 2 - 3, y: player.y - 12, width: 6, height: 18, speed: 520 });
      state.shotClock = .16;
      audio.shoot();
    }

    function burst(x, y, color, count = 12) {
      for (let index = 0; index < count; index += 1) state.particles.push({ x, y, vx: (Math.random() - .5) * 260, vy: (Math.random() - .5) * 260, life: .45 + Math.random() * .35, maxLife: .8, color });
    }

    function hurtPlayer() {
      if (state.invulnerable > 0) return;
      state.player.health -= 1;
      state.invulnerable = 1.15;
      healthElement.textContent = String(state.player.health);
      burst(state.player.x + 22, state.player.y + 25, "#ff6e88", 24);
      audio.hit();
      if (state.player.health <= 0) endGame();
    }

    function endGame() {
      state.status = "gameover";
      const newBest = storage.saveBestScore("shooter", state.score);
      bestElement.textContent = storage.getBestScore("shooter");
      if (newBest) showToast(`New Void Runner record: ${state.score}`, "success");
      audio.gameOver();
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Ship lost</strong><span>Score ${state.score} · reached wave ${state.wave}</span><button type="button" data-start>Launch again</button>`;
      overlay.querySelector("[data-start]").addEventListener("click", () => { reset(); start(); }, { signal: controller.signal });
      document.dispatchEvent(new CustomEvent("arcade:score"));
    }

    function update(delta) {
      const levelSpeed = 1 + (state.wave - 1) * .12;
      state.stars.forEach((star) => { star.y += star.speed * levelSpeed * delta; if (star.y > height) { star.y = -4; star.x = Math.random() * width; } });
      state.shotClock -= delta;
      state.invulnerable -= delta;
      const player = state.player;
      const moveX = (keys.has("ArrowRight") || keys.has("KeyD") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("KeyA") ? 1 : 0);
      const moveY = (keys.has("ArrowDown") || keys.has("KeyS") ? 1 : 0) - (keys.has("ArrowUp") || keys.has("KeyW") ? 1 : 0);
      player.x = clamp(player.x + moveX * 310 * delta, 15, width - player.width - 15);
      player.y = clamp(player.y + moveY * 310 * delta, height * .5, height - player.height - 20);
      if (keys.has("Space")) fire();
      state.spawnClock += delta;
      const spawnDelay = Math.max(.34, 1.08 - state.wave * .055);
      if (state.spawnClock > spawnDelay) { state.spawnClock = 0; createEnemy(); }
      state.bullets.forEach((bullet) => { bullet.y -= bullet.speed * delta; });
      state.enemies.forEach((enemy) => {
        enemy.age += delta;
        enemy.y += enemy.speed * levelSpeed * delta;
        if (enemy.type === "drifter") enemy.x += Math.sin(enemy.age * 2.5 + enemy.phase) * 80 * delta;
        if (enemy.type === "scout") enemy.x += Math.cos(enemy.age * 3 + enemy.phase) * 45 * delta;
        enemy.x = clamp(enemy.x, 8, width - enemy.width - 8);
      });
      state.bullets.forEach((bullet) => state.enemies.forEach((enemy) => {
        if (!bullet.dead && !enemy.dead && rectsOverlap(bullet, enemy)) {
          bullet.dead = true; enemy.health -= 1; burst(bullet.x, bullet.y, "#91e5f6", 5); audio.hit();
          if (enemy.health <= 0) { enemy.dead = true; state.score += enemy.points; burst(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, "#4cc9f0", 18); audio.score(); }
        }
      }));
      state.enemies.forEach((enemy) => {
        if (!enemy.dead && rectsOverlap(player, enemy)) { enemy.dead = true; hurtPlayer(); }
        if (enemy.y > height + 60) enemy.dead = true;
      });
      state.particles.forEach((particle) => { particle.x += particle.vx * delta; particle.y += particle.vy * delta; particle.life -= delta; });
      state.bullets = state.bullets.filter((bullet) => !bullet.dead && bullet.y > -30);
      state.enemies = state.enemies.filter((enemy) => !enemy.dead);
      state.particles = state.particles.filter((particle) => particle.life > 0);
      state.wave = 1 + Math.floor(state.score / 1100);
      scoreElement.textContent = state.score.toLocaleString();
      waveElement.textContent = String(state.wave);
    }

    function drawShip(player) {
      context.save();
      context.translate(player.x + player.width / 2, player.y + player.height / 2);
      if (state.invulnerable > 0 && Math.floor(state.invulnerable * 12) % 2 === 0) context.globalAlpha = .35;
      context.shadowColor = "#4cc9f0"; context.shadowBlur = 18;
      context.fillStyle = "#91e5f6";
      context.beginPath(); context.moveTo(0, -28); context.lineTo(20, 23); context.lineTo(0, 15); context.lineTo(-20, 23); context.closePath(); context.fill();
      context.fillStyle = "#4361ee";
      context.beginPath(); context.moveTo(0, -15); context.lineTo(8, 15); context.lineTo(-8, 15); context.closePath(); context.fill();
      context.fillStyle = "#f5fbff"; context.fillRect(-3, -10, 6, 10);
      context.restore();
    }

    function drawEnemy(enemy) {
      context.save(); context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      context.shadowColor = enemy.type === "tank" ? "#ffca6b" : "#ff6e88"; context.shadowBlur = 10;
      context.fillStyle = enemy.type === "tank" ? "#ffca6b" : enemy.type === "drifter" ? "#b394ff" : "#ff6e88";
      context.beginPath();
      if (enemy.type === "scout") { context.moveTo(0, 20); context.lineTo(18, -16); context.lineTo(0, -8); context.lineTo(-18, -16); }
      else if (enemy.type === "drifter") { context.moveTo(-20, -12); context.lineTo(0, -20); context.lineTo(20, -12); context.lineTo(14, 17); context.lineTo(-14, 17); }
      else { context.roundRect(-28, -20, 56, 40, 8); }
      context.closePath(); context.fill();
      context.fillStyle = "#071126"; context.fillRect(-5, -4, 10, 9); context.restore();
    }

    function draw() {
      context.fillStyle = "#050d22"; context.fillRect(0, 0, width, height);
      state.stars.forEach((star) => { context.fillStyle = `rgba(196,218,250,${.35 + star.size / 4})`; context.fillRect(star.x, star.y, star.size, star.size); });
      state.particles.forEach((particle) => { context.globalAlpha = particle.life / particle.maxLife; context.fillStyle = particle.color; context.fillRect(particle.x, particle.y, 3, 3); });
      context.globalAlpha = 1;
      state.bullets.forEach((bullet) => { context.fillStyle = "#91e5f6"; context.shadowColor = "#4cc9f0"; context.shadowBlur = 12; context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); });
      context.shadowBlur = 0;
      state.enemies.forEach(drawEnemy); drawShip(state.player);
      context.fillStyle = "rgba(145,229,246,.09)"; context.fillRect(10, 10, width - 20, 2);
    }

    function loop(time) {
      const delta = Math.min(.034, (time - lastTime) / 1000);
      lastTime = time;
      if (state.status === "playing") update(delta);
      draw();
      if (state.status === "playing") frame = requestAnimationFrame(loop);
    }

    function togglePause() {
      if (state.status === "playing") {
        state.status = "paused"; cancelAnimationFrame(frame); pauseButton.textContent = "Resume"; overlay.hidden = false; overlay.innerHTML = "<strong>Paused</strong><span>Systems held. Resume when ready.</span>";
      } else if (state.status === "paused") { pauseButton.textContent = "Pause"; overlay.hidden = true; start(); }
    }

    document.addEventListener("keydown", (event) => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) { keys.add(event.code); event.preventDefault(); } if (event.code === "KeyP") togglePause(); }, { signal: controller.signal });
    document.addEventListener("keyup", (event) => keys.delete(event.code), { signal: controller.signal });
    container.querySelector("[data-pause]").addEventListener("click", togglePause, { signal: controller.signal });
    container.querySelector("[data-restart]").addEventListener("click", reset, { signal: controller.signal });
    container.querySelectorAll("[data-move]").forEach((button) => {
      const key = button.dataset.move === "left" ? "ArrowLeft" : "ArrowRight";
      button.addEventListener("pointerdown", () => keys.add(key), { signal: controller.signal });
      button.addEventListener("pointerup", () => keys.delete(key), { signal: controller.signal });
      button.addEventListener("pointercancel", () => keys.delete(key), { signal: controller.signal });
      button.addEventListener("pointerleave", () => keys.delete(key), { signal: controller.signal });
    });
    const fireButton = container.querySelector("[data-fire]");
    fireButton.addEventListener("pointerdown", () => keys.add("Space"), { signal: controller.signal });
    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => fireButton.addEventListener(eventName, () => keys.delete("Space"), { signal: controller.signal }));
    canvas.addEventListener("pointermove", (event) => { if (event.pointerType !== "mouse" && state.status === "playing") { const rect = canvas.getBoundingClientRect(); state.player.x = clamp((event.clientX - rect.left) / rect.width * width - state.player.width / 2, 15, width - state.player.width - 15); } }, { signal: controller.signal });
    reset();
    return { destroy() { cancelAnimationFrame(frame); controller.abort(); } };
  }
};
