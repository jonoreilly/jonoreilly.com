<template>
  <h2>{{ title }}</h2>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, default: "" },
  },
});
</script>
