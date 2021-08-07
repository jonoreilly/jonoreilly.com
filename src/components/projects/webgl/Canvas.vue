<template>
  <div>
    <canvas id="webgl-canvas" :width="width" :height="height">
      Your browser does not support HTML5 canvas
    </canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      width: 800,
      height: 500,
    };
  },
});
</script>

<style lang="scss" scoped>
#webgl-canvas {
  border: solid 1px grey;
}
</style>
