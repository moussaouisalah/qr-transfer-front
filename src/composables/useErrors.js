// TODO: WIP: This is a work in progress.
import { reactive } from "vue";
import { subscribe, events } from "../data";

const errors = reactive({
  connection: null,
  upload: null,
  room: null,
});

subscribe(events.CONNECTION_FAILED, () => {
  errors.connection = "Connection failed";
});

subscribe(events.SERVER_DISCONNECTED, () => {
  errors.connection = "Disconnected from server";
});

export default function useErrors() {
  return { errors };
}
