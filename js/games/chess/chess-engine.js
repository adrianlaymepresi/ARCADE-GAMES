const backRank = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
const knightSteps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const kingSteps = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

const inside = (row, column) => row >= 0 && row < 8 && column >= 0 && column < 8;
const otherColor = (color) => color === "white" ? "black" : "white";
const clonePiece = (piece) => piece ? { ...piece } : null;
const cloneBoard = (board) => board.map((row) => row.map(clonePiece));
const key = (position) => `${position.row},${position.column}`;
const sameSquare = (first, second) => first.row === second.row && first.column === second.column;

export function createChessState() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  ["black", "white"].forEach((color) => {
    const backRow = color === "white" ? 7 : 0;
    const pawnRow = color === "white" ? 6 : 1;
    backRank.forEach((type, column) => { board[backRow][column] = { type, color }; });
    for (let column = 0; column < 8; column += 1) board[pawnRow][column] = { type: "pawn", color };
  });
  return { board, turn: "white", castling: { white: { king: true, queen: true }, black: { king: true, queen: true } }, enPassant: null, history: [], captured: [], lastMove: null, halfMoves: 0 };
}

function cloneState(state) {
  return { ...state, board: cloneBoard(state.board), castling: { white: { ...state.castling.white }, black: { ...state.castling.black } }, history: [...state.history], captured: [...state.captured], lastMove: state.lastMove ? { from: { ...state.lastMove.from }, to: { ...state.lastMove.to } } : null, enPassant: state.enPassant ? { ...state.enPassant } : null };
}

function addMove(moves, board, from, to, extras = {}) {
  const target = board[to.row][to.column];
  if (!target || (target.color !== board[from.row][from.column].color && target.type !== "king")) moves.push({ from, to, ...extras });
}

function addSlidingMoves(moves, board, from, directions) {
  const piece = board[from.row][from.column];
  directions.forEach(([rowStep, columnStep]) => {
    let row = from.row + rowStep;
    let column = from.column + columnStep;
    while (inside(row, column)) {
      const target = board[row][column];
      if (!target) moves.push({ from, to: { row, column } });
      else {
        if (target.color !== piece.color && target.type !== "king") moves.push({ from, to: { row, column } });
        break;
      }
      row += rowStep;
      column += columnStep;
    }
  });
}

function pseudoMovesForPiece(state, from) {
  const piece = state.board[from.row][from.column];
  if (!piece) return [];
  const moves = [];
  const board = state.board;
  if (piece.type === "pawn") {
    const direction = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;
    const promotionRow = piece.color === "white" ? 0 : 7;
    const nextRow = from.row + direction;
    if (inside(nextRow, from.column) && !board[nextRow][from.column]) {
      moves.push({ from, to: { row: nextRow, column: from.column }, promotionRequired: nextRow === promotionRow });
      const jumpRow = from.row + direction * 2;
      if (from.row === startRow && !board[jumpRow][from.column]) moves.push({ from, to: { row: jumpRow, column: from.column }, doublePawn: true });
    }
    [-1, 1].forEach((columnStep) => {
      const column = from.column + columnStep;
      if (!inside(nextRow, column)) return;
      const target = board[nextRow][column];
      if (target && target.color !== piece.color && target.type !== "king") moves.push({ from, to: { row: nextRow, column }, promotionRequired: nextRow === promotionRow });
      if (state.enPassant && state.enPassant.row === nextRow && state.enPassant.column === column) moves.push({ from, to: { row: nextRow, column }, enPassant: true });
    });
  }
  if (piece.type === "knight") knightSteps.forEach(([rowStep, columnStep]) => { const to = { row: from.row + rowStep, column: from.column + columnStep }; if (inside(to.row, to.column)) addMove(moves, board, from, to); });
  if (piece.type === "bishop") addSlidingMoves(moves, board, from, bishopDirections);
  if (piece.type === "rook") addSlidingMoves(moves, board, from, rookDirections);
  if (piece.type === "queen") addSlidingMoves(moves, board, from, [...rookDirections, ...bishopDirections]);
  if (piece.type === "king") {
    kingSteps.forEach(([rowStep, columnStep]) => { const to = { row: from.row + rowStep, column: from.column + columnStep }; if (inside(to.row, to.column)) addMove(moves, board, from, to); });
    const row = piece.color === "white" ? 7 : 0;
    const opponent = otherColor(piece.color);
    if (from.row === row && from.column === 4 && !isSquareAttacked(state, { row, column: 4 }, opponent)) {
      if (state.castling[piece.color].king && !board[row][5] && !board[row][6] && board[row][7]?.type === "rook" && board[row][7]?.color === piece.color && !isSquareAttacked(state, { row, column: 5 }, opponent) && !isSquareAttacked(state, { row, column: 6 }, opponent)) moves.push({ from, to: { row, column: 6 }, castle: "king" });
      if (state.castling[piece.color].queen && !board[row][1] && !board[row][2] && !board[row][3] && board[row][0]?.type === "rook" && board[row][0]?.color === piece.color && !isSquareAttacked(state, { row, column: 3 }, opponent) && !isSquareAttacked(state, { row, column: 2 }, opponent)) moves.push({ from, to: { row, column: 2 }, castle: "queen" });
    }
  }
  return moves;
}

