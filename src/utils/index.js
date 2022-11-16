const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
const SERVER_PROTOCOL = import.meta.env.VITE_SERVER_PROTOCOL;

export const getServerDomain = () => {
  return SERVER_DOMAIN;
};

export const getServerUrl = () => {
  return `${SERVER_PROTOCOL}://${SERVER_DOMAIN}`;
};

export const socketEvents = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  NEW_USER: "new-user",
  USER_DISCONNECTED: "user-disconnected",
  FILE_UPLOAD: "file-upload",
  ROOM_DATA: "room-data",
  USERNAME_TAKEN: "username-taken",
};
