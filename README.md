# PRESI-GAMES

A responsive browser-native arcade portfolio by **IGNACIO ADRIAN LAYME DELGADO**. It uses HTML, CSS and modern vanilla JavaScript only: no framework, build step, backend or dependency is required.

## Purpose

This project demonstrates frontend engineering through interactive software: Canvas rendering, game loops, keyboard and touch input, DOM UI, local persistence, browser audio, chess rules and optimal game-playing algorithms.

## Games

- **Snake Circuit** — progressively faster Canvas snake game with touch controls and persistent record.
- **Void Runner** — infinite vertical shooter with enemy variants, particles, invulnerability, waves and persistent record.
- **Local Chess** — two-player chess with legal moves, check, checkmate, stalemate, castling, en passant, promotion, captures and history.
- **Tic-Tac-Toe** — local play plus Easy, Medium and unbeatable Hard computer modes.
- **Tetris Matrix** — seven tetrominoes, line clears, levels, wall kicks, next-piece preview, mobile buttons and persistent record.
- **Minesweeper** — three scalable minefield sizes with safe opening cells, reveal flood-fill and touch-friendly flag mode.
- **Circuit Rush** — a 2D Canvas endurance racer with selectable laps, escalating speed, rival cars and touch steering.
- **Memory Stack** — configurable technology-pair memory game with 4–16 pairs, lives and optional preview mode.
- **Word Signal** — Spanish/English word discovery game with custom word length, attempts and positional color feedback.

## Features

- Responsive desktop, tablet and phone layouts.
- Semantic controls, focus states, labels, Escape exit and reduced-motion support.
- Independent ES modules with mount/destroy lifecycles, preventing listeners and animation loops from surviving after a game closes.
- Web Audio API effects with a global sound preference.
- Namespaced `localStorage` values under `ignacioArcade:`.
- Relative URLs throughout for GitHub Pages subpaths.

## Architecture

```text
assets/             Brand SVG and developer image
css/                Tokens, base, layout, games and responsive styles
js/core/            Storage, audio and Canvas helpers
js/components/      Modal, card and notification components
js/games/           Independent game modules and rule engines
```

Canvas powers Snake, Void Runner and Tetris. The Hard Tic-Tac-Toe opponent evaluates every remaining board state with Minimax, so it never intentionally selects a losing move. Chess rules are kept outside its DOM renderer and reject moves that leave the current king in check.

## Controls

| Game | Keyboard |
| --- | --- |
| Snake | Arrow keys or WASD, Space pause |
| Void Runner | Arrow keys or WASD, Space fire, P pause |
| Chess | Click/tap a piece, then a legal square |
| Tic-Tac-Toe | Click/tap a board cell |
| Tetris | Arrow keys, Up/X rotate, Space hard drop, P pause |

Snake, Void Runner and Tetris display touch controls on compact screens.

## Screenshots

Add published screenshots here later: landing page, Snake Circuit, Void Runner, Local Chess, Tic-Tac-Toe and Tetris Matrix.

## Local development

Use any static server because the project uses ES modules:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## GitHub Pages deployment

1. Push the project to GitHub.
2. Open repository **Settings**, then **Pages**.
3. Choose **Deploy from a branch**.
4. Select branch **main** and folder **/ (root)**.
5. Save, wait for deployment, then open the generated URL.

The project intentionally uses relative URLs, so it works below repository paths such as `/ignacio-arcade/`.

## Author

**IGNACIO ADRIAN LAYME DELGADO**

- GitHub: https://github.com/adrianlaymepresi
- Portfolio: https://portafolio-web-adrian-layme-presi.vercel.app/

## License

[MIT](./LICENSE)
