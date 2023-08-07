import { Board, areSameBoards, createBoard } from "./board";
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

function areSameSuggestions(a: Suggestions, b: Suggestions) {
  for (const value of values) {
    if (a[value] !== b[value]) {
      return false;
    }
  }

  return true;
}

function evaluate(oldSuggestionsBoard: Board<Suggestions>, depth: number) {
  const suggestionsBoard = createBoard(SIZE, (row, y) => [
    ...oldSuggestionsBoard[row][y].value,
  ]);

  cellAnalisers
    .filter((_, i) => i < depth)
    .forEach((cellAnaliser) => {
      for (let row = 0; row < SIZE; row++) {
        for (let y = 0; y < SIZE; y++) {
          // Skip filled in cells
          if (
            getFinalSuggestion(suggestionsBoard[row][y].value) !== undefined
          ) {
            continue;
          }

          const resultSuggestions = cellAnaliser(suggestionsBoard, row, y);

          suggestionsBoard[row][y].value = resultSuggestions;
        }
      }
    });

  return suggestionsBoard;
}

export function getSuggestions(
  initialBoard: Board<number | undefined>,
  suggestionDepth?: number
): Board<Suggestions> {
  let suggestionsBoard = createBoard(
    SIZE,
    getCreateInitialSuggestionsCallback(initialBoard)
  );

  console.log("Start", { initialBoard, suggestionsBoard });

  let evaluatorDepth = 1;

  let passCount = 1;

  // eslint-disable-next-line no-constant-condition
  while (suggestionDepth === undefined || passCount <= suggestionDepth) {
    passCount++;

    const resultSuggestionsBoard = evaluate(suggestionsBoard, evaluatorDepth);

    console.log("After evaluate", {
      passCount,
      evaluatorDepth,
      suggestionsBoard,
      resultSuggestionsBoard,
    });

    if (
      !areSameBoards(
        suggestionsBoard,
        resultSuggestionsBoard,
        areSameSuggestions
      )
    ) {
      evaluatorDepth = 1;
      suggestionsBoard = resultSuggestionsBoard;
      continue;
    }

    if (evaluatorDepth <= cellAnalisers.length) {
      evaluatorDepth++;
      continue;
    }

    console.log("Exit", {
      passCount,
      evaluatorDepth,
      suggestionsBoard,
      resultSuggestionsBoard,
    });

    break;
  }

  return suggestionsBoard;
}
