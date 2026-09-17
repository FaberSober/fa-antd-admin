import { ref } from 'vue';
import { defineStore } from 'pinia';

const DEV_UNREAD_COUNT = 2;

export const useMessageStore = defineStore('fa-base-mobile-message', () => {
  const unreadCount = ref(import.meta.env.DEV ? DEV_UNREAD_COUNT : 0);

  function setUnreadCount(count: number): void {
    unreadCount.value = Math.max(0, count);
  }

  return {
    unreadCount,
    setUnreadCount,
  };
});
