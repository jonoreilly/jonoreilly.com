<template>
  <iframe :src="src" class="canvas" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    src: { type: String, default: "" },
  },
});
</script>

<style lang="scss" scoped>
.canvas {
  $margin: 10px;
  width: calc(100% - (10px * 2));
  margin: $margin;
  height: 85vh;
  border: none;
}
</style>
