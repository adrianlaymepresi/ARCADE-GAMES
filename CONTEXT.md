# PROJECT: ARCADE-GAMES

Build a complete, production-quality portfolio project called:

**PRESI-GAMES**

This must be a fully functional browser-based arcade containing several games developed entirely with:

* HTML5
* CSS3
* Vanilla JavaScript ES6+
* JavaScript ES Modules
* Canvas API where appropriate
* SVG generated through code
* CSS-generated graphics
* Web Audio API where appropriate
* localStorage for local persistence

The final project must be designed specifically to run correctly on **GitHub Pages**.

This is a portfolio project that will be publicly available on GitHub, so treat it as real software that another developer or recruiter could inspect.

Do not build a prototype.

Do not build a visual mockup.

Do not leave unfinished functionality.

Build the complete application.

---

# 1. MAIN GOAL

The objective is to create a polished web arcade that demonstrates professional frontend development using only HTML, CSS, and Vanilla JavaScript.

The project must demonstrate:

* semantic HTML;
* professional CSS architecture;
* responsive design;
* JavaScript ES Modules;
* DOM manipulation;
* Canvas rendering;
* game loops;
* collision systems;
* artificial intelligence;
* algorithms;
* reusable components;
* clean architecture;
* separation of responsibilities;
* local persistence;
* accessibility basics;
* keyboard interaction;
* touch interaction where appropriate;
* professional UI/UX.

The final result should look like an intentional portfolio application rather than a collection of programming exercises.

---

# 2. IMPORTANT DEPLOYMENT REQUIREMENT

The application MUST work correctly when deployed with GitHub Pages.

Assume the final URL could be similar to:

`https://adrianlaymepresi.github.io/ignacio-arcade/`

Therefore:

* use relative paths;
* do not depend on root-relative `/assets/...` paths;
* do not require server-side routing;
* do not require rewrite rules;
* do not require environment variables;
* do not require a backend;
* do not require a database;
* do not require Node.js at runtime;
* do not require npm to run the project;
* do not require a build process;
* do not use frameworks.

I should be able to upload the repository to GitHub, enable GitHub Pages from the `main` branch and have the application work.

The application should also work locally through a simple static development server such as VS Code Live Server or:

```bash
python -m http.server
```

---

# 3. ALLOWED TECHNOLOGIES

Use:

* HTML5;
* CSS3;
* Vanilla JavaScript ES6+;
* JavaScript modules with `import` and `export`;
* Canvas API;
* SVG created through code;
* CSS shapes and animations;
* Web Audio API;
* localStorage.

Do NOT use:

* React;
* Next.js;
* Vue;
* Angular;
* Svelte;
* TypeScript;
* jQuery;
* Bootstrap;
* Tailwind;
* Phaser;
* Three.js;
* external game engines;
* external UI frameworks;
* backend services;
* databases;
* authentication services;
* external APIs unless absolutely unnecessary, which means they should preferably not be used at all.

The entire application should be self-contained.

---

# 4. PROVIDED ASSET

I will provide only one external visual asset:

`adrian.jpeg`

This is the developer profile photograph.

Inspect the file and place it in an appropriate assets folder.

Use it professionally in the developer/about section.

Do not modify the person's appearance.

Everything else in the project should preferably be generated using code.

---

# 5. DO NOT DEPEND ON EXTERNAL GRAPHIC ASSETS

Do not download icons, game sprites, ships, enemies, logos, backgrounds, chess pieces or decorative graphics.

Create them using:

* inline SVG;
* SVG files written directly in the project;
* Canvas paths;
* CSS;
* HTML;
* Unicode symbols only when they provide a professional result.

For example, the following should be created through code:

* arcade logo;
* code symbol;
* navigation icons;
* game card icons;
* Snake visuals;
* spaceship;
* enemy ships;
* projectiles;
* stars;
* explosions;
* Tetris blocks;
* Tic-Tac-Toe symbols;
* UI indicators;
* decorative technology patterns.

The objective is for the repository to clearly demonstrate that the interface and visuals were built by the developer rather than assembled from downloaded assets.

---

# 6. DEVELOPER IDENTITY

Display the following information professionally.

## Full name

