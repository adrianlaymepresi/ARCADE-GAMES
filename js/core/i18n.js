import { storage } from "./storage.js";

const dictionaries = {
  en: {
    "nav.games": "Games", "nav.developer": "Developer", "nav.github": "GitHub", "nav.menu": "Open navigation menu", "nav.language": "Choose language",
    "hero.eyebrow": "PRESI-GAMES · Frontend developer", "hero.title": "Ignacio Adrian<br><i>Layme Delgado.</i>", "hero.description": "Frontend developer building responsive interfaces and browser games with a focus on clear systems, strong interaction and thoughtful visual detail.", "hero.explore": "Explore games", "hero.portfolio": "View portfolio",
    "library.eyebrow": "Game library", "library.title": "Choose your <i>challenge.</i>", "library.description": "Each title opens in its own focused, responsive game space and remembers your personal records.",
    "developer.eyebrow": "The developer", "developer.title": "Built with focus<br>and <i>curiosity.</i>", "developer.description": "I'm <strong>Ignacio Adrian Layme Delgado</strong>, a frontend developer who turns ideas into thoughtful, responsive digital experiences. This arcade is a hands-on study in game loops, UI systems and browser-native engineering.", "developer.github": "GitHub profile", "developer.portfolio": "Portfolio", "developer.available": "AVAILABLE FOR WORK",
    "footer.rights": "All rights reserved · Ignacio Adrian Layme Delgado", "footer.top": "Back to top",
    "card.best": "Best score", "card.mode": "Mode", "card.play": "Play now", "sound.on": "Sound on", "sound.off": "Sound off", "sound.enabled": "Sound enabled", "sound.disabled": "Sound disabled",
    "games.snake.category": "Canvas · Reflex", "games.snake.description": "Route a growing signal through a responsive circuit grid.", "games.snake.help": "<strong>Objective:</strong> collect data cores and keep the circuit alive. <strong>Keyboard:</strong> Arrow keys or WASD to move; Space pauses. <strong>Touch:</strong> use the directional controls below the board.",
    "games.shooter.category": "Canvas · Action", "games.shooter.description": "Navigate an endless hostile sector with a hand-built flight system.", "games.shooter.help": "<strong>Objective:</strong> survive an endless enemy fleet and raise your score. <strong>Keyboard:</strong> Arrow keys or WASD to steer, Space to fire, P to pause. <strong>Touch:</strong> hold the controls below the screen.",
    "games.chess.category": "Rules · Strategy", "games.chess.description": "A complete local chess board with legal moves and special rules.", "games.chess.detail": "Local 2P", "games.chess.help": "<strong>Objective:</strong> checkmate your opponent's king. The board enforces turns, check, castling, en passant and promotion. Select a piece, then select one of its highlighted legal destinations.",
    "games.tictactoe.category": "AI · Minimax", "games.tictactoe.description": "Play locally or face a difficulty-tuned computer opponent.", "games.tictactoe.detail": "3 modes", "games.tictactoe.help": "<strong>Objective:</strong> make three in a row. Select VS Player for local turns, or VS Computer and choose Easy, Medium or Hard. Hard uses a complete Minimax search and cannot be beaten.",
    "games.tetris.category": "Canvas · Puzzle", "games.tetris.description": "Stack seven classic modules, clear lines and beat the matrix.", "games.tetris.help": "<strong>Objective:</strong> make complete horizontal lines. <strong>Keyboard:</strong> Left/Right to move, Down to soft drop, Up or X to rotate, Space to hard drop and P to pause. Touch buttons appear below on mobile.",
    "games.minesweeper.category": "Logic · Discovery", "games.minesweeper.description": "Scan a coded minefield using flags, logic and careful moves.", "games.minesweeper.detail": "3 levels", "games.minesweeper.help": "<strong>Objective:</strong> reveal every safe sector. Select a difficulty, open cells and flag the mines. <strong>Desktop:</strong> right click a cell to flag it. <strong>Touch:</strong> choose Flag mode, then tap a cell.",
    "games.racer.category": "Canvas · Racing", "games.racer.description": "Complete your selected laps in a 2D circuit while overtaking rival cars.", "games.racer.detail": "Custom laps", "games.racer.help": "<strong>Objective:</strong> complete your selected laps without touching a rival car. <strong>Keyboard:</strong> Left/Right or A/D steer; P pauses. <strong>Touch:</strong> use the steering buttons. Speed rises as your run progresses.",
    "game.score": "Score", "game.best": "Best", "game.speed": "Speed", "game.pause": "Pause", "game.resume": "Resume", "game.restart": "Restart", "game.start": "Start run", "game.ready": "Ready", "game.playAgain": "Play again", "game.level": "Level", "game.lines": "Lines", "game.wave": "Wave", "game.hull": "Hull", "game.laps": "Laps", "game.time": "Time", "game.newGame": "New game", "game.flag": "Flag", "game.reveal": "Reveal", "game.difficulty": "Difficulty", "game.easy": "Easy", "game.medium": "Medium", "game.hard": "Hard", "title.snake": "Snake Circuit", "title.shooter": "Void Runner", "title.chess": "Local Chess", "title.tictactoe": "Tic-Tac-Toe", "title.tetris": "Tetris Matrix", "title.minesweeper": "Minesweeper", "title.racer": "Circuit Rush"
  },
  es: {
    "nav.games": "Juegos", "nav.developer": "Desarrollador", "nav.github": "GitHub", "nav.menu": "Abrir menú de navegación", "nav.language": "Elegir idioma",
    "hero.eyebrow": "PRESI-GAMES · Desarrollador frontend", "hero.title": "Ignacio Adrian<br><i>Layme Delgado.</i>", "hero.description": "Desarrollador frontend que crea interfaces responsive y juegos para navegador, con sistemas claros, interacción sólida y detalle visual cuidado.", "hero.explore": "Explorar juegos", "hero.portfolio": "Ver portafolio",
    "library.eyebrow": "Biblioteca de juegos", "library.title": "Elige tu <i>desafío.</i>", "library.description": "Cada título abre su propio espacio de juego responsive y conserva tus mejores resultados.",
    "developer.eyebrow": "El desarrollador", "developer.title": "Creado con enfoque<br>y <i>curiosidad.</i>", "developer.description": "Soy <strong>Ignacio Adrian Layme Delgado</strong>, desarrollador frontend que convierte ideas en experiencias digitales cuidadas y adaptables. Este arcade es un estudio práctico de ciclos de juego, sistemas de interfaz e ingeniería nativa del navegador.", "developer.github": "Perfil de GitHub", "developer.portfolio": "Portafolio", "developer.available": "DISPONIBLE PARA TRABAJAR",
    "footer.rights": "Todos los derechos reservados · Ignacio Adrian Layme Delgado", "footer.top": "Volver arriba",
    "card.best": "Mejor puntaje", "card.mode": "Modo", "card.play": "Jugar ahora", "sound.on": "Sonido activo", "sound.off": "Sonido apagado", "sound.enabled": "Sonido activado", "sound.disabled": "Sonido desactivado",
    "games.snake.category": "Canvas · Reflejos", "games.snake.description": "Guía una señal creciente por una cuadrícula de circuitos adaptable.", "games.snake.help": "<strong>Objetivo:</strong> recoge núcleos de datos y mantén vivo el circuito. <strong>Teclado:</strong> flechas o WASD para moverte; Espacio pausa. <strong>Táctil:</strong> usa los controles debajo del tablero.",
    "games.shooter.category": "Canvas · Acción", "games.shooter.description": "Navega un sector hostil sin fin con un sistema de vuelo creado a mano.", "games.shooter.help": "<strong>Objetivo:</strong> sobrevive a una flota enemiga infinita y aumenta tu puntaje. <strong>Teclado:</strong> flechas o WASD para dirigir, Espacio para disparar, P para pausar. <strong>Táctil:</strong> mantén pulsados los controles bajo la pantalla.",
    "games.chess.category": "Reglas · Estrategia", "games.chess.description": "Un ajedrez local completo con movimientos legales y reglas especiales.", "games.chess.detail": "2 jugadores", "games.chess.help": "<strong>Objetivo:</strong> da jaque mate al rey rival. El tablero controla turnos, jaque, enroque, captura al paso y promoción. Elige una pieza y después uno de sus destinos legales iluminados.",
    "games.tictactoe.category": "IA · Minimax", "games.tictactoe.description": "Juega localmente o enfréntate a una IA con dificultad ajustable.", "games.tictactoe.detail": "3 modos", "games.tictactoe.help": "<strong>Objetivo:</strong> forma tres en línea. Elige VS Jugador para turnos locales, o VS Computadora con Fácil, Medio o Difícil. Difícil usa una búsqueda Minimax completa y no se puede vencer.",
    "games.tetris.category": "Canvas · Puzzle", "games.tetris.description": "Apila siete módulos clásicos, limpia líneas y domina la matriz.", "games.tetris.help": "<strong>Objetivo:</strong> forma líneas horizontales completas. <strong>Teclado:</strong> Izquierda/Derecha para mover, Abajo para bajar, Arriba o X para girar, Espacio para caída rápida y P para pausar. Los controles táctiles aparecen abajo.",
    "games.minesweeper.category": "Lógica · Descubrimiento", "games.minesweeper.description": "Explora un campo de minas codificado con banderas, lógica y movimientos precisos.", "games.minesweeper.detail": "3 niveles", "games.minesweeper.help": "<strong>Objetivo:</strong> revela todos los sectores seguros. Elige dificultad, abre celdas y marca las minas. <strong>Escritorio:</strong> clic derecho para marcar. <strong>Táctil:</strong> selecciona modo Bandera y luego toca una celda.",
    "games.racer.category": "Canvas · Carreras", "games.racer.description": "Completa las vueltas elegidas en un circuito 2D mientras esquivas a los autos rivales.", "games.racer.detail": "Vueltas personalizadas", "games.racer.help": "<strong>Objetivo:</strong> completa las vueltas elegidas sin tocar a un auto rival. <strong>Teclado:</strong> Izquierda/Derecha o A/D para dirigir; P pausa. <strong>Táctil:</strong> usa los botones de dirección. La velocidad crece durante la partida.",
    "game.score": "Puntaje", "game.best": "Récord", "game.speed": "Velocidad", "game.pause": "Pausa", "game.resume": "Continuar", "game.restart": "Reiniciar", "game.start": "Comenzar", "game.ready": "Listo", "game.playAgain": "Jugar de nuevo", "game.level": "Nivel", "game.lines": "Líneas", "game.wave": "Oleada", "game.hull": "Casco", "game.laps": "Vueltas", "game.time": "Tiempo", "game.newGame": "Nuevo juego", "game.flag": "Bandera", "game.reveal": "Revelar", "game.difficulty": "Dificultad", "game.easy": "Fácil", "game.medium": "Medio", "game.hard": "Difícil", "title.snake": "Serpiente Circuito", "title.shooter": "Corredor del Vacío", "title.chess": "Ajedrez local", "title.tictactoe": "Tres en raya", "title.tetris": "Matriz Tetris", "title.minesweeper": "Buscaminas", "title.racer": "Circuito Rush"
  }
};

