<template>
  <section class="section content-section skills" aria-label="Skills">
    <h2 class="section-title">Skills</h2>
    <div class="bars-container">
      <template
        v-for="{ name, experience, level } in skills"
        :key="'skills' + name"
      >
        <div class="bar-container">
          <div class="bar-label">
            <h3 class="bar-label-name">
              {{ name }}
            </h3>
            <div role="note" class="bar-label-experience">
              <span class="aria-only">Experience:</span>
              {{ experience }}
            </div>
          </div>
          <figure class="bar" :aria-label="'Skill level: ' + level + '/100'">
            <div class="bar-filling" :style="`width: ${level}%;`"></div>
          </figure>
        </div>
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

type Skill = {
  name: string;
  experience: string;
  level: number;
};

const skills: Skill[] = [
  { name: "Vue.js", experience: "4 years", level: 100 },
  { name: "SCSS", experience: "3 years", level: 90 },
  { name: "Typescript", experience: "2 year", level: 95 },
  { name: "Unit testing", experience: "3 year", level: 90 },
  { name: "Basketball (for scale)", experience: "+20 years", level: 20 },
];

export default defineComponent({
  data() {
    return {
      skills,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_bar.scss";

.skills {
  background-color: $white;
}
</style>
