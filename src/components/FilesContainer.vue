<template>
  <Container>
    <div class="title-container">
      <h2>Files List</h2>
      <CoolButton text="Upload" @click="handleUploadClick" />
    </div>
    <div class="files-container">
      <ul v-if="files.length > 0" class="files-container-list">
        <li v-for="file in files" :key="file.path">
          <FileContainer :file="file" />
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
import FileContainer from "./FileContainer.vue";

const props = defineProps({
  files: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["showUploadModal"]);

const handleUploadClick = () => {
  emit("showUploadModal");
};
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

.files-container-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>