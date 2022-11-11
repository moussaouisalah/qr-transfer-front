<template>
  <div>
    <input type="file" @change="handleFileSelection" />
    <button @click="handleUpload">Upload</button>
  </div>
</template>
<script setup>
import { ref } from "vue";
const emit = defineEmits(["upload"]);

const file = ref(null);

const handleFileSelection = (e) => {
  file.value = e.target.files[0];
};

const handleUpload = () => {
  if (!file.value) return;
  emit("upload", file.value);
};
</script>