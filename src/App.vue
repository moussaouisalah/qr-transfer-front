<template>
  <div v-if="true" class="app-container">
    <header class="app-header">File Transfer</header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
  <div v-else>
    <h1>App</h1>
    <template v-if="!isConnected">
      <div><input type="text" v-model="username" /></div>
      <div><input type="text" v-model="roomId" /></div>
      <div>
        <CoolButton
          text="Connect"
          backgroundColor="green"
          @click="handleConnect"
        />
      </div>
      <div>
        <CoolButton
          text="create new room"
          backgroundColor="orange"
          @click="handleNewRoom"
        />
      </div>
    </template>
    <template v-else>
      <div>
        <h2>Socket</h2>
        <p>room: {{ roomId }}</p>
        <p>username: {{ username }}</p>
        <p>users: {{ JSON.stringify(users) }}</p>
        <div v-for="file in files" :key="file.path">
          <p>{{ JSON.stringify(file) }}</p>
          <a
            :href="`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/${file.path}`"
            target="_blank"
            >donwlo</a
          >
        </div>
        <p>files: {{ JSON.stringify(files) }}</p>
        <button @click="downloadRandomFile">download</button>
      </div>
      <UploadFileModal v-if="isUploading" @upload="handleUpload" />
      <button v-else @click="toggleIsUploading">Upload</button>
    </template>
  </div>
</template>
<script setup>
import { io } from "socket.io-client";
import { ref } from "vue";
import axios from "axios";

import UploadFileModal from "./components/UploadFileModal.vue";
import CoolButton from "./components/CoolButton.vue";

const SERVER_PROTOCOL = import.meta.env.VITE_SERVER_PROTOCOL;
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

const socket = ref(null);
const roomId = ref(null);
const username = ref(null);
const users = ref([]);
const files = ref([]);
const isUploading = ref(false);
const isConnected = ref(false);

const registerListeners = (socket) => {
  socket.on("connect", () => {
    isConnected.value = true;
    console.log("connected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected by server");
    clearData();
  });

  socket.on("username-taken", () => {
    console.log("username taken");
    socket.disconnect();
    socket.value = null;
  });

  socket.on("room-data", (data) => {
    console.log("room-data", data);
    users.value = data.users;
    files.value = data.files;
    roomId.value = data.id;
  });

  socket.on("new-user", (data) => {
    console.log("new-user", data);
    users.value = [...users.value, data];
  });

  socket.on("user-disconnected", (data) => {
    console.log("user-disconnected", data);
    users.value = users.value.filter((user) => user !== data);
  });

  socket.on("file-upload", (data) => {
    console.log("file-upload", data);
    files.value = [...files.value, data];
  });

  socket.on("file-data", (data) => {
    console.log("file-data", data);
    // TODO: save file
  });
};

const handleConnect = () => {
  if (!username.value || !roomId.value) {
    return;
  }
  socket.value = io(SERVER_DOMAIN, {
    query: { roomId: roomId.value, username: username.value },
  });
  registerListeners(socket.value);
};

const handleNewRoom = () => {
  if (!username.value) {
    return;
  }
  socket.value = io(SERVER_DOMAIN, {
    query: { username: username.value },
  });
  registerListeners(socket.value);
};

const clearData = () => {
  roomId.value = "";
  username.value = "";
  users.value = [];
  files.value = [];
  socket.value = null;
  isConnected.value = false;
};

const handleDisconnect = () => {
  socket.disconnect();
  clearData();
};

const handleUpload = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  axios
    .post(
      `${SERVER_PROTOCOL}://${SERVER_DOMAIN}/upload/${roomId.value}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          console.log(
            "Upload Progress: " +
              Math.round((progressEvent.loaded / progressEvent.total) * 100) +
              "%"
          );
        },
      }
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const toggleIsUploading = () => {
  isUploading.value = !isUploading.value;
};

const downloadRandomFile = () => {
  const randomFile =
    files.value[Math.floor(Math.random() * files.value.length)];
  socket.value.emit("file-download", randomFile.id);
};
</script>
<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #ece6c2;
}

.app-header {
  background-color: #cc6b49;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.app-main {
  margin-top: 20px;
}
</style>