import { Board } from "./board";
import { SIZE, QUADRANT_SIZE, Suggestions, getFinalSuggestion } from "./main";

type Response = {
  hasChanged: boolean;
  suggestions: Suggestions;
};

type Analiser = (
  suggestionsBoard: Board<Suggestions>,
  row: number,
  column: number
) => Response;

// FINAL

/** Remove suggestions that another cell has as final on the same row */
const sameRowFinalAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

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

        return {
          hasChanged: true,
          suggestions,
        };
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove suggestions that another cell has as final on the same column */
const sameColumnFinalAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

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

        return {
          hasChanged: true,
          suggestions,
        };
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove suggestions that another cell has as final on the same quadrant */
const sameQuadrantFinalAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  const quadrantStart = {
    row: Math.floor(row / QUADRANT_SIZE) * QUADRANT_SIZE,
    column: Math.floor(column / QUADRANT_SIZE) * QUADRANT_SIZE,
  };

  for (let suggestion = 0; suggestion < SIZE; suggestion++) {
    // Skip if suggestion is not possible
    if (!suggestions[suggestion]) {
      continue;
    }

    for (
      let i = quadrantStart.row;
      i < quadrantStart.row + QUADRANT_SIZE;
      i++
    ) {
      for (
        let j = quadrantStart.column;
        j < quadrantStart.column + QUADRANT_SIZE;
        j++
      ) {
        // Skip comparing to self
        if (i == row && j === column) {
          continue;
        }

        const neighbourSuggestions = suggestionsBoard[i][j].value;

        if (getFinalSuggestion(neighbourSuggestions) === suggestion) {
          suggestions[suggestion] = false;

          return {
            hasChanged: true,
            suggestions,
          };
        }
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

// Only cell with this suggestion

/** Remove suggestions that another cell has as final on the same row */
const onlyInRowAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  for (let suggestion = 0; suggestion < SIZE; suggestion++) {
    // Skip if suggestion is not possible
    if (!suggestions[suggestion]) {
      continue;
    }

    const cellsWithSuggestion: number[] = [];

    for (let j = 0; j < SIZE; j++) {
      const cellSuggestions = suggestionsBoard[row][j].value;

      if (cellSuggestions[suggestion]) {
        cellsWithSuggestion.push(j);
      }
    }

    // Skip unless there is exactly 1 cell with the suggestion
    if (cellsWithSuggestion.length !== 1) {
      continue;
    }

    // Remove any other suggestions
    for (
      let suggestionToRemove = 0;
      suggestionToRemove < SIZE;
      suggestionToRemove++
    ) {
      // Skip the compared suggestion
      if (suggestionToRemove === suggestion) {
        continue;
      }

      // Remove any other suggestions
      if (suggestions[suggestionToRemove]) {
        suggestions[suggestionToRemove] = false;

        return {
          hasChanged: true,
          suggestions,
        };
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove suggestions that another cell has as final on the same column */
const onlyInColumnAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  for (let suggestion = 0; suggestion < SIZE; suggestion++) {
    // Skip if suggestion is not possible
    if (!suggestions[suggestion]) {
      continue;
    }

    const cellsWithSuggestion: number[] = [];

    for (let i = 0; i < SIZE; i++) {
      const cellSuggestions = suggestionsBoard[i][column].value;

      if (cellSuggestions[suggestion]) {
        cellsWithSuggestion.push(i);
      }
    }

    // Skip unless there is exactly 1 cell with the suggestion
    if (cellsWithSuggestion.length !== 1) {
      continue;
    }

    // Remove any other suggestions
    for (
      let suggestionToRemove = 0;
      suggestionToRemove < SIZE;
      suggestionToRemove++
    ) {
      // Skip the compared suggestion
      if (suggestionToRemove === suggestion) {
        continue;
      }

      // Remove any other suggestions
      if (suggestions[suggestionToRemove]) {
        suggestions[suggestionToRemove] = false;

        return {
          hasChanged: true,
          suggestions,
        };
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove suggestions that another cell has as final on the same quadrant */
const onlyInQuadrantAnaliser: Analiser = (suggestionsBoard, row, column) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  const quadrantStart = {
    row: Math.floor(row / QUADRANT_SIZE) * QUADRANT_SIZE,
    column: Math.floor(column / QUADRANT_SIZE) * QUADRANT_SIZE,
  };

  for (let suggestion = 0; suggestion < SIZE; suggestion++) {
    // Skip if suggestion is not possible
    if (!suggestions[suggestion]) {
      continue;
    }

    const cellsWithSuggestion: [number, number][] = [];

    for (
      let i = quadrantStart.row;
      i < quadrantStart.row + QUADRANT_SIZE;
      i++
    ) {
      for (
        let j = quadrantStart.column;
        j < quadrantStart.column + QUADRANT_SIZE;
        j++
      ) {
        const cellSuggestions = suggestionsBoard[i][j].value;

        if (cellSuggestions[suggestion]) {
          cellsWithSuggestion.push([i, j]);
        }
      }
    }

    // Skip unless there is exactly 1 cell with the suggestion
    if (cellsWithSuggestion.length !== 1) {
      continue;
    }

    // Remove any other suggestions
    for (
      let suggestionToRemove = 0;
      suggestionToRemove < SIZE;
      suggestionToRemove++
    ) {
      // Skip the compared suggestion
      if (suggestionToRemove === suggestion) {
        continue;
      }

      // Remove any other suggestions
      if (suggestions[suggestionToRemove]) {
        suggestions[suggestionToRemove] = false;

        return {
          hasChanged: true,
          suggestions,
        };
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

// Only pair with suggestions

/** Remove other suggestions when this and another cell are the only ones with two numbers */
const sameRowSharesPairOfSuggestionsAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if both suggestions are the same
      if (s1 === s2) {
        continue;
      }

      // Skip if any of the suggestions are not possible
      if (!suggestions[s1] || !suggestions[s2]) {
        continue;
      }

      const cellsWithAnyOfBothSuggestions: number[] = [];

      for (let j = 0; j < SIZE; j++) {
        const cellSuggestions = suggestionsBoard[row][j].value;

        if (cellSuggestions[s1] || cellSuggestions[s2]) {
          cellsWithAnyOfBothSuggestions.push(j);
        }
      }

      // Skip unless there is exactly 2 cells with any of both suggestions
      if (cellsWithAnyOfBothSuggestions.length !== 2) {
        continue;
      }

      // Skip unless both cells have both suggestions
      if (
        cellsWithAnyOfBothSuggestions.some(
          (j) =>
            !suggestionsBoard[row][j].value[s1] ||
            !suggestionsBoard[row][j].value[s2]
        )
      ) {
        continue;
      }

      // Skip if is not one of the pair
      if (!cellsWithAnyOfBothSuggestions.includes(column)) {
        continue;
      }

      for (let suggestion = 0; suggestion < SIZE; suggestion++) {
        // Skip the compared pair of suggestions
        if (suggestion === s1 || suggestion === s2) {
          continue;
        }

        // Remove any other suggestions
        if (suggestions[suggestion]) {
          suggestions[suggestion] = false;

          return {
            hasChanged: true,
            suggestions,
          };
        }
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove other suggestions when two cells are the only ones with two numbers */
const sameColumnSharesPairOfSuggestionsAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if both suggestions are the same
      if (s1 === s2) {
        continue;
      }

      // Skip if any of the suggestions are not possible
      if (!suggestions[s1] || !suggestions[s2]) {
        continue;
      }

      const cellsWithAnyOfBothSuggestions: number[] = [];

      for (let i = 0; i < SIZE; i++) {
        const cellSuggestions = suggestionsBoard[i][column].value;

        if (cellSuggestions[s1] || cellSuggestions[s2]) {
          cellsWithAnyOfBothSuggestions.push(i);
        }
      }

      // Skip unless there is exactly 2 cells with any of both suggestions
      if (cellsWithAnyOfBothSuggestions.length !== 2) {
        continue;
      }

      // Skip unless both cells have both suggestions
      if (
        cellsWithAnyOfBothSuggestions.some(
          (i) =>
            !suggestionsBoard[i][column].value[s1] ||
            !suggestionsBoard[i][column].value[s2]
        )
      ) {
        continue;
      }

      // Skip if is not one of the pair
      if (!cellsWithAnyOfBothSuggestions.includes(row)) {
        continue;
      }

      for (let suggestion = 0; suggestion < SIZE; suggestion++) {
        // Skip the compared pair of suggestions
        if (suggestion === s1 || suggestion === s2) {
          continue;
        }

        // Remove any other suggestions
        if (suggestions[suggestion]) {
          suggestions[suggestion] = false;

          return {
            hasChanged: true,
            suggestions,
          };
        }
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove other suggestions when two cells are the only ones with two numbers */
const sameQuadrantSharesPairOfSuggestionsAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  const quadrantStart = {
    row: Math.floor(row / QUADRANT_SIZE) * QUADRANT_SIZE,
    column: Math.floor(column / QUADRANT_SIZE) * QUADRANT_SIZE,
  };

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if both suggestions are the same
      if (s1 === s2) {
        continue;
      }

      // Skip if any of the suggestions are not possible
      if (!suggestions[s1] || !suggestions[s2]) {
        continue;
      }

      const cellsWithAnyOfBothSuggestions: [number, number][] = [];

      for (
        let i = quadrantStart.row;
        i < quadrantStart.row + QUADRANT_SIZE;
        i++
      ) {
        for (
          let j = quadrantStart.column;
          j < quadrantStart.column + QUADRANT_SIZE;
          j++
        ) {
          const cellSuggestions = suggestionsBoard[i][j].value;

          if (cellSuggestions[s1] || cellSuggestions[s2]) {
            cellsWithAnyOfBothSuggestions.push([i, j]);
          }
        }
      }

      // Skip unless there is exactly 2 cells with any of both suggestions
      if (cellsWithAnyOfBothSuggestions.length !== 2) {
        continue;
      }

      // Skip unless both cells have both suggestions
      if (
        cellsWithAnyOfBothSuggestions.some(
          ([i, j]) =>
            !suggestionsBoard[i][j].value[s1] ||
            !suggestionsBoard[i][j].value[s2]
        )
      ) {
        continue;
      }

      // Skip if is not one of the pair
      if (
        !cellsWithAnyOfBothSuggestions.some(
          ([i, j]) => i === row && j === column
        )
      ) {
        continue;
      }

      for (let suggestion = 0; suggestion < SIZE; suggestion++) {
        // Skip the compared pair of suggestions
        if (suggestion === s1 || suggestion === s2) {
          continue;
        }

        // Remove any other suggestions
        if (suggestions[suggestion]) {
          suggestions[suggestion] = false;

          return {
            hasChanged: true,
            suggestions,
          };
        }
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

// Other pair has only suggestions

/** Remove pair of suggestions when other two cells can only be those numbers */
const sameRowOtherTwoSharePairOfSuggestionsAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if both suggestions are the same
      if (s1 === s2) {
        continue;
      }

      // Skip if both suggestions are not possible
      if (!suggestions[s1] && !suggestions[s2]) {
        continue;
      }

      const cellsWithOnlyBothSuggestions: number[] = [];

      for (let j = 0; j < SIZE; j++) {
        const cellSuggestions = suggestionsBoard[row][j].value;

        let hasOnlyPair = true;

        for (let suggestion = 0; suggestion < SIZE; suggestion++) {
          if (suggestion === s1 || suggestion === s2) {
            if (!cellSuggestions[suggestion]) {
              hasOnlyPair = false;

              break;
            }
          } else {
            if (cellSuggestions[suggestion]) {
              hasOnlyPair = false;

              break;
            }
          }
        }

        if (hasOnlyPair) {
          cellsWithOnlyBothSuggestions.push(j);
        }
      }

      // Skip unless there is exactly 2 cells with only both suggestions
      if (cellsWithOnlyBothSuggestions.length !== 2) {
        continue;
      }

      // Skip if is one of the pair
      if (cellsWithOnlyBothSuggestions.includes(column)) {
        continue;
      }

      // Remove suggestions
      for (const suggestion of [s1, s2]) {
        if (suggestions[suggestion]) {
          suggestions[suggestion] = false;

          return {
            hasChanged: true,
            suggestions,
          };
        }
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove pair of suggestions when other two cells can only be those numbers */
const sameColumnOtherTwoSharePairOfSuggestionsAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if both suggestions are the same
      if (s1 === s2) {
        continue;
      }

      // Skip if both suggestions are not possible
      if (!suggestions[s1] && !suggestions[s2]) {
        continue;
      }

      const cellsWithOnlyBothSuggestions: number[] = [];

      for (let i = 0; i < SIZE; i++) {
        const cellSuggestions = suggestionsBoard[i][column].value;

        let hasOnlyPair = true;

        for (let suggestion = 0; suggestion < SIZE; suggestion++) {
          if (suggestion === s1 || suggestion === s2) {
            if (!cellSuggestions[suggestion]) {
              hasOnlyPair = false;

              break;
            }
          } else {
            if (cellSuggestions[suggestion]) {
              hasOnlyPair = false;

              break;
            }
          }
        }

        if (hasOnlyPair) {
          cellsWithOnlyBothSuggestions.push(i);
        }
      }

      // Skip unless there is exactly 2 cells with any of both suggestions
      if (cellsWithOnlyBothSuggestions.length !== 2) {
        continue;
      }

      // Skip if is one of the pair
      if (cellsWithOnlyBothSuggestions.includes(row)) {
        continue;
      }

      // Remove suggestions
      for (const suggestion of [s1, s2]) {
        if (suggestions[suggestion]) {
          suggestions[suggestion] = false;

          return {
            hasChanged: true,
            suggestions,
          };
        }
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove pair of suggestions when other two cells can only be those numbers */
const sameQuadrantOtherTwoSharePairOfSuggestionsAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  const quadrantStart = {
    row: Math.floor(row / QUADRANT_SIZE) * QUADRANT_SIZE,
    column: Math.floor(column / QUADRANT_SIZE) * QUADRANT_SIZE,
  };

  for (let s1 = 0; s1 < SIZE; s1++) {
    for (let s2 = 0; s2 < SIZE; s2++) {
      // Skip if both suggestions are the same
      if (s1 === s2) {
        continue;
      }

      // Skip if both suggestions are not possible
      if (!suggestions[s1] && !suggestions[s2]) {
        continue;
      }

      const cellsWithOnlyBothSuggestions: [number, number][] = [];

      for (
        let i = quadrantStart.row;
        i < quadrantStart.row + QUADRANT_SIZE;
        i++
      ) {
        for (
          let j = quadrantStart.column;
          j < quadrantStart.column + QUADRANT_SIZE;
          j++
        ) {
          const cellSuggestions = suggestionsBoard[i][j].value;

          let hasOnlyPair = true;

          for (let suggestion = 0; suggestion < SIZE; suggestion++) {
            if (suggestion === s1 || suggestion === s2) {
              if (!cellSuggestions[suggestion]) {
                hasOnlyPair = false;

                break;
              }
            } else {
              if (cellSuggestions[suggestion]) {
                hasOnlyPair = false;

                break;
              }
            }
          }

          if (hasOnlyPair) {
            cellsWithOnlyBothSuggestions.push([i, j]);
          }
        }
      }

      // Skip unless there is exactly 2 cells with any of both suggestions
      if (cellsWithOnlyBothSuggestions.length !== 2) {
        continue;
      }

      // Skip if is one of the pair
      if (
        cellsWithOnlyBothSuggestions.some(([i, j]) => i === row && j === column)
      ) {
        continue;
      }

      // Remove suggestions
      for (const suggestion of [s1, s2]) {
        if (suggestions[suggestion]) {
          suggestions[suggestion] = false;

          return {
            hasChanged: true,
            suggestions,
          };
        }
      }
    }
  }

  return {
    hasChanged: false,
    suggestions,
  };
};

// Other pair has only suggestions

/** Remove suggestion when another quadrant can only use it in this row */
const sameRowOcuppiedByOtherQuadrantAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  return {
    hasChanged: false,
    suggestions,
  };
};

/** Remove pair of suggestions when other two cells can only be those numbers */
const sameColumnOcuppiedByOtherQuadrantAnaliser: Analiser = (
  suggestionsBoard,
  row,
  column
) => {
  const suggestions: Suggestions = [...suggestionsBoard[row][column].value];

  return {
    hasChanged: false,
    suggestions,
  };
};

export const cellAnalisers = [
  sameRowFinalAnaliser,
  sameColumnFinalAnaliser,
  sameQuadrantFinalAnaliser,
  onlyInRowAnaliser,
  onlyInColumnAnaliser,
  onlyInQuadrantAnaliser,
  sameRowSharesPairOfSuggestionsAnaliser,
  sameColumnSharesPairOfSuggestionsAnaliser,
  sameQuadrantSharesPairOfSuggestionsAnaliser,
  sameRowOtherTwoSharePairOfSuggestionsAnaliser,
  sameColumnOtherTwoSharePairOfSuggestionsAnaliser,
  sameQuadrantOtherTwoSharePairOfSuggestionsAnaliser,
  /* TODO: 
    - same trio in only 3, same cuatrio in only 4, ...
    - two cells with only 2 suggestions that are the same, 3 cells with only 3 suggestions that are the same, ...
    - row/column needs a value and there is only one quadrant that can do it, so that quadrant can only put it in that row/column
  */
];
