<template>
  <div class="section content-section reviews">
    <div class="section-title">Reviews</div>
    <div class="cards-container-overflow">
      <div class="cards-container">
        <template
          v-for="{ stars, title, body, signature } in reviews"
          :key="'review' + title + signature"
        >
          <div class="card">
            <div class="card-top">
              <div class="review-title">
                {{ title }}
              </div>
              <Stars :rating="stars" />
            </div>
            <div class="card-body">{{ body }}</div>
            <div class="card-bottom">
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
@import "@/assets/scss/_content-section.scss";
@import "@/assets/scss/_card.scss";

.reviews {
  background-color: $white;

  .cards-container-overflow {
    .cards-container {
      .card {
        border: 2px solid $white-2;
        flex: 0 0 600px;

        .card-top {
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

        .card-bottom {
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
          .card-bottom {
            .signature {
              color: black;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
