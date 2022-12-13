<template>
  <div class="create-container">
    <CoolInput
      type="text"
      :value="username"
      placeholder="ExampleUsername"
      label="Username"
      @input="(e) => (username = e)"
    />
    <CoolButton text="Create" :isLoading="isLoading" @click="handleCreate" />
  </div>
</template>
<script setup>
import { ref } from "vue";

import CoolInput from "./CoolInput.vue";
import CoolButton from "./CoolButton.vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["create"]);

const username = ref("");

const handleCreate = () => {
  emit("create", { username: username.value });
};
</script>
<style scoped>
.create-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}
</style>