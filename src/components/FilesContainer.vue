<template>
  <Container>
    <ul>
      <li v-for="file in props.files" :key="file.path">
        <a :href="file.path">Download</a>
      </li>
    </ul>
  </Container>
</template>
<script setup>
import Container from "./Container.vue";

const props = defineProps({
  files: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

