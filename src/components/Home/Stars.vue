<template>
  <div class="review-stars">
    <img
      v-for="i in stars"
      :key="i"
      src="@/assets/Home/fa/star.svg"
      width="22"
    />
    <img v-if="hasHalfStar" src="@/assets/Home/fa/star-half.svg" width="22" />
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
