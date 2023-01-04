<template>
  <NCard title="Upload a file" class="modal-container">
    <div class="flex flex-col items-center">
      <div class="upload-progress-container">
        <p v-if="progress">progress: {{ progress }}%</p>
      </div>
      <NUpload multiple directory-dnd @change="handleFilesChange">
        <NUploadDragger>
          <div>
            <NIcon size="48" :depth="3">
              <ArchiveOutline />
            </NIcon>
          </div>
          <NText style="font-size: 16px; margin-top: 12px">
            Click or drag a file to this area to upload
          </NText>
          <NP depth="3" style="margin: 8px 0 0 0">
            Strictly prohibit from uploading sensitive information. For example,
            your bank card PIN or your credit card expiry date.
          </NP>
        </NUploadDragger>
      </NUpload>
      <NButton
        type="primary"
        @click="handleUpload"
        :disabled="!files || files.length === 0"
        >Upload</NButton
      >
    </div>
  </NCard>
</template>
<script setup>
import { ref } from "vue";
import {
  NButton,
  NCard,
  NUpload,
  NUploadDragger,
  NP,
  NText,
  NIcon,
} from "naive-ui";
import { ArchiveOutline } from "@vicons/ionicons5";

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

const files = ref(null);

const handleFilesChange = ({ fileList }) => {
  console.log("files", fileList);
  if (!fileList.length) return;
  files.value = fileList;
};

const handleUpload = () => {
  console.log("upload", files);
  if (!files.value?.length) return;
  emit("upload", files.value);
};
</script>
<style scoped>
.modal-container {
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