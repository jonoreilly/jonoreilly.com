<template>
  <div class="section" id="presentation">
    <div class="text-area">
      <div class="text-container">
        <p>Hi, I'm</p>
        <p class="text-big">Jon O'Reilly</p>
        <p>& I'm a</p>
        <p class="text-big">Full-stack <br class="break" />Engineer</p>
      </div>
    </div>
    <div class="scroll-call-to-action">
      <p>Check my portfolio</p>
      <img src="@/assets/Home/fa/long-arrow-alt-down.svg" width="8" />
    </div>
    <div class="contact-menu">
      <div class="contact-list">
        <template
          v-for="{ tooltip, link, icon } in contacts"
          :key="'hero' + tooltip"
        >
          <a class="contact-link" :title="tooltip" :href="link" target="_blank">
            <div class="contact-body">
              <img
                :src="require('@/assets/Home/fa/' + icon + '.svg')"
                width="35"
                height="35"
              />
            </div>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { contacts } from "@/utils/contacts";

export default defineComponent({
  data() {
    return {
      contacts,
    };
  },
});
</script>

<style lang="scss" scoped>
#presentation {
  height: $section-height;
  position: relative;
  background-color: $white;
}

@media (min-aspect-ratio: 1/1) {
  #presentation::before {
    background-image: url("../../assets/Home/fotos/modelo-panoramic.jpeg");
  }
}

@media (max-aspect-ratio: 1/1) {
  #presentation::before {
    background-image: url("../../assets/Home/fotos/modelo_low-res.jpeg");
  }
}

#presentation::before {
  content: "";
  background-repeat: no-repeat;
  background-position: left top;
  background-size: cover;
  opacity: 0.2;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
}

#presentation .text-area {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100%;
  width: 900px;
  margin-right: 0;
  margin-left: auto;
}

#presentation .text-container {
  min-height: 40%;
}

#presentation .text-container p {
  margin: 0;
}

#presentation .text-big {
  font-size: $font-size-huge;
  font-weight: bold;
}

#presentation .text-area .break {
  display: none;
}

#presentation .scroll-call-to-action {
  position: absolute;
  bottom: 5%;
  width: 100%;
  text-align: center;
  animation: 3s ease-in-out 0s infinite vertical-wiggle;
}

@keyframes vertical-wiggle {
  0% {
    transform: translateY(0%);
  }
  /* 0% - 0s */
  66% {
    transform: translateY(0%);
  }
  /* 20% - 0.2s */
  73% {
    transform: translateY(2.5vh);
  }
  /* 40% - 0.4s */
  80% {
    transform: translateY(-2.5vh);
  }
  /* 60% - 0.6s */
  86% {
    transform: translateY(0.75vh);
  }
  /* 75% - 0.75s */
  91% {
    transform: translateY(-0.25vh);
  }
  /* 100% - 1s */
  100% {
    transform: translateY(0%);
  }
}

#presentation .contact-menu {
  position: absolute;
  height: $section-height;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
}

#presentation .contact-list {
  display: flex;
  flex-direction: column;
  padding: 1px;
  text-align: center;
}

#presentation .contact-link {
  margin: 5px;
}

#presentation .contact-body {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 2px solid transparent;
  display: grid;
  align-items: center;
  justify-items: center;
}

#presentation .contact-body:hover {
  background-color: $white;
  border-color: $white-2;
}

@media (max-width: 1300px) and (min-width: 800px) {
  #presentation .text-area {
    width: 700px;
    max-width: calc(100% - 80px);
  }
}

@media (max-width: 800px) {
  #presentation .text-area {
    width: 100%;
    white-space: normal;
  }
  #presentation .text-area .break {
    display: inherit;
  }
  #presentation .text-big {
    font-size: $font-size-less-huge;
  }
  #presentation .contact-menu {
    display: none;
  }
}
</style>