**IGNACIO ADRIAN LAYME DELGADO**

## GitHub username

**adrianlaymepresi**

## GitHub profile

`https://github.com/adrianlaymepresi`

## Portfolio

`https://portafolio-web-adrian-layme-presi.vercel.app/`

The website should have a professional developer section containing:

* profile photograph;
* full name;
* short developer description;
* GitHub link;
* portfolio link;
* technology stack;
* project purpose.

Do not make this section excessively large.

It should reinforce the portfolio identity without distracting from the games.

---

# 7. VISUAL IDENTITY

Create a professional dark technological interface.

The visual style should combine:

* dark UI;
* subtle neumorphism;
* futuristic technology;
* clean surfaces;
* restrained glow;
* strong visual hierarchy;
* elegant spacing;
* modern typography;
* premium portfolio appearance.

The application should NOT look childish.

Avoid exaggerated RGB gaming aesthetics.

Avoid excessive neon.

Avoid filling every surface with gradients.

The result should feel modern and technical.

---

# 8. COLOR PALETTE

Use a single coherent palette based on blue, turquoise, light cyan and light blue.

Recommended base tokens:

```css
:root {
    --background-primary: #071126;
    --background-secondary: #0B1638;

    --surface-primary: #10265A;
    --surface-secondary: #0D1D44;

    --blue-primary: #4361EE;
    --cyan-primary: #4CC9F0;
    --cyan-light: #91E5F6;

    --ice-primary: #C4DAFA;
    --white-primary: #F5FBFF;

    --text-primary: #F5FBFF;
    --text-secondary: #9CB6D8;
}
```

You may derive additional shades when required for:

* hover states;
* active states;
* disabled states;
* shadows;
* borders;
* opacity;
* depth.

Keep the palette visually consistent.

Use red, yellow or green only when needed for semantic states such as:

* danger;
* warning;
* success;
* game state indicators.

Do not introduce random accent colors.

---

# 9. CREATE A CODE-BASED BRAND MARK

Since no logo image will be provided, create a simple professional brand mark through code.

It can combine concepts such as:

* code brackets;
* `</>`;
* eagle-inspired geometry if it can be done cleanly;
* circuit patterns;
* abstract technology geometry.

The logo should remain simple enough to work at small sizes.

Prefer creating it as an SVG file inside the project such as:

```text
assets/brand/arcade-logo.svg
```

The logo should be used in:

* navigation;
* hero section if appropriate;
* footer;
* favicon if technically suitable.

Do not create an excessively complex illustration.

---

# 10. LANDING PAGE

Before displaying a game, create a complete professional landing page.

The landing page should contain:

1. Navigation
2. Hero
3. Arcade game library
4. Developer section
5. Footer

---

# 11. NAVIGATION

Create a responsive navigation bar.

Include:

* application logo;
* IGNACIO ARCADE;
* Games;
* Developer;
* GitHub;
* Portfolio if visually appropriate;
* sound toggle.

The navigation should be elegant and compact.

It may use:

* blur;
* translucent surfaces;
* neumorphic depth;
* subtle borders.

It must remain usable on smaller screens.

---

# 12. HERO SECTION

Create a strong hero section introducing the project.

Example conceptual message:

**A browser arcade built from scratch.**

or another professional equivalent.

Clearly communicate:

`HTML · CSS · JAVASCRIPT`

Explain briefly that the arcade contains several games implemented without frameworks.

Include CTAs such as:

* Explore Games
* View Portfolio
* GitHub

Create the hero visual through code.

For example, you may create:

* a fake terminal;
* arcade system boot screen;
* game telemetry interface;
* animated code console;
* abstract SVG;
* technological dashboard.

Do not use stock images.

---

# 13. ARCADE LIBRARY

Create professional cards for all games.

Each card should contain:

* code-generated icon;
* game name;
* game category;
* short description;
* relevant metadata;
* best score when applicable;
* Play button.

Cards should include polished states:

* normal;
* hover;
* focus;
* active.

Games should open in either:

* a large game modal;
* or an internal full-screen game view.

Choose whichever architecture produces the cleanest maintainable implementation.

---

# 14. REQUIRED GAMES

Implement exactly these five games first.

Do not add additional games until these five are complete and polished.

