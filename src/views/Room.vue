<template>
  <div class="room-container">
    <ConnectModal
      v-if="!isConnected"
      :initialRoomId="roomId"
      :isLoading="loading.connect"
      :errors="{ username: errors.username }"
      @newRoom="handleNewRoom"
      @connectToRoom="handleConnect"
    />
    <div v-else>
      <div class="room-info-container">
        <RoomInfoContainer :roomId="roomId" :username="username" />
      </div>
      <div class="users-container">
        <UsersListContainer :users="users" :currentUser="username" />
      </div>
      <div class="files-container">
        <FilesContainer :files="files" />
      </div>
      <div v-if="isUploadModalOpen" class="upload-file-modal">
        <UploadFileModal
          :progress="uploadProgress"
          :isLoading="loading.upload"
          :errors="{ file: errors.upload }"
          @upload="handleUploadFile"
        />
      </div>
    </div>
    <div class="notifications-container">
      <NotificationsContainer :notifications="notifications" />
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import { getServerDomain, socketEvents } from "../utils";

import ConnectModal from "../components/ConnectModal.vue";
import RoomInfoContainer from "../components/RoomInfoContainer.vue";
import UsersListContainer from "../components/UsersListContainer.vue";
import FilesContainer from "../components/FilesContainer.vue";
import NotificationsContainer from "../components/NotificationsContainer.vue";

const route = useRoute();
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

const notifications = ref([]);

const files = ref([]);
const users = ref([]);
const uploadToken = ref("");

const uploadProgress = ref(0);
const isUploadModalOpen = ref(false);

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
    console.log("connected");
    notifications.value = [
      ...notifications.value,
      {
        type: "info",
        message: `connected to room ${roomId.value}`,
      },
    ];
  });

  socket.value.on(socketEvents.DISCONNECT, () => {
    console.log("disconnected by server");
    notifications.value = [
      ...notifications.value,
      {
        type: "error",
        message: "Disconnected from server",
      },
    ];
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
    isConnected.value = false;
    clearData();
    // TODO: go back to home page
  });

  socket.value.on(socketEvents.ROOM_DATA, (data) => {
    console.log("room-data", data);
    users.value = data.users;
    files.value = data.files;
    roomId.value = data.id;
    uploadToken.value = data.uploadToken;
  });

  socket.value.on(socketEvents.NEW_USER, (user) => {
    console.log("new-user", data);
    users.value = [...users.value, user];
  });

  socket.value.on(socketEvents.USER_DISCONNECTED, (user) => {
    console.log("user-disconnected", data);
    users.value = users.value.filter((u) => u !== user);
  });

  socket.value.on(socketEvents.FILE_UPLOAD, (file) => {
    console.log("file-upload", data);
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
  console.log("connect", room, user);
  errors.username = "";
  username.value = user;
  loading.connect = true;
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
  username.value = user;
  loading.connect = true;
  socket.value = io(getServerDomain(), {
    query: {
      username: user,
    },
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
  // TODO: go back to home page
};

const handleUploadFile = (file) => {
  if (!file) {
    errors.upload = "File is required";
    return;
  }
  errors.upload = "";
  loading.upload = true;
  const formData = new FormData();
  formData.append("file", file);
  axios
    .post(
      `${getServerDomain()}/upload/${roomId.value}?token=${uploadToken.value}`,
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
      errors.upload = "Error uploading file" + JSON.stringify(err);
    })
    .finally(() => {
      loading.upload = false;
      uploadProgress.value = 0;
    });
};
</script>