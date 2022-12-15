<template>
  <div>
    <Header>
      <template v-if="isConnected" #extra>
        <div class="flex items-center" style="gap: 4px">
          <NButton
            v-if="isMobile"
            secondary
            type="primary"
            @click="handleOpenRoomInfoModal"
            >Share</NButton
          >
          <NButton secondary type="error" @click="handleDisconnect"
            >Disconnect</NButton
          >
        </div>
      </template>
    </Header>
    <div class="room-container">
      <ConnectModal
        v-if="!isConnected"
        :initialRoomId="roomId"
        :isLoading="loading.connect"
        :errors="{ username: errors.username, room: errors.room }"
        @newRoom="handleNewRoom"
        @connectToRoom="handleConnect"
        class="connect-modal-container"
      />
      <div v-else class="inside-room-container">
        <div v-if="!isMobile" class="room-info-container">
          <RoomInfoContainer
            :roomId="roomId"
            :username="username"
            :roomUsersNumber="users.length"
            @share="handleShared"
          />
        </div>
        <div class="users-container">
          <UsersListContainer
            :users="users"
            :currentUser="username"
            @disconnect="handleDisconnect"
          />
        </div>
        <div class="files-container">
          <FilesContainer
            :files="files"
            @showUploadModal="handleToggleUploadModal"
          />
        </div>
        <NModal v-model:show="isUploadModalOpen">
          <UploadFileModal
            :progress="uploadProgress"
            :isLoading="loading.upload"
            :errors="{ file: errors.upload }"
            @upload="handleUploadFile"
            @close="isUploadModalOpen = false"
            style="width: min(95%, 800px)"
          />
        </NModal>
        <NModal v-model:show="isRoomInfoModalOpen">
          <RoomInfoContainer
            :roomId="roomId"
            :username="username"
            :roomUsersNumber="users.length"
            @share="handleShared"
            style="width: min(95%, 800px)"
          />
        </NModal>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
import axios from "axios";
import { useLoadingBar, useNotification, NModal, NButton } from "naive-ui";

import useWindowWidth from "../composables/useWindowWidth";
import { getServerUrl, getServerDomain } from "../utils";
import { socketEvents } from "../constants";

import ConnectModal from "../components/ConnectModal.vue";
import RoomInfoContainer from "../components/RoomInfoContainer.vue";
import UsersListContainer from "../components/UsersListContainer.vue";
import FilesContainer from "../components/FilesContainer.vue";
import UploadFileModal from "../components/UploadFileModal.vue";
import Header from "../components/Header.vue";

const route = useRoute();
const router = useRouter();

console.log(route.params.id);

const roomId = ref(route.params.id ?? "");
const username = ref("");
const isConnected = ref(false);
const socket = ref(null);

const errors = reactive({
  username: "",
  upload: "",
});

const loading = reactive({
  connect: false,
  upload: false,
});

const { isMobile } = useWindowWidth();
const notification = useNotification();
const loadingBar = useLoadingBar();

const files = ref([]);
const users = ref([]);
const uploadToken = ref("");

const uploadProgress = ref(0);
const isUploadModalOpen = ref(false);
const isRoomInfoModalOpen = ref(false);

const handleOpenRoomInfoModal = () => {
  isRoomInfoModalOpen.value = true;
};

const clearData = () => {
  roomId.value = null;
  username.value = "";
  files.value = [];
  users.value = [];
  uploadToken.value = "";
};

