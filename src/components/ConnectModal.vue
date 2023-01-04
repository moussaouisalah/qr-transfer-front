<template>
  <NCard title="Welcome to Qranfer!" class="connect-modal-container">
    <p style="margin-bottom: 12px; color: #aaa">
      Start by creating a new room by entering a username. Or Join an existing
      room by choosing a username and entering the room id
    </p>
    <NTabs
      type="line"
      animated
      :defaultValue="props.initialRoomId ? 'join-room' : 'create-room'"
    >
      <NTabPane name="create-room" tab="Create Room">
        <CreateNewRoom :isLoading="isLoading" @create="handleCreateNewRoom" />
      </NTabPane>
      <NTabPane name="join-room" tab="Join Room">
        <ConnectToRoom
          :initialRoomId="props.initialRoomId"
          :isLoading="props.isLoading"
          @connect="handleConnectToRoom"
        />
      </NTabPane>
    </NTabs>
  </NCard>
</template>
<script setup>
import { ref } from "vue";

import { NButton, NCard, NTabs, NTabPane } from "naive-ui";

import ConnectToRoom from "./ConnectToRoom.vue";
import CreateNewRoom from "./CreateNewRoom.vue";

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