const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

export function getWinner(board) {
  for (const line of lines) {
    const [first, second, third] = line;
    if (board[first] && board[first] === board[second] && board[first] === board[third]) return { player: board[first], line };
  }
  return null;
}

export function openCells(board) {
  return board.reduce((cells, value, index) => { if (!value) cells.push(index); return cells; }, []);
}

function minimax(board, depth, maximizing) {
  const winner = getWinner(board);
  if (winner?.player === "O") return 10 - depth;
  if (winner?.player === "X") return depth - 10;
  const cells = openCells(board);
  if (!cells.length) return 0;
  const scores = cells.map((cell) => {
    board[cell] = maximizing ? "O" : "X";
    const score = minimax(board, depth + 1, !maximizing);
    board[cell] = null;
    return score;
  });
  return maximizing ? Math.max(...scores) : Math.min(...scores);
}

export function getPerfectMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;
  openCells(board).forEach((cell) => {
    board[cell] = "O";
    const score = minimax(board, 0, false);
    board[cell] = null;
    if (score > bestScore) { bestScore = score; bestMove = cell; }
  });
  return bestMove;
}

function finishingMove(board, player) {
  return openCells(board).find((cell) => { board[cell] = player; const found = getWinner(board)?.player === player; board[cell] = null; return found; });
}

export function getComputerMove(board, difficulty) {
  const cells = openCells(board);
  if (difficulty === "easy") return cells[Math.floor(Math.random() * cells.length)];
  if (difficulty === "medium") {
    const winning = finishingMove(board, "O");
    const block = finishingMove(board, "X");
    if (winning !== undefined) return winning;
    if (block !== undefined) return block;
    if (Math.random() < .28) return cells[Math.floor(Math.random() * cells.length)];
    if (cells.includes(4)) return 4;
    const corners = cells.filter((cell) => [0, 2, 6, 8].includes(cell));
    return (corners.length ? corners : cells)[Math.floor(Math.random() * (corners.length ? corners.length : cells.length))];
  }
  return getPerfectMove(board);
}
