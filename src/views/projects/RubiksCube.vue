<template>
  <Title :title="title" />

  <!-- <Canvas class="container" /> -->
  <Map />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Title from "@/components/projects/Title.vue";
// import Canvas from "@/components/projects/rubiksCube/Canvas.vue";
import Map from "@/components/projects/rubiksCube/Map.vue";

export default defineComponent({
  components: {
    Title,
    // Canvas,
    Map,
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