Object.assign(dictionaries.en, {
  "games.memory.category": "Logic · Memory", "games.memory.description": "Match technology cards after the deck flips and preserve your chosen lives.", "games.memory.detail": "Up to 16 pairs", "games.memory.help": "<strong>Objective:</strong> match every programming language and framework pair. Choose 4 to 16 pairs, lives and an opening mode. Preview mode shows the whole deck before it flips.",
  "games.wordguess.category": "Words · Logic", "games.wordguess.description": "Decode a random Spanish or English word with custom letter count and attempts.", "games.wordguess.detail": "ES / EN", "games.wordguess.help": "<strong>Objective:</strong> discover the secret word before attempts run out. Green means the correct letter in the correct position; orange means the letter belongs somewhere else in the word.",
  "title.memory": "Memory Stack", "title.wordguess": "Word Signal", "game.pairs": "Pairs", "game.lives": "Lives", "game.mode": "Mode", "game.preview": "Preview 4 s", "game.blind": "No preview", "game.startSession": "Start session", "game.attempts": "Attempts", "game.submit": "Submit"
});

Object.assign(dictionaries.es, {
  "games.memory.category": "Lógica · Memoria", "games.memory.description": "Encuentra pares de tecnologías después de que el mazo se voltee y cuida tus vidas elegidas.", "games.memory.detail": "Hasta 16 pares", "games.memory.help": "<strong>Objetivo:</strong> encuentra todos los pares de lenguajes y frameworks. Elige de 4 a 16 pares, vidas y modo de inicio. Vista previa muestra el mazo completo antes de voltearlo.",
  "games.wordguess.category": "Palabras · Lógica", "games.wordguess.description": "Descifra una palabra aleatoria en español o inglés con letras e intentos configurables.", "games.wordguess.detail": "ES / EN", "games.wordguess.help": "<strong>Objetivo:</strong> descubre la palabra secreta antes de agotar los intentos. Verde significa letra y posición correctas; naranja significa que la letra existe en otra posición.",
  "title.memory": "Memoria Tech", "title.wordguess": "Señal de palabra", "game.pairs": "Pares", "game.lives": "Vidas", "game.mode": "Modo", "game.preview": "Vista 4 s", "game.blind": "Sin vista", "game.startSession": "Comenzar", "game.attempts": "Intentos", "game.submit": "Enviar"
});

let currentLanguage = storage.get("language", "es");
if (!dictionaries[currentLanguage]) currentLanguage = "es";

export function t(key) {
  return dictionaries[currentLanguage][key] ?? dictionaries.en[key] ?? key;
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language) {
  if (!dictionaries[language] || language === currentLanguage) return;
  currentLanguage = language;
  storage.set("language", language);
  applyTranslations();
  document.dispatchEvent(new CustomEvent("arcade:language"));
}

export function applyTranslations(root = document) {
  document.documentElement.lang = currentLanguage;
  root.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  root.querySelectorAll("[data-i18n-html]").forEach((element) => { element.innerHTML = t(element.dataset.i18nHtml); });
  root.querySelectorAll("[data-i18n-aria]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAria)); });
  root.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
