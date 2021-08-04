<template>
  <div class="section card-section" id="reviews">
    <div class="section-title">Reviews</div>
    <div class="content-overflow">
      <div class="content-container">
        <template
          v-for="{ stars, title, body, signature } in reviews"
          :key="'review' + title + signature"
        >
          <div class="content-card">
            <div class="content-top">
              <div class="review-title">
                {{ title }}
              </div>
              <Stars :rating="stars" />
            </div>
            <div class="content-body">{{ body }}</div>
            <div class="content-bottom">{{ signature }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Stars from "./Stars.vue";
import { reviews } from "@/utils/reviews";

export default defineComponent({
  components: {
    Stars,
  },
  data() {
    return {
      reviews,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_card-section.scss";

#reviews {
  background-color: $white;
}

#reviews .content-card {
  border: 2px solid $white-2;
  flex: 0 0 600px;
}

#reviews .content-top {
  display: grid;
  grid-template-columns: 1fr auto;
}

#reviews .review-title {
  padding-bottom: 10px;
}

#reviews .review-stars {
  filter: invert(1) sepia(1) saturate(255) hue-rotate(-31deg);
}

#reviews .content-bottom {
  align-self: end;
  text-align: right;
  color: $font-weak-color;
}

@media (max-width: 800px) {
  #reviews .content-top {
    grid-template-columns: unset;
    grid-template-rows: 1fr auto;
  }
}
</style>
