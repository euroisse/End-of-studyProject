// stores/notificationStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const unreadMessages = ref(0);
  function setUnreadMessages(count: number) {
    unreadMessages.value = count;
  }
  return { unreadMessages, setUnreadMessages };
});