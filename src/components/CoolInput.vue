<template>
  <div class="input-container">
    <label v-if="label" class="cool-label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :value="props.value"
      @input="handleUpdate"
      class="cool-input"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["input"]);

const handleUpdate = (e) => {
  emit("input", e.target.value);
};
</script>
<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
}

.cool-label {
  font-size: 0.9rem;
  font-weight: bold;
}

.cool-input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
  width: 100%;
}
</style>