<template>
  <main>
    <Header />
    <div class="flex">
      <Canvas />
      <Controls v-model="file" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/projects/webgl/Header.vue";
import Canvas from "@/components/projects/webgl/Canvas.vue";
import Controls from "@/components/projects/webgl/Controls.vue";
import { init, loadCharacter } from "@/utils/projects/webgl/webgl";

export default defineComponent({
  components: {
    Header,
    Canvas,
    Controls,
  },
  data() {
    return {
      file_: "teapot.obj",
    };
  },
  mounted() {
    init();
    this.loadCharacter();
  },
  computed: {
    file: {
      get(): string {
        return this.file_;
      },
      set(file: string) {
        this.file_ = file;
        this.loadCharacter();
      },
    },
  },
  methods: {
    loadCharacter() {
      loadCharacter(this.file);
    },
  },
});
</script>

<style lang="scss">
header,
footer {
  padding: 0.5rem 2rem;
}

main {
  border: 3px solid #e5e5e5;
  text-align: center;
  min-height: 97vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 2rem;
}

.flex {
  display: flex;
}
</style>
