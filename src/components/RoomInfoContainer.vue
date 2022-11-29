<template>
  <Container class="room-info-container">
    <div class="canvas-container">
      <canvas ref="qrcodeCanvas"></canvas>
    </div>
    <div class="room-info-text-container">
      <CoolInput :value="roomUrl" label="Room" />
      <CoolInput :value="`${roomUsersNumber} Users`" label="Users" />
      <CoolButton text="share" @click="handleShare" />
    </div>
  </Container>
</template>
<script setup>
import { ref, computed, watchEffect } from "vue";
import QRCode from "qrcode";

import Container from "./Container.vue";
import CoolInput from "./CoolInput.vue";
import CoolButton from "./CoolButton.vue";

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
}

#qrcode-canvas {
  max-width: 200px;
  max-height: 200px;
}

.room-info-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}
</style>