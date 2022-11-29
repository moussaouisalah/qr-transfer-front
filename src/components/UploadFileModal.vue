<template>
  <div class="modal-container">
    <div class="title-container">
      <h2>Upload a file</h2>
    </div>
    <div class="upload-progress-container">
      <p v-if="progress">progress: {{ progress }}%</p>
    </div>
    <VueFileDrop @accept="handleFileSelection" class="dropzone" />
    <div v-if="file" class="uploaded-file">
      <div class="file-name">{{ file.name }}</div>
      <div class="file-size">{{ file.size }} bytes</div>
    </div>
    <CoolButton text="Upload" @click="handleUpload" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import { VueFileDrop } from "vue-file-drop";

import CoolButton from "./CoolButton.vue";

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    required: true,
    default: () => ({ file: "" }),
  },
});

const emit = defineEmits(["upload"]);

const file = ref(null);

const handleFileSelection = (files) => {
  file.value = files[0];
};

const handleFilesDrop = (files) => {
  console.log(files);
};

const handleUpload = () => {
  if (!file.value) return;
  emit("upload", file.value);
};
</script>
<style scoped>
.modal-container {
  width: min(95%, 800px);
  background-color: #fff;
  border: 3px solid #000;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dropzone {
  width: 100%;
}

.uploaded-file {
  width: min(100%, 500px);
  height: 50px;
  border: 1px solid #ccc;
  padding: 0.5rem;
}

.file-name {
  font-weight: bold;
  font-size: 1.1rem;
}
</style>