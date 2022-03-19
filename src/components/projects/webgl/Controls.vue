<template>
  <aside class="column">
    <div class="block">
      <h2 class="pb">Choose a file: {{ file }}</h2>
      <ul class="pb">
        <li>
          <label>
            <input type="radio" name="file" value="cube.obj" v-model="file" />
            Cube
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name="file"
              value="lightedCube.obj"
              v-model="file"
            />
            Lighted cube
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name="file"
              value="pyramid.obj"
              v-model="file"
            />
            Pyramid
          </label>
        </li>
        <li>
          <label>
            <input type="radio" name="file" value="teapot.obj" v-model="file" />
            Teapot
          </label>
        </li>
      </ul>
      <div>
        <label>
          Or upload your own: <br />
          <input type="file" id="obj-file" @change="$emit('upload', $event)" />
        </label>
      </div>
    </div>
    <div class="block">
      <div>
        <h2 class="pb">Controls:</h2>
        <ul>
          <li class="pb">Arrow keys to move</li>
          <li class="pb">
            To rotate:
            <ul>
              <li>W/S for Y axis</li>
              <li>A/D for X axis</li>
              <li>Q/E for Z axis</li>
            </ul>
          </li>
          <li>I/O to scale</li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, required: true },
  },
  computed: {
    file: {
      get(): string {
        return this.modelValue;
      },
      set(value: string) {
        this.$emit("update:modelValue", value);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.column {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
}

.pb {
  padding-bottom: 10px;
}
</style>
