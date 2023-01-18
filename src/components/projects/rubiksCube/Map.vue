<template>
  <div>
    <button
      style="
        width: 200px;
        height: 60px;
        background: green;
        border-radius: 10px;
        cursor: pointer;
      "
      :disabled="isSolving"
      @click="solve()"
    >
      {{ isSolving ? "SOLVING..." : "SOLVE" }}
    </button>

    <p>Processed positions: {{ stats.total }}</p>

    <p>Discarded positions: {{ stats.discarded }}</p>

    <p>
      Discard percentage:
      {{ ((stats.discarded * 100) / stats.total).toFixed() }}%
    </p>

    <p>
      Positions processed per second: {{ stats.positionsPerSecond.toFixed(2) }}
    </p>

    <p>Movemet depth: {{ stats.depth }}</p>

    <p>Steps to solve: {{ stepsToSolve }}</p>

    <div class="cube cube-sm">
      <div
        v-for="faceName in faceNames"
        :key="faceName"
        class="face"
        :face="faceName"
      >
        <div v-for="(_, row) in 3" :key="row" class="row">
          <div
            v-for="(_, column) in 3"
            :key="column"
            class="cell"
            :face="stats.cube[faceName][row][column].faceName"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
    "
  >
    <div class="cube">
      <div
        v-for="faceName in faceNames"
        :key="faceName"
        class="face"
        :face="faceName"
        @click="rotate(faceName)"
      >
        <div v-for="(_, row) in 3" :key="row" class="row">
          <div
            v-for="(_, column) in 3"
            :key="column"
            class="cell"
            :face="cube[faceName][row][column].faceName"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  getRotated,
  getCube,
  faceNames,
  FaceName,
} from "@/utils/projects/rubiksCube/cube";
import { getStepsToSolve } from "@/utils/projects/rubiksCube/solvers/bruteForce";

export default defineComponent({
  data() {
    return {
      cube: getCube(),
      faceNames,
      stepsToSolve: [] as FaceName[],
      isSolving: false,
      stats: {
        total: 0,
        discarded: 0,
        cube: getCube(),
        depth: 0,
        positionsPerSecond: 0,
      },
    };
  },

  methods: {
    rotate(faceName: FaceName) {
      this.cube = getRotated(this.cube, faceName);
    },

    async solve() {
      this.isSolving = true;

      this.stepsToSolve = [];

      this.stepsToSolve = await getStepsToSolve(this.cube, (stats) => {
        this.stats = { ...stats };
      });

      this.isSolving = false;
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
}

.row {
  display: flex;
}

$size: 60px;

.cell {
  width: $size;
  height: $size;
  border: 1px solid black;
}

.cube-sm {
  .cell {
    width: $size/6;
    height: $size/6;
  }
}

$faces: (
  up: (
    color: white,
    row: 1,
    column: 2,
  ),
  left: (
    color: red,
    row: 2,
    column: 1,
  ),
  front: (
    color: green,
    row: 2,
    column: 2,
  ),
  right: (
    color: yellow,
    row: 2,
    column: 3,
  ),
  back: (
    color: blue,
    row: 2,
    column: 4,
  ),
  down: (
    color: orange,
    row: 3,
    column: 2,
  ),
);

@each $face, $settings in $faces {
  .face[face="#{$face}"] {
    grid-row: map-get($settings, row);
    grid-column: map-get($settings, column);
  }
}

@each $face, $settings in $faces {
  .cell[face="#{$face}"] {
    background-color: map-get($settings, color);
  }
}
</style>