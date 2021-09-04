<template>
  <section class="section hero" aria-label="Introduction">
    <div class="text-area">
      <h1 class="text-container">
        Hi, I'm<br />
        <span class="text-big">Jon O'Reilly</span><br />
        & I'm a<br />
        <span class="text-big">Front-End <br class="break" />Engineer</span>
      </h1>
    </div>
    <div class="scroll-call-to-action">
      <p>Check my portfolio</p>
      <img
        src="@/assets/home/fa/long-arrow-alt-down.svg"
        width="8"
        alt="arrow-down"
      />
    </div>
    <nav class="contact-menu">
      <ul class="contact-list">
        <template
          v-for="{ tooltip, link, icon } in contacts"
          :key="'hero' + tooltip"
        >
          <li>
            <a
              class="contact-link"
              :title="tooltip"
              :href="link"
              target="_blank"
              rel="noopener"
            >
              <div class="contact-body">
                <img
                  :src="require('@/assets/home/fa/' + icon + '.svg')"
                  width="35"
                  height="35"
                  :alt="tooltip"
                />
              </div>
            </a>
          </li>
        </template>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { contacts } from "@/utils/home/contacts";

export default defineComponent({
  data() {
    return {
      contacts,
    };
  },
});
</script>

<style lang="scss" scoped>
.hero {
  height: $section-height;
  position: relative;
  background-color: $white;

  &::before {
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

    @media (min-aspect-ratio: 1/1) {
      background-image: url("../../assets/home/fotos/modelo-panoramic.jpeg");
    }

    @media (max-aspect-ratio: 1/1) {
      background-image: url("../../assets/home/fotos/modelo_low-res.jpeg");
    }
  }

  .text-area {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 100%;
    width: 900px;
    margin-right: 0;
    margin-left: auto;

    @media (max-width: $breakpoint-md) and (min-width: $breakpoint-sm) {
      width: 700px;
      max-width: calc(100% - 80px);
    }

    @media (max-width: $breakpoint-sm) {
      width: 100%;
      white-space: normal;
    }

    .text-container {
      min-height: 40%;

      .text-big {
        font-size: $font-size-huge;
        font-weight: bold;

        @media (max-width: $breakpoint-sm) {
          font-size: $font-size-less-huge;
        }
      }
    }

    .break {
      display: none;

      @media (max-width: $breakpoint-sm) {
        display: inherit;
      }
    }
  }

  .scroll-call-to-action {
    position: absolute;
    bottom: 5%;
    width: 100%;
    text-align: center;
    animation: 3s ease-in-out 0s infinite vertical-wiggle;

    p {
      margin-block-start: 1em;
      margin-block-end: 1em;
    }
  }

  .contact-menu {
    position: absolute;
    height: $section-height;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;

    @media (max-width: $breakpoint-sm) {
      display: none;
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      padding: 1px;
      text-align: center;

      li {
        display: contents;

        .contact-link {
          margin: 5px;

          .contact-body {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            border: 2px solid transparent;
            display: grid;
            align-items: center;
            justify-items: center;

            &:hover {
              background-color: $white;
              border-color: $white-2;
            }
          }
        }
      }
    }
  }
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
</style>
