<template>
  <div class="section card-section projects">
    <div class="section-title">Personal Projects</div>
    <div class="content-overflow">
      <div class="content-container">
        <template v-for="project in projects" :key="'projects' + project.title">
          <div class="content-card">
            <img
              loading="lazy"
              class="content-picture"
              :src="
                require('@/assets/home/projects/' + project.picture.filename)
              "
              :style="'object-fit: ' + project.picture.objectFit"
            />
            <div class="content-top">{{ project.title }}</div>
            <div class="content-body">{{ project.body }}</div>
            <div class="content-bottom">
              <template v-if="project.demo">
                <a
                  :href="project.demo"
                  target="_blank"
                  tooltip="Go to Demo"
                  class="demo-link"
                >
                  Demo
                </a>
              </template>
              <div class="tech-stack">
                <span
                  v-for="tech in project.techStack"
                  :key="'tech' + project.title + tech.name"
                >
                  <span class="technology">
                    {{ tech.name }}
                  </span>
                  {{ tech.comma }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
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
@import "@/assets/scss/_card-section.scss";

.projects {
  background-color: $white-1;
}

.card-section {
  .content-card {
    grid-template-rows: 190px auto auto minmax(auto, 1fr);
  }

  .content-picture {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .content-bottom {
    display: grid;
    grid-template-columns: auto 1fr;
    align-self: end;
  }

  .demo-link {
    text-decoration: none;
    color: $font-weak-color;
    border-radius: 4px;
    padding: 4px 8px;
  }

  .content-card {
    &:hover {
      .demo-link {
        background-color: $white-2;
        color: black;
      }
    }
    .demo-link:hover {
      color: $white;
      background-color: $white-3;
    }
  }

  .tech-stack {
    grid-column: 2;
    text-align: right;
    color: $font-weak-color;
  }

  @media (max-width: 800px) {
    .demo-link {
      background-color: $white-2;
      color: black;
    }
  }
}
</style>
