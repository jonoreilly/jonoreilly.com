import { Board, createBoard } from "./board";
import {
  QUADRANT_SIZE,
  SIZE,
  Suggestions,
  getCreateInitialSuggestionsCallback,
} from "./main";

function isRegionCorrect(values: (number | undefined)[]) {
  // If a value is repeated, return false
  for (let value = 0; value < SIZE; value++) {
    if (values.filter((el) => el === value).length > 1) {
      return false;
    }
  }

  return true;
}

function isBoardCorrect(board: Board<number | undefined>) {
  const rowsValues = board.map((_, row) =>
    board.map((_, column) => board[row][column].value)
  );

  const columnsValues = board.map((_, column) =>
    board.map((_, row) => board[row][column].value)
  );

  const quadrantsValues = board.map((_, q) => {
    const quadrantStartRow = (q % QUADRANT_SIZE) * QUADRANT_SIZE;
    const quadrantStartColumn = Math.floor(q / QUADRANT_SIZE) * QUADRANT_SIZE;

    return board.map((_, c) => {
      const localRow = c % QUADRANT_SIZE;
      const localColumn = Math.floor(c / QUADRANT_SIZE);

      const row = quadrantStartRow + localRow;
      const column = quadrantStartColumn + localColumn;

      return board[row][column].value;
    });
  });

  const regions = [...rowsValues, ...columnsValues, ...quadrantsValues];

  return regions.every((values) => isRegionCorrect(values));
}

function getValidBoards(
  initialBoard: Board<number | undefined>
):
  | { status: "success"; boards: Board<number | undefined>[] }
  | { status: "failed" } {
  // Skip incorrect boards
  if (!isBoardCorrect(initialBoard)) {
    return { status: "failed" };
  }

  for (let row = 0; row < SIZE; row++) {
    for (let column = 0; column < SIZE; column++) {
      // Skip if cell is populated
      if (initialBoard[row][column].value !== undefined) {
        continue;
      }

      const validBoards: Board<number | undefined>[] = [];

      for (let option = 0; option < SIZE; option++) {
        const testBoard = createBoard(
          SIZE,
          (row, column) => initialBoard[row][column].value
        );

        testBoard[row][column].value = option;

        if (isBoardCorrect(testBoard)) {
          const result = getValidBoards(testBoard);

          if (result.status === "success") {
            validBoards.push(...result.boards);
          }
        }
      }

      if (validBoards.length) {
        return {
          status: "success",
          boards: validBoards,
        };
      }

      // No option worked, mark this path as failed
      return { status: "failed" };
    }
  }

  // All cells are populated correctly, return finalised board
  return { status: "success", boards: [initialBoard] };
}

export function getSuggestions(
  initialBoard: Board<number | undefined>
): Board<Suggestions> {
  const result = getValidBoards(initialBoard);

  console.log("End", result);

  if (result.status === "success") {
    return createBoard(SIZE, (row, column) =>
      initialBoard.map((_, suggestion) =>
        result.boards.some((board) => board[row][column].value === suggestion)
      )
    );
  }

  return createBoard(SIZE, getCreateInitialSuggestionsCallback(initialBoard));
}
