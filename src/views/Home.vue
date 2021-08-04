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
