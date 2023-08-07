import { Board } from "./board";
import { SIZE, QUADRANT_SIZE, Suggestions, getFinalSuggestion } from "./main";

type Analiser = (
  suggestionsBoard: Board<Suggestions>,
  row: number,
  column: number
) => Suggestions;

/** Remove suggestions that another cell has as final on the same row */
const sameRowFinalAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions = suggestionsBoard[row][column].value;

  for (let suggestion = 0; suggestion < SIZE; suggestion++) {
    // Skip if suggestion is not possible
    if (!suggestions[suggestion]) {
      continue;
    }

    for (let i = 0; i < SIZE; i++) {
      // Skip comparing to self
      if (i === row) {
        continue;
      }

      if (
        getFinalSuggestion(suggestionsBoard[i][column].value) === suggestion
      ) {
        suggestions[suggestion] = false;

        break;
      }
    }
  }

  return suggestions;
};

/** Remove suggestions that another cell has as final on the same column */
const sameColumnFinalAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions = suggestionsBoard[row][column].value;

  for (let suggestion = 0; suggestion < SIZE; suggestion++) {
    // Skip if suggestion is not possible
    if (!suggestions[suggestion]) {
      continue;
    }

    for (let j = 0; j < SIZE; j++) {
      // Skip comparing to self
      if (j === column) {
        continue;
      }

      if (getFinalSuggestion(suggestionsBoard[row][j].value) === suggestion) {
        suggestions[suggestion] = false;

        break;
      }
    }
  }

  return suggestions;
};

/** Remove suggestions that another cell has as final on the same quadrant */
const sameQuadrantFinalAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions = suggestionsBoard[row][column].value;

  const quadrantStart = {
    row: Math.floor(row / QUADRANT_SIZE) * QUADRANT_SIZE,
    column: Math.floor(column / QUADRANT_SIZE) * QUADRANT_SIZE,
  };

  for (let suggestion = 0; suggestion < SIZE; suggestion++) {
    // Skip if suggestion is not possible
    if (!suggestions[suggestion]) {
      continue;
    }

    for (let i = 0; i < QUADRANT_SIZE; i++) {
      for (let j = 0; j < QUADRANT_SIZE; j++) {
        // Skip comparing to self
        if (i == row && j === column) {
          continue;
        }

        const neighbourSuggestions =
          suggestionsBoard[quadrantStart.row + i][quadrantStart.column + j]
            .value;

        if (getFinalSuggestion(neighbourSuggestions) === suggestion) {
          suggestions[suggestion] = false;

          break;
        }
      }
    }
  }

  return suggestions;
};

const samePairInOnlyTwoCellsOfTheSameRowAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  let suggestions = suggestionsBoard[row][column].value;

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if suggestions are not possible
      if (!suggestions[s1] && !suggestions[s1]) {
        continue;
      }

      const cellsWithBothSuggestions = [];

      for (let j = 0; j < SIZE; j++) {
        const cellSuggestions = suggestionsBoard[row][j].value;

        if (cellSuggestions[s1] && cellSuggestions[s2]) {
          cellsWithBothSuggestions.push(j);
        }
      }

      // Skip unless there is exactly 2 cells with both suggestions
      if (cellsWithBothSuggestions.length !== 2) {
        continue;
      }

      console.log("samePairInOnlyTwoCellsOfTheSameRowAnaliser", {
        s1,
        s2,
        row,
        column,
        cellsWithBothSuggestions,
      });

      if (cellsWithBothSuggestions.includes(row)) {
        suggestions = Array(SIZE).fill(false);

        suggestions[s1] = true;
        suggestions[s2] = true;
      } else {
        suggestions[s1] = false;
        suggestions[s2] = false;
      }
    }
  }

  return suggestions;
};

const samePairInOnlyTwoCellsOfTheSameColumnAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  let suggestions = suggestionsBoard[row][column].value;

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if suggestions are not possible
      if (!suggestions[s1] && !suggestions[s1]) {
        continue;
      }

      const cellsWithBothSuggestions = [];

      for (let i = 0; i < SIZE; i++) {
        const cellSuggestions = suggestionsBoard[i][column].value;

        if (cellSuggestions[s1] && cellSuggestions[s2]) {
          cellsWithBothSuggestions.push(i);
        }
      }

      // Skip unless there is exactly 2 cells with both suggestions
      if (cellsWithBothSuggestions.length !== 2) {
        continue;
      }

      console.log("samePairInOnlyTwoCellsOfTheSameColumnAnaliser", {
        s1,
        s2,
        row,
        column,
        cellsWithBothSuggestions,
      });

      if (cellsWithBothSuggestions.includes(row)) {
        suggestions = Array(SIZE).fill(false);

        suggestions[s1] = true;
        suggestions[s2] = true;
      } else {
        suggestions[s1] = false;
        suggestions[s2] = false;
      }
    }
  }

  return suggestions;
};

const samePairInOnlyTwoCellsOfTheSameQuadrantAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  let suggestions = suggestionsBoard[row][column].value;

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if suggestions are not possible
      if (!suggestions[s1] && !suggestions[s1]) {
        continue;
      }

      const cellsWithBothSuggestions = [];

      for (let i = 0; i < QUADRANT_SIZE; i++) {
        for (let j = 0; j < QUADRANT_SIZE; j++) {
          const cellSuggestions = suggestionsBoard[i][j].value;

          if (cellSuggestions[s1] && cellSuggestions[s2]) {
            cellsWithBothSuggestions.push([i, j]);
          }
        }
      }

      // Skip unless there is exactly 2 cells with both suggestions
      if (cellsWithBothSuggestions.length !== 2) {
        continue;
      }

      console.log("samePairInOnlyTwoCellsOfTheSameQuadrantAnaliser", {
        s1,
        s2,
        row,
        column,
        cellsWithBothSuggestions,
      });

      if (
        cellsWithBothSuggestions.some(([i, j]) => i === row && j === column)
      ) {
        suggestions = Array(SIZE).fill(false);

        suggestions[s1] = true;
        suggestions[s2] = true;
      } else {
        suggestions[s1] = false;
        suggestions[s2] = false;
      }
    }
  }

  return suggestions;
};

export const cellAnalisers = [
  sameRowFinalAnaliser,
  sameColumnFinalAnaliser,
  sameQuadrantFinalAnaliser,
  samePairInOnlyTwoCellsOfTheSameRowAnaliser,
  samePairInOnlyTwoCellsOfTheSameColumnAnaliser,
  samePairInOnlyTwoCellsOfTheSameQuadrantAnaliser,
  /* TODO: 
    - same trio in only 3, same cuatrio in only 4, ...
    - two cells with only 2 suggestions that are the same, 3 cells with only 3 suggestions that are the same, ...
    - row/column needs a value and there is only one quadrant that can do it, so that quadrant can only put it in that row/column
  */
];
