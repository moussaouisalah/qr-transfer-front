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
        :initialRoomId="route.params?.id || ''"
        :isLoading="loading.connect"
        :errors="{ username: errors.username, room: errors.room }"
        @newRoom="handleNewRoom"
        @connectToRoom="handleConnect"
        class="connect-modal-container"
      />
      <div v-else class="inside-room-container">
        <div v-if="!isMobile" class="room-info-container">
          <RoomInfoContainer @share="handleShared" />
        </div>
        <div class="users-container">
          <UsersListContainer @disconnect="handleDisconnect" />
        </div>
        <div class="files-container">
          <FilesContainer @showUploadModal="handleToggleUploadModal" />
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
            @share="handleShared"
            style="width: min(95%, 800px)"
          />
        </NModal>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useLoadingBar, useNotification, NModal, NButton } from "naive-ui";

import useWindowWidth from "../composables/useWindowWidth";
import useRoom from "../composables/useRoom";
import { getServerUrl } from "../utils";

import ConnectModal from "../components/ConnectModal.vue";
import RoomInfoContainer from "../components/RoomInfoContainer.vue";
import UsersListContainer from "../components/UsersListContainer.vue";
import FilesContainer from "../components/FilesContainer.vue";
import UploadFileModal from "../components/UploadFileModal.vue";
import Header from "../components/Header.vue";

const route = useRoute();
const router = useRouter();

const { isConnected, connect, disconnect, roomId, uploadToken } = useRoom();

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

const uploadProgress = ref(0);
const isUploadModalOpen = ref(false);
const isRoomInfoModalOpen = ref(false);

watch(isConnected, (newValue) => {
  if (newValue) {
    loading.connect = false;
    loadingBar.finish();
  }
});

const handleOpenRoomInfoModal = () => {
  isRoomInfoModalOpen.value = true;
};

const handleConnect = async ({ room, user }) => {
  if (!user) {
    errors.username = "Username is required";
    return;
  }
  if (!room) {
    errors.room = "Room is required";
    return;
  }
  errors.username = "";
  errors.room = "";
  loading.connect = true;
  loadingBar.start();
  try {
    const response = await axios
      .post(getServerUrl() + "/rooms/join", {
        roomId: room,
        username: user,
      })
      .catch((err) => {
        throw new Error(
          err?.response?.data?.message || "An unknown error occured"
        );
      });
    console.log(response);
    if (!response.status === 200 || !response.data.connectionCode) {
      throw new Error("An unknown error occured");
    }
    const connectionCode = response.data.connectionCode;
    const roomId = response.data.roomId;
    connect({ connectionCode, roomId });
  } catch (err) {
    console.log(err);
    notification.error({
      content: "Could not join room! " + err.message,
      duration: 3000,
    });
    loading.connect = false;
    loadingBar.error();
    return;
  }
};

const handleNewRoom = async ({ user }) => {
  if (!user) {
    errors.username = "Username is required";
    return;
  }
  errors.username = "";
  errors.room = "";
  loading.connect = true;
  loadingBar.start();
  notification.info({
    content: "Creating new room... This might take a while",
    duration: 3000,
  });
  try {
    const response = await axios
      .post(getServerUrl() + "/rooms/new", {
        username: user,
      })
      .catch((err) => {
        throw new Error(
          err?.response?.data?.message || "An unknown error occured"
        );
      });
    if (!response.status === 200 || !response.data.connectionCode) {
      throw new Error("An unknown error occured");
    }
    const connectionCode = response.data.connectionCode;
    const roomId = response.data.roomId;
    connect({ connectionCode, roomId });
  } catch (err) {
    console.log(err);
    notification.error({
      content: "Could not create room!, " + err.message,
      duration: 3000,
    });
    loading.connect = false;
    loadingBar.error();
    return;
  }
};

const handleDisconnect = () => {
  disconnect();
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