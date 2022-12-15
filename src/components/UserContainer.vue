<template>
  <div class="user-container">
    <p>{{ username }}</p>
    <NTag v-if="isCurrentUser" type="info">You</NTag>
  </div>
</template>
<script setup>
import { NTag } from "naive-ui";

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  isCurrentUser: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped>
.user-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ccc;
}
</style>