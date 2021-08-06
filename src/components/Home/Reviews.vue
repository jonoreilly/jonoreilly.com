<template>
  <div class="section card-section reviews">
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
            <div class="content-bottom">
              <a :href="signature.contact" class="signature">
                {{ signature.name }}
              </a>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Stars from "./Stars.vue";
import { reviews } from "@/utils/home/reviews";

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

.reviews {
  background-color: $white;
}

.card-section {
  .content-card {
    border: 2px solid $white-2;
    flex: 0 0 600px;

    .content-top {
      display: grid;
      grid-template-columns: 1fr auto;

      @media (max-width: 800px) {
        grid-template-columns: unset;
        grid-template-rows: 1fr auto;
      }

      .review-title {
        padding-bottom: 10px;
      }
    }

    .content-bottom {
      align-self: end;
      text-align: right;

      .signature {
        color: $font-weak-color;
        text-decoration: none;

        @media (max-width: 800px) {
          color: black;
          text-decoration: underline;
        }
      }
    }

    &:hover {
      .content-bottom {
        .signature {
          color: black;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
