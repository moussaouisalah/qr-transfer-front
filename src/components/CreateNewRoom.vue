<template>
  <NForm>
    <NFormItem label="Username">
      <NInput
        v-model:value="form.username"
        placeholder="ExampleUsername"
        :disabled="isLoading"
      />
    </NFormItem>
    <div class="flex justify-center">
      <NButton type="primary" :loading="isLoading" @click="handleCreate"
        >Create</NButton
      >
    </div>
  </NForm>
</template>
<script setup>
import { reactive } from "vue";
import { NButton, NForm, NFormItem, NInput } from "naive-ui";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["create"]);

const form = reactive({
  username: "",
});

const handleCreate = () => {
  console.log("create", form, form.username);
  emit("create", form);
};
</script>
<style scoped>
.create-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
</style>