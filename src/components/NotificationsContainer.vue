<template>
  <TransitionGroup tag="ul" name="list">
    <li
      v-for="(notification, i) in notifications"
      :key="i"
      :class="typeClass(notification)"
    >
      {{ notification.message }}
    </li>
  </TransitionGroup>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  notifications: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const typeClass = (notification) => {
  const typesClasses = {
    error: "error",
    success: "success",
    info: "info",
  };
  console.log("type", notification.type);
  return typesClasses[notification.type];
};
</script>
<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

li {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid;
}

.error {
  background: #f8d7da;
  border-color: #f5c6cb;
}

.success {
  background: #d4edda;
  border-color: #c3e6cb;
}

.info {
  background: #d1ecf1;
  border-color: #bee5eb;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-enter-from {
  transform: translateX(-30px);
}

.list-leave-to {
  transform: translateX(30px);
}
</style>