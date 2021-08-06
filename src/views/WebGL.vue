<template>
  <main>
    <Header @upload="alert('a')" />
    <Canvas />
    <Footer />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/webGL/Header.vue";
import Canvas from "@/components/webGL/Canvas.vue";
import Footer from "@/components/webGL/Footer.vue";

export default defineComponent({
  components: {
    Header,
    Canvas,
    Footer,
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
</style>
