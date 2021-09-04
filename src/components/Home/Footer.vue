<template>
  <footer class="section content-section banner-section footer">
    <h2 class="section-title">Contact me!</h2>
    <nav class="banner-container">
      <template
        v-for="{ tooltip, link, icon } in contacts"
        :key="'footer' + tooltip"
      >
        <a
          class="banner"
          :title="tooltip"
          :href="link"
          target="_blank"
          rel="noopener"
        >
          <div class="banner-body">
            <img
              :src="require('@/assets/home/fa/' + icon + '.svg')"
              width="40"
              height="40"
              :alt="tooltip"
            />
          </div>
        </a>
      </template>
    </nav>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { contacts } from "../../utils/home/contacts";

export default defineComponent({
  data() {
    return {
      contacts,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_banner.scss";

.footer {
  background-color: $white-3;
}
</style>
