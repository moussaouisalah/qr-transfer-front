// TODO: WIP: This file is not used yet
import { getServerDomain } from "../utils";

let socket = null;

const subscribers = {
  [events.NEW_USER]: [],
};

const registerListeners = (socket) => {
  if (!socket) return;

  let connectionAttempts = 0;
  const serverEvents = {
    connect: () => emit(events.CONNECTED),
    disconnect: () => {
      emit(events.SERVER_DISCONNECTED);
      socket?.disconnect();
      socket = null;
    },
    connect_error: () => {
      connectionAttempts++;
      if (connectionAttempts >= 3) {
        socket?.disconnect();
        socket = null;
        emit(events.CONNECTION_FAILED);
      }
    },
    "new-user": (user) => emit(events.NEW_USER, user),
    "user-disconnected": (user) => emit(events.USER_DISCONNECTED, user),
    "room-data": ({ users, files, id, username, uploadToken }) => {
      emit(events.USERS_INFO, users);
      emit(events.FILES_INFO, files);
      emit(events.ROOM_INFO, { id, username, uploadToken });
    },
  };

  Object.keys(serverEvents).forEach((event) => {
    socket.on(event, serverEvents[event]);
  });
};

const emit = (event, data) => {
  subscribers[event].forEach(({ callback }) => callback(data));
};

export const connect = ({ roomId, connectionCode }) => {
  socket = io(getServerDomain(), {
    query: {
      roomId,
      connectionCode,
    },
  });
  registerListeners(socket);
};

export const disconnect = () => {
  socket?.disconnect();
  socket = null;
  emit(events.CLIENT_DISCONNECTED);
};

export const subscribe = (event, callback) => {
  if (!subscribers[event]) subscribers[event] = [];
  const randomId = Math.random().toString(36).slice(2, 9);
  subscribers[event].push({ id: randomId, callback });
  // return a function to unsubscribe
  return () => {
    subscribers[event] = subscribers[event].filter((subscriber) => subscriber.id !== randomId);
  };
};

export const events = {
  CONNECTION_FAILED: "connection-failed",
  CONNECTED: "connected",
  CLIENT_DISCONNECTED: "client-disconnected",
  SERVER_DISCONNECTED: "server-disconnected",
  NEW_USER: "new-user",
  USER_DISCONNECTED: "user-disconnected",
  NEW_FILE: "new-file",
  USERS_INFO: "users-info",
  FILES_INFO: "files-info",
  ROOM_INFO: "room-info",
};