Games:

1. Snake
2. Infinite Vertical Shooter
3. Chess
4. Tic-Tac-Toe
5. Tetris

---

# 15. GAME 1 — SNAKE

Create a polished Snake implementation.

Use Canvas if appropriate.

Required functionality:

* grid;
* snake movement;
* food;
* snake growth;
* scoring;
* best score;
* increasing difficulty;
* collision against walls;
* collision against the snake itself;
* pause;
* restart;
* game over;
* new best score feedback.

Desktop controls:

* Arrow Keys
* WASD
* Space for pause if appropriate

Mobile:

Provide touch controls.

The game speed should gradually increase.

Store the best score through the centralized persistence service.

The visual theme should resemble a technological circuit rather than a traditional bright green Snake clone.

---

# 16. GAME 2 — INFINITE VERTICAL SHOOTER

Create a polished infinite vertical space shooter.

The player controls a spacecraft located primarily in the lower region of the screen.

The game should create the illusion of continually moving forward.

Use Canvas.

## Player

Implement:

* movement;
* shooting;
* collision;
* health or lives;
* temporary invulnerability after being hit;
* visual feedback.

Desktop controls:

* WASD or Arrow Keys;
* Space to shoot;
* P to pause.

Mobile:

Provide touch movement controls and a fire button.

## Enemies

Create multiple enemy variations through Canvas or SVG geometry.

Enemies should differ in aspects such as:

* movement;
* speed;
* health;
* size;
* score value.

Do not rely only on one enemy duplicated forever.

## Progression

The game must become progressively harder.

Implement concepts such as:

* waves;
* faster enemies;
* higher spawn rates;
* stronger enemies;
* different movement patterns.

## Combat

Include:

* player bullets;
* enemy collision;
* hit detection;
* health;
* destruction;
* score;
* combo multiplier if appropriate;
* particles;
* explosions;
* screen feedback.

## Infinite gameplay

There should not be a final level.

The game continues until the player loses all lives.

Store the best score locally.

---

# 17. GAME 3 — CHESS

Create a complete local chess game for two players on the same device.

No chess AI is required.

This should not simply allow arbitrary piece movement.

Implement actual chess movement rules.

Required:

* 8x8 board;
* alternating turns;
* legal movement;
* captures;
* pawn movement;
* knight movement;
* bishop movement;
* rook movement;
* queen movement;
* king movement;
* illegal move prevention;
* prevent moving opponent pieces;
* prevent leaving your own king in check;
* check detection;
* checkmate detection;
* stalemate detection;
* castling;
* en passant;
* pawn promotion;
* captured piece display;
* move history;
* restart game;
* current player indication;
* game status indication.

For pawn promotion, a proper promotion selector is preferred:

* Queen
* Rook
* Bishop
* Knight

Do not automatically promote only to Queen if implementing the selector can be done cleanly.

Separate chess rules from DOM rendering.

A recommended architecture would be:

```text
games/chess/
├── chess.js
├── chess-engine.js
├── chess-rules.js
├── chess-state.js
└── chess-renderer.js
```

However, adapt the number of files if some would become unnecessarily small.

The important requirement is separation of responsibilities.

---

# 18. CHESS VISUALS

Chess pieces should not depend on downloaded image assets.

Use:

* SVG;
* vector shapes;
* Unicode chess symbols if their rendering is consistent and professional.

The chess board must clearly distinguish:

* light squares;
* dark squares;
* selected piece;
* valid move;
* possible capture;
* previous move;
* king in check.

Do not rely only on subtle color differences for important states.

---

# 19. GAME 4 — TIC-TAC-TOE

Create Tic-Tac-Toe with two major modes.

## Mode A

Player vs Player.

Two local players alternate turns.

## Mode B

Player vs Computer.

The player can choose between:

* Easy
* Medium
* Hard

---

# 20. TIC-TAC-TOE EASY AI

Easy AI should make mostly random legal moves.

It should be easy to defeat.

---

# 21. TIC-TAC-TOE MEDIUM AI

Medium AI should be reasonably intelligent.

It should:

* take winning moves;
* block obvious player wins;
* choose strategic positions;
* occasionally make a non-optimal decision.

It should be beatable.

