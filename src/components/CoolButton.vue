<template>
  <button
    @click="handleClick"
    :style="{ '--background-color': props.backgroundColor }"
  >
    {{ props.text }}
  </button>
</template>
<script setup>
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
</style>