<template>
  <Container>
    <div class="title-container">
      <h2>Files List</h2>
      <CoolButton text="Upload" />
    </div>
    <div class="files-container">
      <ul v-if="files.length > 0">
        <li v-for="file in props.files" :key="file.path">
          <a :href="file.path">Download</a>
        </li>
      </ul>
      <div v-else>
        <p>There are no files yet. Upload some!</p>
      </div>
    </div>
  </Container>
</template>
<script setup>
import Container from "./Container.vue";
import CoolButton from "./CoolButton.vue";

const props = defineProps({
  files: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>
<style scoped>
.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.files-container {
  margin-top: 1rem;
}
</style>