---

# 22. TIC-TAC-TOE HARD AI

Hard difficulty MUST use the **Minimax algorithm** or an equivalent mathematically optimal solution.

The hard AI must never intentionally choose a suboptimal move.

If implemented correctly, the human player should not be able to defeat it.

The human may:

* lose;
* draw.

But should never win against perfect play.

Place the Minimax algorithm in its own module if appropriate.

For example:

```text
games/tic-tac-toe/
├── tic-tac-toe.js
├── tic-tac-toe-ai.js
└── minimax.js
```

---

# 23. TIC-TAC-TOE UX

Include:

* active turn;
* mode selection;
* difficulty selection;
* win detection;
* draw detection;
* winning cells animation;
* restart button;
* new game;
* smooth visual feedback.

Create X and O through CSS or SVG.

---

# 24. GAME 5 — TETRIS

Create a polished Tetris implementation using Canvas.

Required:

* 10x20 board;
* seven standard tetrominoes;
* piece generation;
* automatic falling;
* left movement;
* right movement;
* soft drop;
* hard drop;
* rotation;
* collision;
* piece locking;
* line clearing;
* scoring;
* lines counter;
* levels;
* progressively increasing speed;
* next piece preview;
* pause;
* restart;
* game over;
* local best score.

Desktop controls:

* Arrow Left;
* Arrow Right;
* Arrow Down;
* Arrow Up or X to rotate;
* Space for Hard Drop;
* P for pause.

Implement reasonable wall-kick behavior.

A complete official Tetris SRS implementation is not required unless it fits naturally, but rotations near walls must feel reliable.

---

# 25. GAME ARCHITECTURE

Each game should behave like an independent module.

A game module should expose a predictable interface.

For example:

```js
export const snakeGame = {
    id: "snake",
    title: "Snake Circuit",

    mount(container) {
        // implementation
    }
};
```

However:

**do not include comments in the final code.**

The important idea is that every game should support proper lifecycle management.

Opening a game should initialize it.

Closing a game must destroy it.

The game must not continue executing after it is closed.

---

# 26. CLEANUP IS MANDATORY

When a user exits a game, remove or stop everything associated with it.

This includes:

* `requestAnimationFrame`;
* `setTimeout`;
* `setInterval`;
* keyboard listeners;
* pointer listeners;
* game loops;
* audio loops;
* temporary observers;
* temporary DOM state.

A previously opened game must never continue consuming resources in the background.

Implement lifecycle cleanup correctly.

---

# 27. PROJECT ARCHITECTURE

Organize the project professionally.

A recommended structure is:

```text
ignacio-arcade/
│
├── index.html
├── README.md
├── LICENSE
├── .gitignore
│
├── assets/
│   ├── brand/
│   │   └── arcade-logo.svg
│   │
│   └── images/
│       └── adrian.jpeg
│
├── css/
│   ├── base.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   ├── games.css
│   ├── animations.css
│   └── responsive.css
│
└── js/
    ├── app.js
    │
    ├── core/
    │   ├── audio.js
    │   ├── storage.js
    │   ├── input.js
    │   └── utils.js
    │
    ├── components/
    │   ├── game-modal.js
    │   ├── toast.js
    │   ├── game-card.js
    │   └── ...
    │
    └── games/
        ├── snake/
        │   ├── snake.js
        │   ├── snake-engine.js
        │   └── snake-renderer.js
        │
        ├── shooter/
        │   ├── shooter.js
        │   ├── shooter-engine.js
        │   ├── entities.js
        │   └── shooter-renderer.js
        │
        ├── chess/
        │   ├── chess.js
        │   ├── chess-engine.js
        │   ├── chess-rules.js
        │   └── chess-renderer.js
        │
        ├── tic-tac-toe/
        │   ├── tic-tac-toe.js
        │   └── minimax.js
        │
        └── tetris/
            ├── tetris.js
            ├── tetris-engine.js
            ├── tetrominoes.js
            └── tetris-renderer.js
```

This structure is a recommendation.

You may improve it if there is a good architectural reason.

Do NOT create unnecessary files only to imitate an enterprise architecture.

Every file should have a clear responsibility.

If two tiny modules logically belong together, keep them together.

