<template>
  <figure class="review-stars" :aria-label="'Rating: ' + rating + ' stars'">
    <img
      v-for="i in stars"
      :key="i"
      src="@/assets/home/fa/star.svg"
      alt=""
      aria-hidden="true"
    />
    <img
      v-if="hasHalfStar"
      src="@/assets/home/fa/star-half.svg"
      alt=""
      aria-hidden="true"
    />
  </figure>
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
