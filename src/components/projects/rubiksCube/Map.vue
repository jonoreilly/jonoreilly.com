<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
    "
  >
    <div class="cube">
      <div v-for="(_, f) in 6" :key="f" class="face">
        <div v-for="(_, r) in 3" :key="r" class="row">
          <div
            v-for="(_, c) in 3"
            :key="c"
            class="cell"
            :color="getColor(layout?.[f]?.[r]?.[c])"
            @click="rotate(f)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getRotated, getCube } from "@/utils/projects/rubiksCube/cube";

type Color = "white" | "red" | "green" | "yellow" | "blue" | "orange";

export default defineComponent({
  data() {
    return {
      layout: getCube(),
    };
  },

  methods: {
    rotate(face: number) {
      this.layout = getRotated(this.layout, face);
    },

    getColor(cell: number): Color {
      const cellsPerFace = 9;

      if (cell < cellsPerFace) {
        return "white";
      }

      if (cell < cellsPerFace * 2) {
        return "red";
      }

      if (cell < cellsPerFace * 3) {
        return "green";
      }

      if (cell < cellsPerFace * 4) {
        return "yellow";
      }

      if (cell < cellsPerFace * 5) {
        return "blue";
      }

      return "orange";
    },
  },
});
</script>

<style scoped lang="scss">
.cube {
  display: grid;
  width: fit-content;
  height: fit-content;
}

.face {
  border: 1px solid black;
  width: fit-content;
  height: fit-content;

  &:hover {
    outline: purple solid 10px;
    z-index: 10;
  }

  $positions: (
    1: (
      row: 1,
      column: 2,
    ),
    2: (
      row: 2,
      column: 1,
    ),
    3: (
      row: 2,
      column: 2,
    ),
    4: (
      row: 2,
      column: 3,
    ),
    5: (
      row: 2,
      column: 4,
    ),
    6: (
      row: 3,
      column: 2,
    ),
  );

  @each $i, $position in $positions {
    &:nth-child(#{$i}) {
      grid-row: map-get($position, row);
      grid-column: map-get($position, column);
    }
  }
}

.row {
  display: flex;
}

$colors: (white, red, green, yellow, blue, orange);

$size: 60px;

.cell {
  width: $size;
  height: $size;
  border: 1px solid black;

  @each $color in $colors {
    &[color="#{$color}"] {
      background-color: $color;
    }
  }
}
</style>
