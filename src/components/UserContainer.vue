<template>
  <div class="user-container">
    <p>{{ username }}</p>
    <p v-if="isCurrentUser" class="you">YOU</p>
  </div>
</template>
<script setup>
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

.you {
  color: #ff0000;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>