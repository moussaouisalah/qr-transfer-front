<template>
  <Container>
    <div>
      <p>roomId: {{ roomId }}</p>
      <p>username: {{ username }}</p>
    </div>
    <div class="canvas-container">
      <canvas ref="qrcodeCanvas"></canvas>
    </div>
  </Container>
</template>
<script setup>
import { ref, watchEffect } from 'vue'
import QRCode from "qrcode";

import Container from "./Container.vue";

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const qrcodeCanvas = ref(null)

watchEffect(() => {
  if(!qrcodeCanvas.value || !props.roomId) return;
  const url = `${window.location.origin}/${props.roomId}`;
  QRCode.toCanvas(qrcodeCanvas.value, url, (error) => {
    if (error) console.error(error);
  });
});
</script>
<style scoped>
#qrcode-canvas {
  max-width: 200px;
  max-height: 200px;
}
</style>