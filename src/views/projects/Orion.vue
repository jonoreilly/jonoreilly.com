<template>
  <Title :title="title" />
  <P5js :src="src" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Title from "@/components/projects/Title.vue";
import P5js from "@/components/projects/P5js.vue";

export default defineComponent({
  components: {
    Title,
    P5js,
  },
  data() {
    return {
      title: "Orion",
      src: "https://preview.p5js.org/jonoreilly/embed/d2OGrtoVm",
    };
  },
});
</script>
