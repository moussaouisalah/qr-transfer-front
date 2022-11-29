<template>
  <Container>
    <div class="back-container">
      <button v-if="currentStep !== 'choose'" @click="handleGoBack">
        Back
      </button>
    </div>
    <div v-if="errors.username" class="errors-container">
      {{ JSON.stringify(errors) }}
    </div>
    <ConnectToRoom
      v-if="currentStep === 'connect'"
      :initialRoomId="roomId"
      :isLoading="props.isLoading"
      @connect="handleConnectToRoom"
    />
    <CreateNewRoom
      v-else-if="currentStep === 'create'"
      :isLoading="isLoading"
      @create="handleCreateNewRoom"
    />
    <div v-else class="choose-connect-type">
      <CoolButton text="Create new room" @click="currentStep = 'create'" />
      <CoolButton
        text="Connect to room"
        backgroundColor="orange"
        @click="currentStep = 'connect'"
      />
    </div>
  </Container>
</template>
<script setup>
import { ref } from "vue";

import ConnectToRoom from "./ConnectToRoom.vue";
import CreateNewRoom from "./CreateNewRoom.vue";
import CoolButton from "./CoolButton.vue";
import Container from "./Container.vue";

const props = defineProps({
  initialRoomId: {
    type: String,
    default: "",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    default: () => ({ username: "" }),
  },
});

const emit = defineEmits(["newRoom", "connectToRoom"]);

const roomId = ref(props.initialRoomId);
const currentStep = ref(props.initialRoomId ? "connect" : "choose");

const handleGoBack = () => {
  roomId.value = "";
  currentStep.value = "choose";
  // remove path param
  window.history.pushState({}, "", "/");
};

const handleConnectToRoom = ({ username, roomId }) => {
  emit("connectToRoom", { room: roomId, user: username });
};

const handleCreateNewRoom = ({ username }) => {
  emit("newRoom", { user: username });
};
</script>
<style scoped>
.connect-modal-container {
  width: min(95%, 500px);
  margin: 0 auto;
  padding: 20px;
  border: 3px solid #000;
}

.choose-connect-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
</style>