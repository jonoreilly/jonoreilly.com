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
            :face="layout[faceName][row][column].faceName"
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

export default defineComponent({
  data() {
    return {
      layout: getCube(),
      faceNames,
    };
  },

  methods: {
    rotate(face: FaceName) {
      this.layout = getRotated(this.layout, face);
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
