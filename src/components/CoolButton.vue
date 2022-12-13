<template>
  <button
    :disabled="props.isLoading"
    @click="handleClick"
    :style="{ '--background-color': props.backgroundColor }"
    :class="{ loading: props.isLoading }"
  >
    {{ props.isLoading ? "Loading..." : props.text }}
  </button>
</template>
<script setup>
import LoadingSpinner from "./LoadingSpinner.vue";

const emit = defineEmits(["click"]);

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "green",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const handleClick = () => {
  emit("click");
};
</script>
<style scoped>
button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: bold;
  color: white;
  background-color: var(--background-color);
  font-family: monospace;
  font-size: 1.1em;
}

button:hover {
  cursor: pointer;
  opacity: 0.8;
}

button.loading {
  opacity: 0.5;
}
</style>