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
import Hero from "@/components/home/Hero.vue";
import Projects from "@/components/home/Projects.vue";
import Reviews from "@/components/home/Reviews.vue";
import Footer from "@/components/home/Footer.vue";

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
