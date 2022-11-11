<template>
  <div>
    <CoolInput
      type="text"
      :value="username"
      placeholder="username"
      @input="(e) => (username = e)"
    />
    <CoolInput
      type="text"
      :value="roomId"
      placeholder="room id"
      @input="(e) => (roomId = e)"
    />
    <CoolButton text="Connect" @click="handleConnect" />
  </div>
</template>
<script setup>
import { ref } from "vue";

import CoolInput from "./CoolInput.vue";
import CoolButton from "./CoolButton.vue";

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

const username = ref("");
const roomId = ref(props.initialRoomId);
console.log(roomId.value, props.initialRoomId);

const handleConnect = () => {
  emit("connect", { username: username.value, roomId: roomId.value });
};
</script>