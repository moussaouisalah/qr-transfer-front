<template>
  <Container>
    <div>
      <p>roomId: {{ roomId }}</p>
      <p>username: {{ username }}</p>
    </div>
    <div class="canvas-container">
      <canvas id="qrcode-canvas"></canvas>
    </div>
  </Container>
</template>
<script setup>
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

// generate qrcode and show it in cavas
const canvas = document.getElementById("qrcode-canvas");
const url = `${window.location.origin}/${props.roomId}`;
QRCode.toCanvas(canvas, url, function (error) {
  if (error) console.error(error);
  console.log("success!");
});
</script>
<style scoped>
#qrcode-canvas {
  max-width: 60px;
  max-height: 60px;
}
</style>