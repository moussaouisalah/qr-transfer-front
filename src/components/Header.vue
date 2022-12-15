<template>
  <header class="app-header">
    <div class="inner-container flex items-center justify-between">
      <h1>Qranfer</h1>
      <slot name="extra" />
    </div>
  </header>
</template>
<script setup>
import { NButton } from "naive-ui";
</script>
<style scoped>
.app-header {
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  padding: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.inner-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}
</style>