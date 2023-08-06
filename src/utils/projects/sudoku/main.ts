import { Board, areSameBoards, createBoard } from "./board";
import { cellAnalisers } from "./analisers";

const values = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export const SIZE = values.length;
export const QUADRANT_SIZE = Math.sqrt(SIZE);

type Value = (typeof values)[number];

export type Suggestions = boolean[];

function getCreateInitialSuggestionsCallback(
  initialBoard: Board<Value | undefined>
) {
  return (x: number, y: number) => {
    const value = initialBoard[x][y].value;

    // Filled in: just 1 suggestion
    if (value) {
      const suggestions = values.map(() => false);

      suggestions[value] = true;

      return suggestions;
    }

    // Not filled in: All suggestions
    return values.map(() => true);
  };
}

export function getFinalSuggestion(
  suggestions: Suggestions
): Value | undefined {
  const possibleValues = values.filter((value) => suggestions[value]);

  if (possibleValues.length === 1) {
    return possibleValues[0];
  }
}

function areSameSuggestions(a: Suggestions, b: Suggestions) {
  for (const value of values) {
    if (a[value] !== b[value]) {
      return false;
    }
  }

  return true;
}

function evaluateCell(
  oldSuggestionsBoard: Board<Suggestions>,
  x: number,
  y: number
) {
  const suggestionsBoard = createBoard(SIZE, (x, y) => [
    ...oldSuggestionsBoard[x][y].value,
  ]);

  cellAnalisers.forEach((cellAnaliser) => {
    const resultSuggestions = cellAnaliser(suggestionsBoard, x, y);

    suggestionsBoard[x][y].value = resultSuggestions;
  });

  return suggestionsBoard[x][y].value;
}

function evaluate(oldSuggestionsBoard: Board<Suggestions>) {
  const suggestionsBoard = createBoard(SIZE, (x, y) => [
    ...oldSuggestionsBoard[x][y].value,
  ]);

  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      if (getFinalSuggestion(suggestionsBoard[x][y].value) === undefined) {
        const resultSuggestions = evaluateCell(suggestionsBoard, x, y);

        suggestionsBoard[x][y].value = resultSuggestions;
      }
    }
  }

  return suggestionsBoard;
}

export function getSuggestions(
  initialBoard: Board<Value | undefined>
): Board<Suggestions> {
  let suggestionsBoard = createBoard(
    SIZE,
    getCreateInitialSuggestionsCallback(initialBoard)
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const resultSuggestionsBoard = evaluate(suggestionsBoard);

    if (
      areSameBoards(
        suggestionsBoard,
        resultSuggestionsBoard,
        areSameSuggestions
      )
    ) {
      break;
    }

    suggestionsBoard = resultSuggestionsBoard;
  }

  return suggestionsBoard;
}
