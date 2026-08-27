import { storage } from "../core/storage.js";
import { t } from "../core/i18n.js";

const icons = {
  snake: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 8h9a6 6 0 1 1 0 12h-5a4 4 0 1 0 4 4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="25" cy="9" r="2" fill="currentColor"/><path d="M20 24h7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  shooter: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 22 23l-6 6-6-6z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m10 15-5 5m12-5 5 5M16 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  chess: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 7h8M16 4v7m-5 3h10l-2 7 4 5H9l4-5zM7 28h18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  tictactoe: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M11 5v22M21 5v22M5 11h22M5 21h22" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m18 18 5 5m0-5-5 5" stroke="currentColor" stroke-width="2"/></svg>',
  tetris: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 5h7v7H5zm7 7h7v7h-7zm7-7h7v7h-7zM12 19h7v7h-7z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  minesweeper: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 8h20v18H6zM6 14h20M12 8v18m7-18v18" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 2 4 4 1-4 1-2 4-2-4-4-1 4-1z" fill="currentColor"/></svg>',
  racer: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 26 7 17l4-8h10l4 8-3 9z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M13 9h6l2 8H11zM8 20h4m8 0h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  memory: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="7" width="11" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="16" y="10" width="11" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12h3m-3 5h3m8-2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  wordguess: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 6h20v20H6zM11 11h4m2 0h4m-10 5h4m2 0h4m-10 5h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

export function renderGameCards(games, container) {
  container.innerHTML = games.map((game) => {
    const best = game.scoreKey ? storage.getBestScore(game.scoreKey) : null;
    const record = best === null ? game.detail : best.toLocaleString();
    const label = t(best === null ? "card.mode" : "card.best");
    return `<article class="game-card" style="--game-tint:${game.tint}"><div class="card-top"><div class="game-icon">${icons[game.id]}</div><span class="game-category">${game.category}</span></div><h3>${game.title}</h3><p>${game.description}</p><div class="card-footer"><span class="card-record">${label}<b data-record="${game.id}">${record}</b></span><button class="play-button" type="button" data-play-game="${game.id}">${t("card.play")} <span aria-hidden="true">→</span></button></div></article>`;
  }).join("");
}
