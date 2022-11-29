<template>
  <Container class="connect-modal-container">
    <div class="back-container">
      <BackButton v-if="currentStep !== 'choose'" @click="handleGoBack" />
      <h2 v-if="currentStep === 'create'">Create a new room</h2>
      <h2 v-if="currentStep === 'connect'">Join existing room</h2>
    </div>
    <div v-if="errors.username" class="errors-container">
      <p>{{ errors.username }}</p>
    </div>
    <div class="connect-content-container">
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
    </div>
  </Container>
</template>
<script setup>
import { ref } from "vue";

import ConnectToRoom from "./ConnectToRoom.vue";
import CreateNewRoom from "./CreateNewRoom.vue";
import CoolButton from "./CoolButton.vue";
import Container from "./Container.vue";
import BackButton from "./BackButton.vue";

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
    default: () => ({ username: "", room: "" }),
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
  margin: 0 auto;
  padding: 20px;
  border: 3px solid #000;
}

.back-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.connect-content-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
}

.choose-connect-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.errors-container {
  display: flex;
  justify-content: center;
  margin: 8px 0;
  color: red;
}

.back-button {
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.back-button:hover {
  opacity: 0.8;
  background-color: #eee;
}
</style>