import { Board, createBoard } from "./board";
import { cellAnalisers } from "./analisers";

const values = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export const SIZE = values.length;
export const QUADRANT_SIZE = Math.sqrt(SIZE);

type Value = (typeof values)[number];

export type Suggestions = boolean[];

function getCreateInitialSuggestionsCallback(
  initialBoard: Board<number | undefined>
) {
  return (row: number, y: number) => {
    const value = initialBoard[row][y].value;

    // Filled in: just 1 suggestion
    if (value !== undefined) {
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

function evaluate(oldSuggestionsBoard: Board<Suggestions>) {
  const suggestionsBoard = createBoard(SIZE, (row, y) => [
    ...oldSuggestionsBoard[row][y].value,
  ]);

  for (const cellAnaliser of cellAnalisers) {
    for (let row = 0; row < SIZE; row++) {
      for (let column = 0; column < SIZE; column++) {
        // Skip filled in cells
        if (
          getFinalSuggestion(suggestionsBoard[row][column].value) !== undefined
        ) {
          continue;
        }

        const analiserResult = cellAnaliser(suggestionsBoard, row, column);

        if (analiserResult.hasChanged) {
          suggestionsBoard[row][column].value = analiserResult.suggestions;

          return {
            suggestionsBoard,
            hasChanged: true,
          };
        }
      }
    }
  }

  return {
    suggestionsBoard,
    hasChanged: false,
  };
}

export function getSuggestions(
  initialBoard: Board<number | undefined>
): Board<Suggestions> {
  let suggestionsBoard = createBoard(
    SIZE,
    getCreateInitialSuggestionsCallback(initialBoard)
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const evaluateResult = evaluate(suggestionsBoard);

    if (evaluateResult.hasChanged) {
      suggestionsBoard = evaluateResult.suggestionsBoard;

      continue;
    }

    break;
  }

  return suggestionsBoard;
}
