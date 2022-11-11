<template>
  <input v-bind="$attrs" :value="props.value" @input="handleUpdate" />
</template>
<script setup>
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["input"]);

const handleUpdate = (e) => {
  console.log(props.value);
  console.log("input", e.target.value);
  emit("input", e.target.value);
};
</script>