If a file becomes excessively large and contains multiple responsibilities, split it.

---

# 28. SEPARATION OF RESPONSIBILITIES

Apply Separation of Concerns throughout the application.

For games, distinguish concepts such as:

* state;
* rules;
* rendering;
* input;
* AI;
* entities;
* persistence.

Do not mix everything into one enormous file.

For example, the Tic-Tac-Toe Minimax algorithm should not be deeply embedded inside DOM manipulation code.

Chess movement validation should not depend directly on HTML elements.

Canvas rendering should not contain unrelated storage logic.

---

# 29. SHARED CORE MODULES

Create reusable shared modules where useful.

Examples:

## Storage service

Responsibilities:

* read values;
* save values;
* best scores;
* preferences.

Do not call `localStorage` randomly throughout every game.

Centralize it.

## Audio service

Responsibilities:

* sound enabled/disabled;
* synthesize tones;
* game effects;
* gracefully handle blocked AudioContext.

## Input helpers

Only if this meaningfully reduces duplication.

## Utilities

Only place genuinely reusable helpers here.

Do not turn `utils.js` into a dumping ground.

---

# 30. CODE QUALITY

This is extremely important.

The project should be understandable by reading the code.

Use:

* descriptive names;
* cohesive functions;
* small functions;
* clear constants;
* predictable data structures;
* clean state management.

Do not intentionally optimize for the smallest number of lines.

Optimize for:

* readability;
* maintainability;
* correctness.

---

# 31. NO COMMENTS IN SOURCE CODE

Do not write explanatory comments inside:

* JavaScript;
* CSS;
* HTML.

Do not write comments such as:

```js
// Update player position
```

or:

```js
// Check collision
```

or:

```css
/* Hero Section */
```

The code itself should be self-explanatory.

Use meaningful names instead.

Good:

```js
updatePlayerPosition()
spawnEnemyWave()
calculateLegalMoves()
findWinningMove()
clearCompletedLines()
```

Bad:

```js
doThing()
process()
temp()
func1()
x2()
```

Short mathematical variables such as `x`, `y`, `dx`, `dy`, `row`, and `column` are acceptable where their meaning is obvious.

---

# 32. USE ENGLISH INSIDE THE CODEBASE

All technical names must be in English.

This applies to:

* file names;
* folder names;
* variables;
* functions;
* constants;
* classes;
* IDs;
* dataset names;
* event names.

For example:

```js
currentScore
enemySpeed
activePiece
selectedSquare
calculateBestMove()
createEnemy()
updateBoard()
```

The visible website text may use either Spanish or English.

For this project, prefer a polished English arcade interface unless Spanish improves the intended presentation.

Do not mix languages randomly.

---

# 33. JAVASCRIPT RULES

Use modern JavaScript.

Prefer:

```js
const
let
import
export
async
```

where appropriate.

Never use:

```js
var
```

Avoid global variables.

Do not attach application state to `window`.

Use:

```html
<script type="module" src="./js/app.js"></script>
```

Prefer composition over unnecessary class hierarchies.

Use JavaScript classes only where they genuinely improve game entity architecture.

For example, a reusable `Enemy` class may make sense.

Creating classes for every tiny utility does not.

---

# 34. CSS ARCHITECTURE

Centralize design tokens.

Use CSS custom properties.

Example:

```css
:root {
    --color-background-primary: #071126;
    --color-surface-primary: #10265A;
    --color-accent-primary: #4CC9F0;

    --radius-small: 0.5rem;
    --radius-medium: 1rem;
    --radius-large: 1.5rem;

    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
}
```

Use:

* Flexbox;
* Grid;
* `clamp()`;
* responsive units;
* CSS variables;
* transitions;
* keyframes;
* pseudo-elements.

Avoid:

* enormous duplicated styles;
* unnecessary inline styles;
* `!important`;
* random hard-coded colors everywhere.

---

# 35. NEUMORPHISM

Use neumorphism selectively.

Good candidates:

* game cards;
* control buttons;
* statistics panels;
* modal containers;
* developer card;
* control surfaces.

Use combinations of:

* subtle raised shadows;
* inset shadows;
* borders;
* darker surfaces;
* cyan highlights.

