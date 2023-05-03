<template>
  <div>
    <p>
      <label>
        Algorythm:

        <select v-model="params.algorythm">
          <option
            v-for="option in algorythmOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </label>
    </p>

    <p>
      <label>
        Storage structure:

        <select v-model="params.storage">
          <option
            v-for="option in storageOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </label>
    </p>

    <p>
      <template v-if="isSolving">
        <button
          style="
            width: 200px;
            height: 60px;
            background: red;
            border-radius: 10px;
            cursor: pointer;
          "
          @click="stopSolving()"
        >
          STOP
        </button>

        SOLVING...
      </template>

      <button
        v-else
        style="
          width: 200px;
          height: 60px;
          background: green;
          border-radius: 10px;
          cursor: pointer;
        "
        @click="solve()"
      >
        SOLVE
      </button>
    </p>

    <p>Processed positions: {{ stats.total }}</p>

    <p>Discarded positions: {{ stats.discarded }}</p>

    <p>
      Discard percentage:
      {{ ((stats.discarded * 100) / stats.total).toFixed() }}%
    </p>

    <p>
      Positions processed per second: {{ stats.positionsPerSecond.toFixed(2) }}
    </p>

    <p>
      Total posible combinations:
      {{ totalCombinations }}
    </p>

    <p>
      Percentage processed:
      {{ ((stats.total * 100) / totalCombinations).toFixed(70) }} %
    </p>

    <p>
      Estimated time until solved:
      {{ elapsedTimeUntilSolvedParsed }}
    </p>

    <p>Movemet depth: {{ stats.depth }}</p>

    <p>Distance to solved: {{ stats.distance }}</p>

    <p>Elapsed time: {{ elapsedTimeParsed }}</p>

    <p>Current distance to solved: {{ currentDistanceToSolved }}</p>

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

    <p>Steps to solve: {{ stepsToSolve }}</p>
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
            :face="params.cube[faceName][row][column].faceName"
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
import {
  getStepsToSolve,
  getDistanceToSolved,
  Params,
} from "@/utils/projects/rubiksCube/solvers/index";

const algorythmOptions: Params["algorythm"][] = ["brute-force", "dijkstra"];
const storageOptions: Params["storage"][] = ["object", "array"];

function factorial(n: number): number {
  if (n <= 1) {
    return n;
  }

  return n * factorial(n - 1);
}

const totalCombinations = factorial(9 * 6);

function parseTime(millis: number) {
  const seconds = millis / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365;

  let result = "";

  if (years >= 1) {
    result += years.toFixed().padStart(4, "0") + "years ";
  }

  if (days >= 1) {
    result += (days % 365).toFixed().padStart(2, "0") + "days ";
  }

  if (hours >= 1) {
    result += (hours % 24).toFixed().padStart(2, "0") + "h ";
  }

  if (minutes >= 1) {
    result += (minutes % 60).toFixed().padStart(2, "0") + "m ";
  }

  result += (seconds % 60).toFixed(2).padStart(5, "0") + "s";

  return result;
}

export default defineComponent({
  data() {
    return {
      faceNames,
      algorythmOptions,
      storageOptions,
      totalCombinations,
      params: {
        algorythm: "dijkstra" as Params["algorythm"],
        storage: "object" as Params["storage"],
        cube: getCube(),
      },
      stepsToSolve: [] as FaceName[],
      isSolving: false,
      shouldStopSolver: false,
      stats: {
        total: 0,
        discarded: 0,
        cube: getCube(),
        depth: 0,
        positionsPerSecond: 0,
        distance: 0,
        elapsedTime: 0,
      },
    };
  },

  computed: {
    currentDistanceToSolved(): number {
      return getDistanceToSolved(this.params.cube);
    },

    elapsedTimeParsed(): string {
      return parseTime(this.stats.elapsedTime);
    },

    elapsedTimeUntilSolvedParsed(): string {
      const seconds =
        (totalCombinations - this.stats.total) / this.stats.positionsPerSecond;

      const millis = seconds * 1000;

      return parseTime(millis);
    },
  },

  methods: {
    rotate(faceName: FaceName) {
      this.params.cube = getRotated(this.params.cube, faceName);
    },

    solve() {
      if (this.isSolving) {
        return;
      }

      (async () => {
        this.isSolving = true;

        this.shouldStopSolver = false;

        this.stepsToSolve = [];

        this.stepsToSolve = await getStepsToSolve({
          cube: this.params.cube,
          progressCallback: (stats) => {
            this.stats = { ...stats };

            return {
              shouldStop: this.shouldStopSolver,
            };
          },
          algorythm: this.params.algorythm,
          storage: this.params.storage,
        });

        this.isSolving = false;
      })();
    },

    stopSolving() {
      this.shouldStopSolver = true;
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
