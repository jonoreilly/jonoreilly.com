<template>
  <section class="section content-section reviews" aria-label="Reviews">
    <h2 class="section-title">Reviews</h2>
    <div class="cards-container-overflow">
      <div class="cards-container">
        <template
          v-for="{ stars, title, body, signature } in reviews"
          :key="'review' + title + signature"
        >
          <div class="card">
            <div class="card-top">
              <h3 class="review-title">
                <span class="aria-only">Title: </span>
                {{ title }}
              </h3>
              <Stars :rating="stars" />
            </div>
            <p class="card-body">{{ body }}</p>
            <div class="card-bottom">
              <a :href="signature.contact" class="signature" rel="noopener">
                <span class="aria-only">Written by</span>
                {{ signature.name }}
                <span class="aria-only">. Link to his Linkedin profile</span>
              </a>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
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

          @media (max-width: $breakpoint-sm) {
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

            @media (max-width: $breakpoint-sm) {
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