The page should still have strong readability and contrast.

Do not sacrifice accessibility for neumorphism.

---

# 36. RESPONSIVE DESIGN

Support:

* large desktop;
* standard desktop;
* laptop;
* tablet;
* smartphone.

Use responsive layouts instead of fixed widths.

Canvas games should scale visually without breaking their internal coordinate systems.

Use CSS sizing while retaining appropriate logical Canvas dimensions.

On mobile:

* game controls must remain usable;
* game cards should stack;
* navigation should adapt;
* modals should use most of the viewport;
* buttons need suitable touch targets.

---

# 37. TOUCH CONTROLS

Snake and Shooter should provide touch controls.

Tetris may also have touch controls if they can be added elegantly.

Do not show enormous mobile controls on desktop.

Use responsive CSS or input detection.

Touch buttons should support pointer events reliably.

Avoid implementing controls only with `click` if holding a direction is required.

---

# 38. ACCESSIBILITY

Apply reasonable accessibility practices.

Use:

* semantic HTML;
* actual `<button>` elements;
* useful `aria-label`;
* image `alt`;
* keyboard focus states;
* visible focus;
* sufficient contrast;
* accessible modal behavior;
* Escape to close game views;
* reduced motion support.

Implement:

```css
@media (prefers-reduced-motion: reduce)
```

where appropriate.

Do not make essential information dependent exclusively on color.

---

# 39. GAME MODAL OR GAME VIEW

Create a reusable component responsible for displaying games.

It should contain:

* game name;
* game category;
* game viewport;
* score information when applicable;
* controls/help button;
* pause when applicable;
* restart when applicable;
* exit button.

The component should not contain game-specific logic.

Each game module should inject or mount its own interface inside the shared game container.

---

# 40. GAME HELP

Provide a simple reusable help system.

When the user selects Help or Controls, display:

* keyboard controls;
* mobile controls;
* game objective.

Do not permanently occupy too much screen space with instructions.

---

# 41. AUDIO SYSTEM

Implement a lightweight reusable audio system using Web Audio API.

Generate simple sounds through code.

Examples:

* menu interaction;
* score;
* shot;
* enemy hit;
* explosion;
* game over;
* line cleared;
* game victory.

The audio should be subtle.

Provide a global sound toggle.

The entire application must still work if audio is unavailable.

Never allow an AudioContext problem to crash a game.

---

# 42. LOCAL STORAGE

Store values such as:

```text
snakeBestScore
shooterBestScore
tetrisBestScore
soundEnabled
```

Prefer namespaced storage keys, for example:

```text
ignacioArcade:snakeBestScore
```

Create a storage abstraction.

---

# 43. ANIMATIONS

Use animations to improve feedback.

Examples:

* card hover;
* selected buttons;
* winning Tic-Tac-Toe line;
* particle effects;
* score increase;
* game-over entrance;
* subtle hero animation;
* spaceship engine;
* star field;
* Tetris line clear;
* Snake food pickup.

Avoid excessive motion.

---

# 44. PERFORMANCE

Animated games must prioritize performance.

Use:

```js
requestAnimationFrame()
```

for animation.

Use delta time where appropriate.

Avoid updating DOM elements every frame unless necessary.

For Shooter:

Use Canvas for the main gameplay.

For Tetris:

Use Canvas.

For Snake:

Canvas is recommended.

For Chess:

DOM is appropriate.

For Tic-Tac-Toe:

DOM is appropriate.

---

# 45. CANVAS QUALITY

Take device pixel ratio into account when necessary so Canvas rendering does not look blurry on high-density screens.

If you implement DPI scaling, keep logical game coordinates separated from physical Canvas pixels.

Do not unnecessarily make the game engine depend on CSS dimensions.

---

# 46. USER EXPERIENCE

Every game should have clear states.

Examples:

```text
READY
PLAYING
PAUSED
GAME OVER
VICTORY
DRAW
```

Do not implement them as scattered booleans if a state model would be clearer.

The user should always understand what is happening.

---

# 47. ERROR PREVENTION

Do not allow:

* starting the same loop multiple times;
* duplicate event listeners;
* multiple active animation frames;
* gameplay continuing behind another game;
* duplicate keyboard handlers;
* score updating after game over;
* game actions while paused;
* invisible game processes.

