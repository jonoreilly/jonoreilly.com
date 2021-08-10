<template>
  <header class="header">
    <router-link to="/" class="back-link">
      <img
        :src="require('@/assets/projects/fa/arrow-left-solid.svg')"
        width="30"
        height="30"
      />
    </router-link>
    <h2>{{ title }}</h2>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, default: "" },
  },
});
</script>

<style lang="scss" scoped>
$image-size: 30px;
$image-padding: 10px;

.header {
  text-align: center;
  height: $image-size + ($image-padding * 4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-link {
  position: absolute;
  left: $image-padding;
  top: $image-padding;
  padding: $image-padding;
  border-radius: $image-padding;
  display: flex;

  &:hover {
    background-color: $white-3;
  }
}
</style>
