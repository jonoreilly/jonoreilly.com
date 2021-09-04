<template>
  <section class="section content-section skills" aria-label="Skills">
    <div class="section-title">Skills</div>
    <div class="bars-container">
      <template v-for="skill in skills" :key="'skills' + skill.name">
        <div class="bar-container">
          <div class="bar-label">
            <div class="bar-label-name">
              {{ skill.name }}
            </div>
            <div class="bar-label-experience">
              {{ skill.experience }}
            </div>
          </div>
          <div class="bar">
            <div class="bar-filling" :style="`width: ${skill.level}%;`"></div>
          </div>
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
  { name: "Vue.js", experience: "+2 years", level: 100 },
  { name: "SCSS", experience: "1,5 years", level: 85 },
  { name: "Typescript", experience: "1 year", level: 90 },
  { name: "ARIA - Accessibility", experience: "2 years", level: 95 },
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
@import "@/assets/scss/_content-section.scss";
@import "@/assets/scss/_bar.scss";

.skills {
  background-color: $white;
}
</style>