Be particularly careful when mounting and destroying games repeatedly.

---

# 48. README

Create a polished `README.md`.

It should contain:

# IGNACIO ARCADE

Then include:

* project description;
* purpose;
* game list;
* key features;
* technologies;
* architecture;
* project structure;
* screenshots section placeholders where I can later add real screenshots;
* game controls;
* localStorage explanation;
* Canvas explanation;
* Minimax explanation;
* chess implementation overview;
* responsive design;
* accessibility;
* local development;
* GitHub Pages deployment instructions;
* author;
* GitHub;
* portfolio;
* license.

Do not claim functionality that does not actually exist.

---

# 49. README GITHUB PAGES INSTRUCTIONS

Explain clearly:

1. Push the project to GitHub.
2. Open repository Settings.
3. Open Pages.
4. Select `Deploy from a branch`.
5. Select:

   * Branch: `main`
   * Folder: `/ (root)`
6. Save.
7. Wait for deployment.
8. Open the generated GitHub Pages URL.

Mention that the project intentionally uses relative URLs for compatibility with repository subpaths.

---

# 50. AUTHOR SECTION

README author:

**IGNACIO ADRIAN LAYME DELGADO**

GitHub:

`https://github.com/adrianlaymepresi`

Portfolio:

`https://portafolio-web-adrian-layme-presi.vercel.app/`

---

# 51. LICENSE

Create:

`LICENSE`

Use the MIT License.

Copyright:

**Ignacio Adrian Layme Delgado**

Use the current project year.

---

# 52. .GITIGNORE

Create an appropriate `.gitignore`.

Since this is a static Vanilla project, keep it simple.

Ignore things such as:

* `.DS_Store`;
* `Thumbs.db`;
* editor metadata;
* temporary files;
* log files.

Do not add irrelevant Node.js exclusions if the project does not use Node.

---

# 53. META INFORMATION

Create proper metadata inside `index.html`.

Include:

* charset;
* viewport;
* description;
* theme color;
* page title;
* favicon.

Use an appropriate title such as:

**Ignacio Arcade | Vanilla JavaScript Games**

Create the favicon through the code-generated SVG brand.

---

# 54. NO PLACEHOLDERS

Do not leave:

```text
TODO
Coming Soon
Lorem Ipsum
Implement later
Placeholder
```

Do not create non-functional buttons.

Do not fake systems that are supposed to work.

Every visible interaction should either work or should not exist.

---

# 55. NO DEAD CODE

Before finishing:

* remove unused functions;
* remove unused variables;
* remove unused imports;
* remove abandoned CSS;
* remove temporary development code;
* remove `console.log`;
* remove debugging UI;
* remove commented-out code.

The repository should be clean.

---

# 56. VALIDATION — SNAKE

Manually verify:

* game starts;
* Snake moves;
* Arrow Keys work;
* WASD works;
* opposite direction cannot instantly kill through invalid reversal;
* food appears correctly;
* Snake grows;
* score increases;
* speed progression works;
* wall collision works;
* self collision works;
* pause works;
* restart works;
* game over works;
* best score persists;
* touch controls work.

---

# 57. VALIDATION — SHOOTER

Verify:

* player moves;
* shooting works;
* holding fire behaves correctly;
* enemies spawn;
* multiple enemy variations exist;
* enemy movement works;
* bullets collide;
* player collisions work;
* player loses health;
* invulnerability prevents rapid repeated damage;
* enemies become harder;
* waves progress;
* score works;
* combo works if implemented;
* particles disappear properly;
* game over works;
* restart works;
* pause works;
* best score persists;
* touch controls work;
* no entity arrays grow indefinitely because dead objects were never removed.

---

# 58. VALIDATION — CHESS

Test:

* pawn movement;
* pawn double move;
* pawn captures;
* knight movement;
* bishop movement;
* rook movement;
* queen movement;
* king movement;
* turn enforcement;
* illegal move prevention;
* check;
* escaping check;
* preventing self-check;
* checkmate;
* stalemate;
* kingside castling;
* queenside castling;
* preventing castling through check;
* en passant;
* pawn promotion;
* captures;
* move history;
* game restart.

