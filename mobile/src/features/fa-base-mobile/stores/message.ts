import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('fa-base-mobile-message', () => {
  const unreadCount = ref(0);

  function setUnreadCount(count: number): void {
    unreadCount.value = Math.max(0, count);
  }

  return {
    unreadCount,
    setUnreadCount,
  };
});
