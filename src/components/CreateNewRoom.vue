<template>
  <div>
    <CoolInput
      type="text"
      :value="username"
      placeholder="username"
      @input="(e) => (username = e)"
    />
    <CoolButton text="Create" @click="handleCreate" />
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