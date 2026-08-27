import { audio } from "../../core/audio.js";
import { clamp, createCanvasContext, rectsOverlap } from "../../core/canvas.js";
import { t } from "../../core/i18n.js";

const width = 960;
const height = 540;
const road = { left: 180, right: 780, lanes: 4 };
const palette = ["#ff6e88", "#ffca6b", "#a98bff", "#69dfb4", "#4361ee"];

export const racerGame = {
  id: "racer",
  title: "Circuit Rush",
  mount(container) {
    container.innerHTML = `<div class="game-shell racer-shell" data-game="racer"><div class="game-toolbar"><div class="game-stats"><span class="stat-chip">${t("game.laps")}<b data-lap>0 / 3</b></span><span class="stat-chip">${t("game.speed")}<b data-speed>160</b></span><span class="stat-chip">${t("game.time")}<b data-time>0:00</b></span></div><div class="lap-form"><label for="lap-count">${t("game.laps")}</label><input id="lap-count" data-lap-input type="number" min="1" max="12" value="3"><button type="button" data-restart>${t("game.newGame")}</button></div></div><div class="canvas-frame racer-canvas"><canvas class="game-canvas" width="960" height="540" aria-label="Circuit Rush 2D racing track"></canvas><div class="canvas-overlay" data-overlay><strong>Circuit Rush</strong><span>Choose your laps, overtake the field and stay clear of every rival.</span><button type="button" data-start>${t("game.start")}</button></div></div><div class="racer-hud"><div class="game-panel"><p>RACE TYPE</p><strong>2D CIRCUIT</strong><p>Every object on track is a competing car.</p></div><div class="game-panel"><p>STEERING</p><strong>&larr; / &rarr;</strong><p>Move smoothly across lanes to avoid the field.</p></div></div><div class="mobile-controls" aria-label="Racing touch controls"><button data-turn="left" aria-label="Steer left">&larr;</button><button data-turn="right" aria-label="Steer right">&rarr;</button></div></div>`;
    const canvas = container.querySelector("canvas");
    const context = createCanvasContext(canvas, width, height);
    const overlay = container.querySelector("[data-overlay]");
    const lapElement = container.querySelector("[data-lap]");
    const speedElement = container.querySelector("[data-speed]");
    const timeElement = container.querySelector("[data-time]");
    const input = container.querySelector("[data-lap-input]");
    const controller = new AbortController();
    const keys = new Set();
    let frame;
    let lastTime;
    let state;

    function laneX(lane, carWidth = 62) {
      const laneWidth = (road.right - road.left) / road.lanes;
      return road.left + lane * laneWidth + (laneWidth - carWidth) / 2;
    }

    function reset() {
      cancelAnimationFrame(frame);
      const targetLaps = clamp(Number(input.value) || 3, 1, 12);
      input.value = targetLaps;
      state = { status: "ready", targetLaps, lap: 0, distance: 0, elapsed: 0, speed: 160, stripeOffset: 0, spawnClock: .6, player: { x: laneX(1), y: height - 126, width: 62, height: 104, color: "#4cc9f0" }, rivals: [], flashes: 0 };
      updateHud();
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Circuit Rush</strong><span>${targetLaps} laps armed. Rival traffic accelerates as the race evolves.</span><button type="button" data-start>${t("game.start")}</button>`;
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

    function pauseRace() {
      if (state.status !== "playing") return;
      state.status = "paused";
      cancelAnimationFrame(frame);
      overlay.hidden = false;
      overlay.innerHTML = `<strong>Paused</strong><span>The field is waiting at the line.</span><button type="button" data-resume>${t("game.resume")}</button>`;
      overlay.querySelector("[data-resume]").addEventListener("click", start, { signal: controller.signal });
    }

    function updateHud() {
      lapElement.textContent = `${state.lap} / ${state.targetLaps}`;
      speedElement.textContent = String(Math.round(state.speed));
      timeElement.textContent = `${Math.floor(state.elapsed / 60)}:${String(Math.floor(state.elapsed % 60)).padStart(2, "0")}`;
    }

    function addRival() {
      const occupiedLanes = new Set(state.rivals.filter((rival) => rival.y < 125).map((rival) => rival.lane));
      const options = Array.from({ length: road.lanes }, (_, lane) => lane).filter((lane) => !occupiedLanes.has(lane));
      if (!options.length) return;
      const lane = options[Math.floor(Math.random() * options.length)];
      const color = palette[Math.floor(Math.random() * palette.length)];
      state.rivals.push({ lane, x: laneX(lane), y: -118, width: 62, height: 104, color, speedFactor: .72 + Math.random() * .38, number: 2 + Math.floor(Math.random() * 86) });
    }

    function end(won) {
      state.status = won ? "won" : "gameover";
      cancelAnimationFrame(frame);
      won ? audio.score() : audio.gameOver();
      overlay.hidden = false;
      overlay.innerHTML = `<strong>${won ? "Race complete" : "Contact detected"}</strong><span>${won ? `${state.targetLaps} laps completed in ${timeElement.textContent}.` : `Avoid the next rival and try again.`}</span><button type="button" data-start>${t("game.playAgain")}</button>`;
      overlay.querySelector("[data-start]").addEventListener("click", () => { reset(); start(); }, { signal: controller.signal });
    }

    function update(delta) {
      state.elapsed += delta;
      state.speed = Math.min(465, 160 + state.elapsed * 7.5 + state.lap * 25);
      state.stripeOffset = (state.stripeOffset + state.speed * delta) % 84;
      state.distance += state.speed * delta;
      const newLap = Math.floor(state.distance / 3000);
      if (newLap > state.lap) {
        state.lap = newLap;
        audio.score();
        if (state.lap >= state.targetLaps) { end(true); return; }
      }
      const direction = (keys.has("ArrowRight") || keys.has("KeyD") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("KeyA") ? 1 : 0);
      state.player.x = clamp(state.player.x + direction * 440 * delta, road.left + 12, road.right - state.player.width - 12);
      state.spawnClock += delta;
      if (state.spawnClock >= Math.max(.34, 1.08 - state.elapsed * .011 - state.lap * .08)) { state.spawnClock = 0; addRival(); }
      state.rivals.forEach((rival) => { rival.y += state.speed * rival.speedFactor * delta; });
      const contact = state.rivals.some((rival) => rectsOverlap(state.player, rival));
      if (contact) { state.flashes = .3; end(false); return; }
      state.rivals = state.rivals.filter((rival) => rival.y < height + 130);
      state.flashes = Math.max(0, state.flashes - delta);
      updateHud();
    }

    function drawRaceCar(car, player = false) {
      const { x, y, width: carWidth, height: carHeight, color } = car;
      context.save();
      context.translate(x + carWidth / 2, y + carHeight / 2);
      context.shadowColor = color;
      context.shadowBlur = player ? 18 : 7;
      context.fillStyle = "#050b1d";
      context.fillRect(-carWidth / 2 - 5, -carHeight * .28, 10, carHeight * .18);
      context.fillRect(carWidth / 2 - 5, -carHeight * .28, 10, carHeight * .18);
      context.fillRect(-carWidth / 2 - 5, carHeight * .1, 10, carHeight * .2);
      context.fillRect(carWidth / 2 - 5, carHeight * .1, 10, carHeight * .2);
      context.fillStyle = color;
      context.beginPath(); context.roundRect(-carWidth * .36, -carHeight * .46, carWidth * .72, carHeight * .92, 15); context.fill();
      context.fillStyle = "#071126";
      context.beginPath(); context.roundRect(-carWidth * .2, -carHeight * .3, carWidth * .4, carHeight * .3, 8); context.fill();
      context.fillStyle = "rgba(245,251,255,.72)"; context.fillRect(-carWidth * .25, -carHeight * .04, carWidth * .5, 5);
      context.fillStyle = player ? "#f5fbff" : "#c4dafa"; context.fillRect(-carWidth * .24, -carHeight * .39, 9, 7); context.fillRect(carWidth * .1, -carHeight * .39, 9, 7);
      context.fillStyle = "#071126"; context.fillRect(-carWidth * .29, carHeight * .35, carWidth * .58, 6);
      if (!player) { context.fillStyle = "#f5fbff"; context.font = "bold 13px system-ui"; context.textAlign = "center"; context.fillText(String(car.number), 0, carHeight * .2); }
      context.restore();
    }

    function draw() {
      context.fillStyle = "#081a32"; context.fillRect(0, 0, width, height);
      context.fillStyle = "#0f3156"; context.fillRect(0, 0, road.left, height); context.fillRect(road.right, 0, width - road.right, height);
      context.fillStyle = "#273850"; context.fillRect(road.left, 0, road.right - road.left, height);
      context.fillStyle = "#d9e7ff";
      for (let y = -84 + state.stripeOffset; y < height; y += 84) {
        for (let lane = 1; lane < road.lanes; lane += 1) context.fillRect(road.left + lane * (road.right - road.left) / road.lanes - 4, y, 8, 44);
      }
      context.fillStyle = "#ff6e88";
      for (let y = -24 + state.stripeOffset; y < height; y += 48) { context.fillRect(road.left - 12, y, 12, 24); context.fillRect(road.right, y + 24, 12, 24); }
      context.fillStyle = "#f5fbff";
      for (let y = -24 + state.stripeOffset; y < height; y += 48) { context.fillRect(road.left - 12, y + 24, 12, 24); context.fillRect(road.right, y, 12, 24); }
      context.strokeStyle = "rgba(76,201,240,.75)"; context.lineWidth = 2; context.strokeRect(road.left, 0, road.right - road.left, height);
      context.fillStyle = "rgba(76,201,240,.12)"; context.fillRect(road.left, 0, road.right - road.left, 4);
      state.rivals.forEach((rival) => drawRaceCar(rival));
      drawRaceCar(state.player, true);
      if (state.flashes > 0) { context.fillStyle = `rgba(255,110,136,${state.flashes * 2})`; context.fillRect(0, 0, width, height); }
    }

    function loop(time) {
      const delta = Math.min(.04, (time - lastTime) / 1000);
      lastTime = time;
      if (state.status === "playing") update(delta);
      draw();
      if (state.status === "playing") frame = requestAnimationFrame(loop);
    }

    document.addEventListener("keydown", (event) => { if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(event.code)) { keys.add(event.code); event.preventDefault(); } if (event.code === "KeyP") { event.preventDefault(); state.status === "paused" ? start() : pauseRace(); } }, { signal: controller.signal });
    document.addEventListener("keyup", (event) => keys.delete(event.code), { signal: controller.signal });
    container.querySelector("[data-restart]").addEventListener("click", reset, { signal: controller.signal });
    input.addEventListener("change", reset, { signal: controller.signal });
    container.querySelectorAll("[data-turn]").forEach((button) => { const key = button.dataset.turn === "left" ? "ArrowLeft" : "ArrowRight"; button.addEventListener("pointerdown", () => keys.add(key), { signal: controller.signal }); ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => button.addEventListener(eventName, () => keys.delete(key), { signal: controller.signal })); });
    reset();
    return { destroy() { cancelAnimationFrame(frame); controller.abort(); } };
  }
};
