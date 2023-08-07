<template>
  <Title :title="title" />
  <!-- <P5js :src="src" /> -->
  <Board />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Title from "@/components/projects/Title.vue";
// import P5js from "@/components/projects/P5js.vue";
import Board from "@/components/projects/sudoku/Board.vue";

export default defineComponent({
  components: {
    Title,
    Board,
  },
  data() {
    return {
      title: "Sudoku Solver",
      src: "https://preview.p5js.org/jonoreilly/embed/iLJUPN0dF",
    };
  },
});
</script>
