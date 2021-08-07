<template>
  <main>
    <Header @upload="alert('a')" />
    <div class="flex">
      <Canvas />
      <Controls />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/projects/webgl/Header.vue";
import Canvas from "@/components/projects/webgl/Canvas.vue";
import Controls from "@/components/projects/webgl/Controls.vue";

export default defineComponent({
  components: {
    Header,
    Canvas,
    Controls,
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
