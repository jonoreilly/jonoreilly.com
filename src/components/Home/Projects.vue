<template>
  <section
    class="section content-section projects"
    aria-label="Personal projects"
  >
    <h2 class="section-title">Personal Projects</h2>
    <div class="cards-container-overflow">
      <div class="cards-container">
        <template v-for="project in projects" :key="'projects' + project.title">
          <div class="card">
            <img
              loading="lazy"
              class="content-picture"
              :src="
                require('@/assets/home/projects/' + project.picture.filename)
              "
              :style="'object-fit: ' + project.picture.objectFit"
              alt=""
            />
            <h3 class="card-top">{{ project.title }}</h3>
            <p class="card-body">{{ project.body }}</p>
            <div class="card-bottom">
              <template v-if="project.demo">
                <router-link
                  :to="project.demo"
                  tooltip="Go to Demo"
                  class="demo-link"
                >
                  Demo
                </router-link>
              </template>
              <p class="tech-stack">
                <span class="aria-only">Technologies used:</span>
                <span
                  v-for="tech in project.techStack"
                  :key="'tech' + project.title + tech.name"
                >
                  <span class="technology">
                    {{ tech.name }}
                  </span>
                  {{ tech.comma }}
                </span>
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { projects } from "@/utils/home/projects";

export default defineComponent({
  data() {
    return {
      projects,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_card.scss";

.projects {
  background-color: $white-1;

  .cards-container-overflow {
    .cards-container {
      .card {
        grid-template-rows: 190px auto auto minmax(auto, 1fr);

        .content-picture {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .card-bottom {
          display: grid;
          grid-template-columns: auto 1fr;
          align-self: end;

          .demo-link {
            text-decoration: none;
            color: $font-weak-color;
            border-radius: 4px;
            padding: 4px 8px;

            &:hover {
              color: $white;
              background-color: $white-3;
            }

            @media (max-width: $breakpoint-sm) {
              background-color: $white-2;
              color: black;
            }
          }

          .tech-stack {
            grid-column: 2;
            text-align: right;
            color: $font-weak-color;
          }
        }

        &:hover {
          .demo-link {
            background-color: $white-2;
            color: black;
          }
        }
      }
    }
  }
}
</style>
