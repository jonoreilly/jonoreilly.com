<template>
  <div class="section banner-section" id="contact">
    <div class="section-title">Contact me!</div>
    <div class="link-container">
      <template
        v-for="{ tooltip, link, icon } in contacts"
        :key="'footer' + tooltip"
      >
        <a class="contact-link" :title="tooltip" :href="link" target="_blank">
          <div class="contact-body">
            <img
              :src="require('@/assets/home/fa/' + icon + '.svg')"
              width="40"
              height="40"
            />
          </div>
        </a>
      </template>
    </div>
  </div>
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
.banner-section {
  min-height: $banner-height;
  background-color: $white-3;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.banner-section .section-title {
  padding: 50px;
  font-size: $font-size-title;
  text-align: center;
}

.banner-section .link-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 2000px;
}

#contact .contact-link {
  margin: 10px;
}

#contact .contact-body {
  width: 65px;
  height: 65px;
  border-radius: 10px;
  display: grid;
  justify-items: center;
  align-items: center;
}

#contact .contact-body:hover {
  background-color: $white-2;
}

@media (max-width: $breakpoint-sm) {
  #contact .contact-body {
    background-color: $white-2;
  }
}
</style>
