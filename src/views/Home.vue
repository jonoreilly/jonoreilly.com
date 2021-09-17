<template>
  <div class="application">
    <main>
      <Hero />
      <Skills />
      <Projects />
      <Reviews />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Hero from "@/components/home/Hero.vue";
import Skills from "@/components/home/Skills.vue";
import Projects from "@/components/home/Projects.vue";
import Reviews from "@/components/home/Reviews.vue";
import Footer from "@/components/home/Footer.vue";

export default defineComponent({
  components: {
    Hero,
    Skills,
    Projects,
    Reviews,
    Footer,
  },
});
</script>

<style lang="scss" scoped>
.application {
  font-family: $font-family;
  scroll-behavior: smooth;
}
</style>
