<template>
  <div class="file-container">
    <div class="file-info-container">
      <p class="file-name">{{ file.name }}</p>
      <p class="file-uploader">uploaded by {{ file.uploader }}</p>
    </div>
    <a :href="filePath" target="_blank" class="download-button">Download</a>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { getServerUrl } from "../utils";

const props = defineProps({
  file: {
    type: Object,
    required: true,
    default: () => ({ name: "", uploader: "", path: "" }),
  },
});

console.log("test", props.file);

const filePath = computed(() => `${getServerUrl()}/${props.file.path}`);
</script>
<style scoped>
.file-container {
  border: 1px solid #ccc;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-info-container {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.file-uploader {
  font-size: 0.9rem;
}
</style>