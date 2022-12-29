<template>
  <Title :title="title" />

  <Canvas class="container" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Title from "@/components/projects/Title.vue";
import Canvas from "@/components/projects/rubiksCube/Canvas.vue";

export default defineComponent({
  components: {
    Title,
    Canvas,
  },
  data() {
    return {
      title: "Rubiks Cube Solver",
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 80vh;
}
</style>
