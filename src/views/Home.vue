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
import jsonLd from "@/assets/home/jsonLd/jon-oreilly.json";

export default defineComponent({
  components: {
    Hero,
    Skills,
    Projects,
    Reviews,
    Footer,
  },
  mounted() {
    let scriptTag = document.querySelector(
      'head script[type="application/ld+json"]'
    );

    if (!scriptTag) {
      scriptTag = document.createElement("script");

      scriptTag.setAttribute("type", "application/ld+json");

      document.head.appendChild(scriptTag);
    }

    scriptTag.innerHTML = JSON.stringify(jsonLd);
  },
  unmounted() {
    const scriptTag = document.querySelector(
      'head script[type="application/ld+json"]'
    );

    if (scriptTag) {
      document.head.removeChild(scriptTag);
    }
  },
});
</script>

<style lang="scss" scoped>
.application {
  font-family: $font-family;
  scroll-behavior: smooth;
}
</style>
