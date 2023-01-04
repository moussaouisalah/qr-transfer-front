<template>
  <NForm>
    <NFormItem label="Username">
      <NInput
        v-model:value="form.username"
        placeholder="ExampleUsername"
        :disabled="isLoading"
      />
    </NFormItem>
    <NFormItem label="Room Id">
      <NInput
        v-model:value="form.roomId"
        placeholder="xxxxx-xxxxx-xxxx"
        :disabled="isLoading"
      />
    </NFormItem>
    <div class="flex justify-center">
      <NButton
        type="primary"
        @click="handleConnect"
        :disabled="isLoading || !form.username || !form.roomId"
        >Connect</NButton
      >
    </div>
  </NForm>
</template>
<script setup>
import { reactive } from "vue";

import { NButton, NForm, NFormItem, NInput } from "naive-ui";

const props = defineProps({
  initialRoomId: {
    type: String,
    default: "",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["connect"]);

const form = reactive({
  username: "",
  roomId: props.initialRoomId,
});

const handleConnect = () => {
  emit("connect", form);
};
</script>
<style scoped>
</style>