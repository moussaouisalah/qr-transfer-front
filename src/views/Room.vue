<template>
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
      <div class="room-info-container">
        <RoomInfoContainer
          :roomId="roomId"
          :username="username"
          :roomUsersNumber="users.length"
          @share="handleShared"
        />
      </div>
      <div class="users-container">
        <UsersListContainer :users="users" :currentUser="username" />
      </div>
      <div class="files-container">
        <FilesContainer
          :files="files"
          @showUploadModal="handleToggleUploadModal"
        />
      </div>
      <div v-if="isUploadModalOpen" class="upload-file-modal">
        <UploadFileModal
          :progress="uploadProgress"
          :isLoading="loading.upload"
          :errors="{ file: errors.upload }"
          @upload="handleUploadFile"
          @close="isUploadModalOpen = false"
        />
      </div>
    </div>
    <div class="notifications-container">
      <NotificationsContainer :notifications="notifications" />
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
import axios from "axios";
import { getServerUrl, getServerDomain, socketEvents } from "../utils";

import ConnectModal from "../components/ConnectModal.vue";
import RoomInfoContainer from "../components/RoomInfoContainer.vue";
import UsersListContainer from "../components/UsersListContainer.vue";
import FilesContainer from "../components/FilesContainer.vue";
import NotificationsContainer from "../components/NotificationsContainer.vue";
import CoolButton from "../components/CoolButton.vue";
import UploadFileModal from "../components/UploadFileModal.vue";

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

const notifications = ref([]);

const files = ref([]);
const users = ref([]);
const uploadToken = ref("");

const uploadProgress = ref(0);
const isUploadModalOpen = ref(false);

watch(
  () => notifications.value,
  (newValue, oldValue) => {
    console.log("notifications changed", newValue, oldValue);
    if (oldValue.length > newValue.length) return;
    if (newValue.length > 0) {
      setTimeout(() => {
        newValue.shift();
      }, 3000);
    }
  }
);

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
    router.replace({ name: route.name, params: { id: roomId.value } });
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
    router.replace({ path: "/" });
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
  socket.value = io(getServerDomain(), {
    query: {
      username: user,
    },
  });

  notifications.value = [
    ...notifications.value,
    {
      type: "info",
      message: "Creating new room... This might take a while",
    },
  ];

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
      errors.upload = "Error uploading file" + JSON.stringify(err);
    })
    .finally(() => {
      loading.upload = false;
      uploadProgress.value = 0;
    });
};

const handleToggleUploadModal = () => {
  isUploadModalOpen.value = !isUploadModalOpen.value;
};

const handleShared = () => {
  notifications.value = [
    ...notifications.value,
    {
      type: "info",
      message: "Room link copied to clipboard",
    },
  ];
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
  grid-template-areas: "info" "files" "users";
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

@media (min-width: 500px) {
  .inside-room-container {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "info users" "files files";
  }
}

@media (min-width: 768px) {
  .inside-room-container {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: "info files files" "users files files";
  }
}
</style>