export function isSquareAttacked(state, square, byColor) {
  const board = state.board;
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) {
    const piece = board[row][column];
    if (!piece || piece.color !== byColor) continue;
    const rowDifference = square.row - row;
    const columnDifference = square.column - column;
    if (piece.type === "pawn" && rowDifference === (byColor === "white" ? -1 : 1) && Math.abs(columnDifference) === 1) return true;
    if (piece.type === "knight" && knightSteps.some(([r, c]) => r === rowDifference && c === columnDifference)) return true;
    if (piece.type === "king" && Math.max(Math.abs(rowDifference), Math.abs(columnDifference)) === 1) return true;
    const directions = piece.type === "rook" ? rookDirections : piece.type === "bishop" ? bishopDirections : piece.type === "queen" ? [...rookDirections, ...bishopDirections] : [];
    if (directions.length) {
      for (const [rowStep, columnStep] of directions) {
        let checkRow = row + rowStep;
        let checkColumn = column + columnStep;
        while (inside(checkRow, checkColumn)) {
          if (checkRow === square.row && checkColumn === square.column) return true;
          if (board[checkRow][checkColumn]) break;
          checkRow += rowStep;
          checkColumn += columnStep;
        }
      }
    }
  }
  return false;
}

export function isInCheck(state, color) {
  let kingSquare = null;
  state.board.forEach((row, rowIndex) => row.forEach((piece, column) => { if (piece?.color === color && piece.type === "king") kingSquare = { row: rowIndex, column }; }));
  return kingSquare ? isSquareAttacked(state, kingSquare, otherColor(color)) : true;
}

function moveLabel(state, move, piece, captured) {
  if (move.castle === "king") return "O-O";
  if (move.castle === "queen") return "O-O-O";
  const files = "abcdefgh";
  const symbols = { pawn: "", knight: "N", bishop: "B", rook: "R", queen: "Q", king: "K" };
  const target = `${files[move.to.column]}${8 - move.to.row}`;
  const prefix = piece.type === "pawn" && captured ? files[move.from.column] : symbols[piece.type];
  return `${prefix}${captured ? "x" : ""}${target}${move.promotion ? `=${symbols[move.promotion]}` : ""}`;
}

export function applyMove(state, move) {
  const next = cloneState(state);
  const piece = next.board[move.from.row][move.from.column];
  let captured = next.board[move.to.row][move.to.column];
  next.board[move.from.row][move.from.column] = null;
  if (move.enPassant) {
    const capturedRow = move.from.row;
    captured = next.board[capturedRow][move.to.column];
    next.board[capturedRow][move.to.column] = null;
  }
  next.board[move.to.row][move.to.column] = { ...piece, type: move.promotion || piece.type };
  if (move.castle) {
    const row = move.from.row;
    const rookFrom = move.castle === "king" ? 7 : 0;
    const rookTo = move.castle === "king" ? 5 : 3;
    next.board[row][rookTo] = next.board[row][rookFrom];
    next.board[row][rookFrom] = null;
  }
  if (piece.type === "king") { next.castling[piece.color].king = false; next.castling[piece.color].queen = false; }
  if (piece.type === "rook") {
    if (move.from.column === 0 && move.from.row === (piece.color === "white" ? 7 : 0)) next.castling[piece.color].queen = false;
    if (move.from.column === 7 && move.from.row === (piece.color === "white" ? 7 : 0)) next.castling[piece.color].king = false;
  }
  if (captured?.type === "rook") {
    const homeRow = captured.color === "white" ? 7 : 0;
    if (move.to.row === homeRow && move.to.column === 0) next.castling[captured.color].queen = false;
    if (move.to.row === homeRow && move.to.column === 7) next.castling[captured.color].king = false;
  }
  next.enPassant = move.doublePawn ? { row: (move.from.row + move.to.row) / 2, column: move.from.column } : null;
  next.lastMove = { from: { ...move.from }, to: { ...move.to } };
  next.halfMoves = piece.type === "pawn" || captured ? 0 : next.halfMoves + 1;
  next.history.push(moveLabel(state, move, piece, captured));
  if (captured) next.captured.push(captured);
  next.turn = otherColor(state.turn);
  return { state: next, captured };
}

export function generateLegalMoves(state, color = state.turn) {
  const legal = [];
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) {
    const piece = state.board[row][column];
    if (piece?.color !== color) continue;
    pseudoMovesForPiece(state, { row, column }).forEach((move) => {
      const next = applyMove(state, move).state;
      if (!isInCheck(next, color)) legal.push(move);
    });
  }
  return legal;
}

export function getGameStatus(state) {
  const moves = generateLegalMoves(state);
  if (moves.length) return isInCheck(state, state.turn) ? "check" : "active";
  return isInCheck(state, state.turn) ? "checkmate" : "stalemate";
}

export function movesForSquare(state, square) {
  return generateLegalMoves(state).filter((move) => sameSquare(move.from, square));
}

export function moveMatches(move, square) {
  return key(move.to) === key(square);
}
