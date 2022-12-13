import { ref } from "vue";

const TIME_TO_LIVE_MS = 3000;

const notifications = ref([]);

export default function useNotifications() {
  const addNotification = ({ message, type }) => {
    const id = Math.random().toString(36).slice(2);
    const notification = {
      id,
      message,
      type,
    };
    notifications.value = [...notifications.value, notification];
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id);
    }, TIME_TO_LIVE_MS);
  };

  return {
    notifications,
    addNotification,
  };
}
