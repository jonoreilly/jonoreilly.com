export type Cell<T> = {
  x: number;
  y: number;
  value: T;
};

export type Board<T> = Cell<T>[][];

export function createBoard<T>(
  size: number,
  valueGetter: (x: number, y: number) => T
) {
  const board: Board<T> = [];

  for (let x = 0; x < size; x++) {
    board[x] = [];

    for (let y = 0; y < size; y++) {
      board[x][y] = {
        x,
        y,
        value: valueGetter(x, y),
      };
    }
  }

  return board;
}

export function isAnyInBoard<T>(
  board: Board<T>,
  assertion: (cell: Cell<T>) => boolean
) {
  const size = board.length;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (assertion(board[x][y])) {
        return true;
      }
    }
  }

  return false;
}

export function areSameBoards<T>(
  board1: Board<T>,
  board2: Board<T>,
  areSameValue: (a: T, b: T) => boolean
) {
  const size = board1.length;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (!areSameValue(board1[x][y].value, board2[x][y].value)) {
        return false;
      }
    }
  }

  return true;
}

export function forEachCell<T>(
  board: Board<T>,
  callback: (cell: Cell<T>) => void
) {
  const size = board.length;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      callback(board[x][y]);
    }
  }
}

export function mergeBoards<T>(
  board1: Board<T>,
  board2: Board<T>,
  merger: (a: T, b: T) => T
) {
  const size = board1.length;

  const board = createBoard(size, () => undefined) as Board<T>;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      board[x][y].value = merger(board1[x][y].value, board2[x][y].value);
    }
  }

  return board;
}
