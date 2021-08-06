<template>
  <div class="application">
    <Hero />
    <Projects />
    <Reviews />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Hero from "@/components/Home/Hero.vue";
import Projects from "@/components/Home/Projects.vue";
import Reviews from "@/components/Home/Reviews.vue";
import Footer from "@/components/Home/Footer.vue";

export default defineComponent({
  components: {
    Hero,
    Projects,
    Reviews,
    Footer,
  },
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  overflow: hidden;
  background-color: $white;
  color: $font-color;
}

.application {
  overflow-y: scroll;
  max-height: $app-height;
  font-family: $font-family;
  scroll-behavior: smooth;
}

.section {
  min-height: $section-height;
  width: 100%;
}
</style>
