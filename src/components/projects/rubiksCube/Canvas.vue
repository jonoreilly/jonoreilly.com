<template>
  <div @keydown="onKeyDown($event)" @keyup="onKeyUp($event)" tabindex="1" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { destroy, setup, state } from "@/utils/projects/rubiksCube/core";

const speed = 0.005;

let lastUpdateTime = 0;

const pressedKeys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

export default defineComponent({
  mounted() {
    setup(this.$el, this.onFrame);
  },

  beforeUnmount() {
    destroy();
  },

  methods: {
    onFrame() {
      if (state.cube) {
        state.cube.rotation.x += 0.01;
        state.cube.rotation.y += 0.01;

        this.updateCubePosition();
      }
    },

    onKeyDown($event: KeyboardEvent) {
      this.onKey($event.key, true);
    },

    onKeyUp($event: KeyboardEvent) {
      this.onKey($event.key, false);
    },

    onKey(key: string, isPressed: boolean) {
      switch (key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight": {
          this.updateCubePosition();

          pressedKeys[key] = isPressed;

          break;
        }
      }
    },

    updateCubePosition() {
      const cube = state.cube;

      if (cube) {
        const now = performance.now();

        const timeSinceLastUpdate = now - lastUpdateTime;

        lastUpdateTime = now;

        const movement = {
          y:
            pressedKeys.ArrowUp !== pressedKeys.ArrowDown
              ? pressedKeys.ArrowUp
                ? 1
                : -1
              : 0,
          x:
            pressedKeys.ArrowLeft !== pressedKeys.ArrowRight
              ? pressedKeys.ArrowRight
                ? 1
                : -1
              : 0,
        };

        for (const axis of ["x", "y"] as const) {
          cube.position[axis] += movement[axis] * timeSinceLastUpdate * speed;
        }
      }
    },
  },
});
</script>
