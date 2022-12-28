import { io } from "socket.io-client";
import { ref } from "vue";
import { socketEvents } from "../constants";
import { getServerDomain } from "../utils";

const MAX_CONNECTION_ATTEMPTS = 3;

let socket = null;
const isConnected = ref(false);
const files = ref([]);
const users = ref([]);
const roomId = ref(null);
const username = ref(null);
const uploadToken = ref(null);
const error = ref(null);

export default function useRoom() {
  const connect = ({ roomId: connectionRoomId, connectionCode }) => {
    socket = io(getServerDomain(), {
      query: {
        roomId: connectionRoomId,
        connectionCode,
      },
    });

    if (!socket) {
      return;
    }

    const currentConnectionAttempts = 0;
    socket.on(socketEvents.CONNECT_ERROR, () => {
      console.log("connect_error");
      currentConnectionAttempts++;
      if (currentConnectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        socket?.disconnect();
        socket = null;
        isConnected.value = false;
        error.value = "Connection error";
      }
    });

    socket.on(socketEvents.DISCONNECT, () => {
      console.log("disconnect");
      socket?.disconnect();
      socket = null;
      isConnected.value = false;
      users.value = [];
      files.value = [];
      roomId.value = null;
      username.value = null;
      uploadToken.value = null;
      error.value = "Disconnected from server";
    });

    socket.on(socketEvents.ROOM_DATA, (data) => {
      console.log("room_data", data);
      users.value = data?.users || [];
      files.value = data?.files || [];
      roomId.value = data?.id || null;
      username.value = data?.username || null;
      uploadToken.value = data?.uploadToken || null;
      isConnected.value = true;
    });

    socket.on(socketEvents.NEW_USER, (user) => {
      console.log("new_user", user);
      users.value = [...users.value, user];
    });

    socket.on(socketEvents.USER_DISCONNECTED, (user) => {
      console.log("user_disconnected", user);
      users.value = users.value.filter((u) => u !== user);
    });

    socket.on(socketEvents.FILE_UPLOAD, (file) => {
      console.log("file_upload", file);
      files.value = [...files.value, file];
    });
  };

  const disconnect = () => {
    socket?.disconnect();
    socket = null;
    isConnected.value = false;
    username.value = null;
    users.value = [];
    files.value = [];
    roomId.value = null;
    uploadToken.value = null;
  };

  return {
    isConnected,
    username,
    files,
    users,
    roomId,
    uploadToken,
    connect,
    disconnect,
  };
}
