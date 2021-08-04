<template>
  <div class="review-stars">
    <img v-for="i in stars" :key="i" src="@/assets/Home/fa/star.svg" />
    <img v-if="hasHalfStar" src="@/assets/Home/fa/star-half.svg" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    rating: { type: Number, default: 5 },
  },
  computed: {
    stars(): number {
      return Math.floor(this.rating);
    },
    hasHalfStar(): boolean {
      return this.rating - this.stars > 0;
    },
  },
});
</script>

<style lang="scss" scoped>
$star-width: 22px;
.review-stars {
  filter: invert(1) sepia(1) saturate(255) hue-rotate(-31deg);
  width: $star-width * 5;
}

.review-stars > img {
  width: $star-width;
}
</style>
