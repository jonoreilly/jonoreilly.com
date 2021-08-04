<template>
  <router-view />
</template>

<style lang="scss">
html,
body {
  margin: 0;
  overflow: hidden;
  background-color: $white;
  color: $font-color;
}

.application {
  overflow-y: scroll;
  max-height: $app-height;
  font-family: $font-family;
  scroll-behavior: smooth;
}

.section {
  min-height: $section-height;
  width: 100%;
}
</style>
