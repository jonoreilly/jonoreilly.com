<template>
  <div class="section card-section" id="personal-projects">
    <div class="section-title">Personal Projects</div>
    <div class="content-overflow">
      <div class="content-container">
        <template v-for="project in projects" :key="'projects' + project.title">
          <div class="content-card">
            <img
              loading="lazy"
              class="content-picture"
              :src="
                require('@/assets/Home/projects/' + project.picture.filename)
              "
              :style="'object-fit: ' + project.picture.objectFit"
            />
            <div class="content-top">{{ project.title }}</div>
            <div class="content-body">{{ project.body }}</div>
            <div class="content-bottom">
              <template v-if="project.demo">
                <a :href="project.demo" target="_blank" tooltip="Go to Demo">
                  <span class="demo-link">Demo</span>
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
import { projects } from "@/utils/projects";

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

#personal-projects {
  background-color: $white-1;
}

#personal-projects a {
  text-decoration: none;
}

#personal-projects .content-card {
  grid-template-rows: 190px auto auto minmax(auto, 1fr);
}

#personal-projects .content-picture {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

#personal-projects .content-bottom {
  display: grid;
  grid-template-columns: auto 1fr;
  align-self: end;
}

#personal-projects .demo-link {
  color: $font-weak-color;
  border-radius: 4px;
  padding: 4px 8px;
}

#personal-projects .content-card:hover .demo-link {
  background-color: $white-2;
  color: black;
}

#personal-projects .content-card:hover .demo-link:hover {
  color: $white;
  background-color: $white-3;
}

#personal-projects .tech-stack {
  grid-column: 2;
  text-align: right;
  color: $font-weak-color;
}

@media (max-width: 800px) {
  #personal-projects .demo-link {
    background-color: $white-2;
    color: black;
  }
}
</style>