Do not consider Chess complete until its main rule system has been tested.

---

# 59. VALIDATION — TIC-TAC-TOE

Verify:

* Player vs Player;
* Player vs AI;
* Easy;
* Medium;
* Hard;
* win detection;
* draw;
* reset;
* mode switching;
* difficulty switching;
* winning animation.

For Hard difficulty:

Test multiple strategies against the AI.

Verify mathematically or through exhaustive board-state testing that Minimax does not select losing moves.

The Hard AI should be unbeatable.

---

# 60. VALIDATION — TETRIS

Verify:

* all seven tetrominoes appear;
* pieces fall;
* left movement;
* right movement;
* soft drop;
* hard drop;
* rotation;
* collisions;
* wall rotation;
* locking;
* line clearing;
* multiple line clearing;
* score;
* level;
* speed increase;
* next piece;
* pause;
* game over;
* restart;
* best score persistence.

---

# 61. VALIDATION — APPLICATION

Before declaring the project complete:

Check:

* every import;
* every relative path;
* every file name;
* GitHub Pages compatibility;
* mobile layout;
* tablet layout;
* desktop layout;
* modal behavior;
* Escape closing;
* sound toggle;
* developer photo;
* GitHub links;
* portfolio link;
* footer;
* favicon;
* keyboard navigation;
* focus states;
* console errors.

There should be no JavaScript error caused by our code.

---

# 62. TEST GITHUB PAGES SUBPATH BEHAVIOR

Do not only test the project as:

```text
http://localhost/
```

The project must conceptually support a path such as:

```text
http://localhost/ignacio-arcade/
```

Avoid code that assumes the project exists at domain root.

Prefer:

```text
./assets/...
./css/...
./js/...
```

where appropriate.

This requirement is extremely important.

---

# 63. DEVELOPMENT APPROACH

Do not respond only with instructions.

Work directly on the project files.

Your workflow should be approximately:

1. Inspect the provided `adrian.jpeg`.
2. Inspect any existing repository files.
3. Determine the clean architecture.
4. Create the folder structure.
5. Build the global design system.
6. Build the landing page.
7. Build shared services.
8. Implement each game independently.
9. Connect games to the shared arcade interface.
10. Implement responsive design.
11. Add accessibility.
12. Add README.
13. Add license.
14. Test the application.
15. Fix errors.
16. Refactor obvious duplication.
17. Remove debugging artifacts.
18. Verify GitHub Pages compatibility.

Do not stop after creating the initial structure.

Continue until the complete application is functional.

---

# 64. DECISION-MAKING

Do not interrupt implementation for minor design questions.

When multiple reasonable technical solutions exist:

* choose the cleanest;
* choose the simplest maintainable solution;
* continue implementing.

Ask for clarification only if a missing requirement makes completion genuinely impossible.

Otherwise, make a professional decision yourself.

---

# 65. PRIORITIES

When tradeoffs exist, use this priority order:

1. Correct functionality
2. Clean architecture
3. Maintainability
4. User experience
5. Responsive behavior
6. Performance
7. Visual polish
8. Extra effects

Never sacrifice correct game logic merely to create prettier animation.

---

# 66. EXPECTED FINAL RESULT

The final repository should be something I can publicly show and say:

> I built this arcade entirely with HTML, CSS and Vanilla JavaScript.

A visitor should be able to:

* open the live GitHub Pages website;
* immediately understand the project;
* browse the games;
* play every game;
* see polished interactions;
* see that the application is responsive;
* inspect clean source code;
* understand the project architecture;
* see my developer identity;
* access my GitHub;
* access my professional portfolio.

A recruiter or developer reviewing the repository should see evidence of:

* JavaScript fundamentals;
* algorithms;
* game state management;
* Canvas;
* DOM;
* modular architecture;
* responsive CSS;
* UI/UX;
* clean code;
* problem solving.

Build the project to that standard.

---

# 67. FINAL RULE

Do not optimize for simply making the requirements appear completed.

Actually implement them.

Do not create fake complexity.

Do not overengineer.

Do not leave unfinished systems.

Keep the project:

**clean, modular, functional, visually polished, self-contained and ready for GitHub Pages.**
