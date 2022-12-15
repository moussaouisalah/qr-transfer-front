<template>
  <NCard title="Room info" class="room-info-container">
    <div class="canvas-container">
      <canvas ref="qrcodeCanvas"></canvas>
    </div>
    <div class="room-info-text-container">
      <NInput :value="`${roomUsersNumber} Users`" label="Users" isReadOnly />
      <NInput :value="roomUrl" label="Room" isReadOnly />
      <NButton secondary type="primary" @click="handleShare">Copy Link</NButton>
    </div>
  </NCard>
</template>
<script setup>
import { ref, computed, watchEffect } from "vue";
import QRCode from "qrcode";
import { NButton, NCard, NInput } from "naive-ui";

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  roomUsersNumber: {
    type: Number,
    required: true,
    default: 0,
  },
});

const emit = defineEmits(["share"]);

const qrcodeCanvas = ref(null);

const roomUrl = computed(() => {
  return `${window.location.origin}/${props.roomId}`;
});

watchEffect(() => {
  if (!qrcodeCanvas.value || !props.roomId) return;
  const url = `${window.location.origin}/${props.roomId}`;
  QRCode.toCanvas(qrcodeCanvas.value, url, (error) => {
    if (error) console.error(error);
  });
});

const handleShare = () => {
  navigator.clipboard.writeText(roomUrl.value);
  emit("share");
};
</script>
<style scoped>
.room-info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.canvas-container {
  width: max-content;
  margin: 0 auto;
}

#qrcode-canvas {
  max-width: 200px;
  max-height: 200px;
}

.room-info-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
</style>