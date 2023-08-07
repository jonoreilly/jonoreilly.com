<template>
  <div>
    <input type="number" v-model="depth" @change="updateSuggestions()" />
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
            @keypress="onBoardCellChanged(row, column, $event)"
          >
            <div v-if="board[row][column].value !== undefined">
              {{ board[row][column].value + 1 }}
            </div>

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

const prefill = [
  { row: 0, column: 0, value: 3 },
  { row: 1, column: 2, value: 7 },
  { row: 0, column: 4, value: 0 },
  { row: 0, column: 5, value: 1 },
  { row: 1, column: 4, value: 6 },
  { row: 0, column: 6, value: 4 },
];

export default defineComponent({
  data() {
    const board = createBoard<number | undefined>(
      SIZE,
      (row, column) =>
        prefill.find((el) => el.row === row && el.column === column)?.value
    );

    return {
      SIZE,
      board,
      suggestionsBoard: getSuggestions(board),
      depth: 20,
    };
  },

  methods: {
    updateSuggestions() {
      this.suggestionsBoard = getSuggestions(this.board, this.depth);
    },

    onBoardCellChanged(row: number, column: number, $event: KeyboardEvent) {
      // Keycode 49 = 1, 57 = 9
      const valuesMap: Record<string, number> = {
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

      if (value === undefined) {
        console.log("Invalid key", $event);

        return;
      }

      if (this.board[row][column].value !== undefined) {
        console.log("Cell already set");

        return;
      }

      if (!this.suggestionsBoard[row][column].value[value]) {
        console.log("Not a possible value");

        return;
      }

      this.board[row][column].value = value;

      this.updateSuggestions();
    },
  },
});
</script>

<style scoped lang="scss">
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

      &:focus {
        background: lightblue;
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

      .suggestions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        font-size: 0.7rem;
        gap: 0.25rem;
        color: gray;
      }
    }
  }
}
</style>
