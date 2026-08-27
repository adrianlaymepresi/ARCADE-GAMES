export class GameModal {
  constructor({ onClose }) {
    this.element = document.querySelector("#game-modal");
    this.stage = document.querySelector("#game-stage");
    this.title = document.querySelector("#modal-title");
    this.category = document.querySelector("#modal-category");
    this.help = document.querySelector("#game-help");
    this.closeButton = this.element.querySelector("[data-close-modal]");
    this.activeGame = null;
    this.previousFocus = null;
    this.onClose = onClose;
    this.element.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-modal]")) this.close();
      if (event.target.closest(".modal-help")) this.toggleHelp();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.element.hidden) this.close();
    });
  }

  open(game) {
    this.close(false);
    this.previousFocus = document.activeElement;
    this.title.textContent = game.title;
    this.category.textContent = game.category;
    this.help.innerHTML = game.help;
    this.help.hidden = true;
    this.element.hidden = false;
    this.activeGame = game.mount(this.stage);
    this.closeButton.focus();
  }

  close(restoreFocus = true) {
    if (this.activeGame) this.activeGame.destroy();
    this.activeGame = null;
    this.stage.replaceChildren();
    const wasOpen = !this.element.hidden;
    this.element.hidden = true;
    if (wasOpen) this.onClose?.();
    if (restoreFocus && this.previousFocus instanceof HTMLElement) this.previousFocus.focus();
  }

  toggleHelp() {
    this.help.hidden = !this.help.hidden;
  }
}
