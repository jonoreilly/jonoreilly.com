export type Cell<T> = {
  row: number;
  column: number;
  value: T;
};

export type Board<T> = Cell<T>[][];

export function createBoard<T>(
  size: number,
  valueGetter: (row: number, column: number) => T
) {
  const board: Board<T> = [];

  for (let row = 0; row < size; row++) {
    board[row] = [];

    for (let column = 0; column < size; column++) {
      board[row][column] = {
        row,
        column,
        value: valueGetter(row, column),
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

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (assertion(board[row][column])) {
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

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (!areSameValue(board1[row][column].value, board2[row][column].value)) {
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

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      callback(board[row][column]);
    }
  }
}

export function mergeBoards<T>(
  board1: Board<T>,
  board2: Board<T>,
  merger: (a: T, b: T) => T
) {
  const size = board1.length;

  const board = createBoard(size, () => undefined as unknown as T);

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      board[row][column].value = merger(
        board1[row][column].value,
        board2[row][column].value
      );
    }
  }

  return board;
}