const registerSocketListeners = () => {
  if (!socket.value) return;
  socket.value.on(socketEvents.CONNECT, () => {
    isConnected.value = true;
    loading.connect = false;
    loadingBar.finish();
    console.log("connected");
    notification.success({
      content: `connected to room`,
      duration: 3000,
    });
    router.replace({ name: route.name, params: { id: roomId.value } });
  });

  socket.value.on(socketEvents.DISCONNECT, () => {
    console.log("disconnected by server");
    notification.error({
      content: "Disconnected from server",
      duration: 3000,
    });
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
    isConnected.value = false;
    clearData();
    router.replace({ path: "/" });
  });

  const MAX_CONNECT_TRIES = 3;
  let connectErrorsCount = 0;
  socket.value.on(socketEvents.CONNECT_ERROR, (err) => {
    console.log("connect_error", err);
    connectErrorsCount++;
    if (connectErrorsCount >= MAX_CONNECT_TRIES) {
      notification.error({
        content: "Could not connect to server",
        duration: 3000,
      });
      if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
      }
      isConnected.value = false;
      loading.connect = false;
      loadingBar.error();
      clearData();
      router.replace({ path: "/" });
    }
  });

  socket.value.on(socketEvents.ROOM_DATA, (data) => {
    console.log("room-data", data);
    users.value = data.users;
    files.value = data.files;
    roomId.value = data.id;
    uploadToken.value = data.uploadToken;
  });

  socket.value.on(socketEvents.NEW_USER, (user) => {
    console.log("new-user", user);
    users.value = [...users.value, user];
  });

  socket.value.on(socketEvents.USER_DISCONNECTED, (user) => {
    console.log("user-disconnected", user);
    users.value = users.value.filter((u) => u !== user);
  });

  socket.value.on(socketEvents.FILE_UPLOAD, (file) => {
    console.log("file-upload", file);
    files.value = [...files.value, file];
  });

  socket.value.on(socketEvents.USERNAME_TAKEN, () => {
    console.log("username taken");
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
    isConnected.value = false;
    clearData();
    errors.username = "Username already taken";
  });
};

const handleConnect = ({ room, user }) => {
  console.log("handleConnect", room, user);
  if (!user) {
    errors.username = "Username is required";
    return;
  }
  if (!room) {
    errors.room = "Room is required";
    return;
  }
  console.log("connect", room, user);
  errors.username = "";
  errors.room = "";
  username.value = user;
  loading.connect = true;
  loadingBar.start();
  socket.value = io(getServerDomain(), {
    query: {
      roomId: room,
      username: user,
    },
  });
  registerSocketListeners();
};

const handleNewRoom = ({ user }) => {
  if (!user) {
    errors.username = "Username is required";
    return;
  }
  errors.username = "";
  errors.room = "";
  username.value = user;
  loading.connect = true;
  loadingBar.start();
  socket.value = io(getServerDomain(), {
    query: {
      username: user,
    },
  });
  notification.info({
    content: "Creating new room... This might take a while",
    duration: 3000,
  });
  registerSocketListeners();
};

const handleDisconnect = () => {
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }
  isConnected.value = false;
  clearData();
  router.replace({ path: "/" });
};

const handleUploadFile = (file) => {
  if (!file) {
    errors.upload = "File is required";
    return;
  }
  errors.upload = "";
  loading.upload = true;
  loadingBar.start();
  const formData = new FormData();
  formData.append("file", file);
  axios
    .post(
      `${getServerUrl()}/upload/${roomId.value}?token=${uploadToken.value}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const uploadPercentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload Progress: " + uploadPercentage + "%");
          uploadProgress.value = uploadPercentage;
        },
      }
    )
    .then((res) => {
      console.log(res);
      isUploadModalOpen.value = false;
    })
    .catch((err) => {
      console.log(err);
      loadingBar.error();
      errors.upload = "Error uploading file" + JSON.stringify(err);
    })
    .finally(() => {
      loading.upload = false;
      loadingBar.finish();
      uploadProgress.value = 0;
    });
};

const handleToggleUploadModal = () => {
  isUploadModalOpen.value = !isUploadModalOpen.value;
};

const handleShared = () => {
  notification.success({
    content: "Room link copied to clipboard",
    duration: 3000,
  });
};
</script>
<style scoped>
.room-container {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.connect-modal-container {
  max-width: 500px;
}

.inside-room-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "files" "users";
  gap: 1rem;
}

.room-info-container {
  grid-area: info;
}

.users-container {
  grid-area: users;
}

.files-container {
  grid-area: files;
}

.upload-file-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notifications-container {
  position: fixed;
  top: 0;
  right: 0;
  width: min(95%, 500px);
  padding: 1rem;
  z-index: 100;
}

@media (min-width: 768px) {
  .inside-room-container {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: "info files files" "users files files";
  }
}
</style>