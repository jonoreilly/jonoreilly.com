<template>
  <div class="buttons">
    <button @click="reset()">RESET</button>
  </div>

  <div class="wrapper">
    <div class="board">
      <template v-for="(_, row) in SIZE" :key="row">
        <template v-for="(_, column) in SIZE" :key="column">
          <div
            tabindex="0"
            class="cell"
            :data-row="row"
            :data-column="column"
            @keydown="onKey(row, column, $event)"
          >
            <span v-if="board[row][column].value !== undefined" class="final">
              {{ board[row][column].value + 1 }}
            </span>

            <div v-else class="suggestions">
              <div v-for="(_, s) in SIZE" :key="s">
                <template v-if="suggestionsBoard?.[row][column].value[s]">
                  {{ s + 1 }}
                </template>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { createBoard } from "@/utils/projects/sudoku/board";
import { getSuggestions, SIZE } from "@/utils/projects/sudoku/main";
import { defineComponent } from "vue";

function getEmptyBoard() {
  return createBoard<number | undefined>(SIZE, () => undefined);
}

export default defineComponent({
  data() {
    const board = getEmptyBoard();

    return {
      SIZE,
      board,
      suggestionsBoard: getSuggestions(board),
    };
  },

  methods: {
    updateSuggestions() {
      this.suggestionsBoard = getSuggestions(this.board);
    },

    reset() {
      this.board = getEmptyBoard();

      this.updateSuggestions();
    },

    onKey(row: number, column: number, $event: KeyboardEvent) {
      // Check arrows for movement
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          $event.code
        )
      ) {
        this.onArrowKey(row, column, $event);

        return;
      }

      // Check values for numbers

      if (
        [
          "Digit0",
          "Digit1",
          "Digit2",
          "Digit3",
          "Digit4",
          "Digit5",
          "Digit6",
          "Digit7",
          "Digit8",
          "Digit9",
        ].includes($event.code)
      ) {
        this.onNumberKey(row, column, $event);

        return;
      }

      console.log("Invalid key", $event.code);
    },

    onArrowKey(row: number, column: number, $event: KeyboardEvent) {
      let nextRow = row;
      let nextColumn = column;

      switch ($event.code) {
        case "ArrowUp":
          if (nextRow > 0) {
            nextRow--;
          }

          break;

        case "ArrowDown":
          if (nextRow < SIZE - 1) {
            nextRow++;
          }

          break;

        case "ArrowLeft":
          if (nextColumn > 0) {
            nextColumn--;
          }

          break;

        case "ArrowRight":
          if (nextColumn < SIZE - 1) {
            nextColumn++;
          }

          break;
      }

      this.$el.parentElement
        .querySelector(`[data-row="${nextRow}"][data-column="${nextColumn}"]`)
        ?.focus();
    },

    onNumberKey(row: number, column: number, $event: KeyboardEvent) {
      const valuesMap: Record<string, number | undefined> = {
        Digit0: undefined,
        Digit1: 0,
        Digit2: 1,
        Digit3: 2,
        Digit4: 3,
        Digit5: 4,
        Digit6: 5,
        Digit7: 6,
        Digit8: 7,
        Digit9: 8,
      };

      const value = valuesMap[$event.code];

      this.board[row][column].value = value;

      this.updateSuggestions();
    },
  },
});
</script>

<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: center;
  margin: 2rem;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  .board {
    width: fit-content;
    display: grid;
    grid-template-columns: repeat(9, max-content);
    border: 2px solid black;

    .cell {
      width: 50px;
      height: 50px;
      border: 1px solid gray;
      display: flex;
      justify-content: center;
      align-items: center;

      &:focus,
      &:focus-visible {
        background: lightblue;
        outline: unset;
      }

      &[data-row="0"],
      &[data-row="3"],
      &[data-row="6"] {
        border-top: 2px solid black;
      }

      &[data-row="2"],
      &[data-row="5"],
      &[data-row="8"] {
        border-bottom: 2px solid black;
      }

      &[data-column="0"],
      &[data-column="3"],
      &[data-column="6"] {
        border-left: 2px solid black;
      }

      &[data-column="2"],
      &[data-column="5"],
      &[data-column="8"] {
        border-right: 2px solid black;
      }

      .final {
        font-size: 2.5rem;
        font-weight: bold;
      }

      .suggestions {
        width: max-content;
        height: max-content;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        font-size: 0.7rem;
        gap: 0.2rem 0.5rem;
        color: gray;
      }
    }
  }
}
</style>
