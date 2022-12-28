<template>
  <NCard title="Files List">
    <template #header-extra>
      <NButton secondary type="primary" @click="handleUploadClick"
        >Upload</NButton
      >
    </template>
    <div class="files-container">
      <NList v-if="files.length > 0" hoverable clickable>
        <NListItem
          v-for="file in files"
          :key="file.path"
          @click="handleDownload(file.path)"
        >
          <NThing :title="file.name">
            <template #description>
              <NTag size="small" type="info">{{ file.uploader }}</NTag>
            </template>
          </NThing>
        </NListItem>
      </NList>
      <NEmpty v-else description="No files uploaded yet">
        <template #extra>
          <NButton @click="handleUploadClick">Upload a file</NButton>
        </template>
      </NEmpty>
    </div>
  </NCard>
</template>
<script setup>
import { getServerUrl } from "../utils";

import {
  NButton,
  NCard,
  NEmpty,
  NList,
  NListItem,
  NTag,
  NThing,
} from "naive-ui";
import useRoom from "../composables/useRoom";

const { files } = useRoom();

const emit = defineEmits(["showUploadModal"]);

const handleUploadClick = () => {
  emit("showUploadModal");
};

const handleDownload = (path) => {
  window.open(`${getServerUrl()}/${path}`, "_blank");
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