import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { MobileMessage } from '../types/message';

export type MessageFilter = 'all' | 'unread';

interface CachedMessagePage {
  rows: MobileMessage[];
  currentPage: number;
  hasNextPage: boolean;
}

interface MessageContextCache {
  unreadCount: number;
  pages: Record<MessageFilter, CachedMessagePage>;
}

function contextKey(userId?: string | null, tenantId?: string | null): string {
  const user = userId?.trim();
  const tenant = tenantId?.trim();
  return user && tenant ? `${encodeURIComponent(user)}:${encodeURIComponent(tenant)}` : '';
}

function createPage(): CachedMessagePage {
  return { rows: [], currentPage: 1, hasNextPage: false };
}

function createContext(): MessageContextCache {
  return {
    unreadCount: 0,
    pages: {
      all: createPage(),
      unread: createPage(),
    },
  };
}

export const useMessageStore = defineStore('fa-base-mobile-message', () => {
  const caches = ref<Record<string, MessageContextCache>>({});

  function getCache(userId?: string | null, tenantId?: string | null): MessageContextCache | null {
    const key = contextKey(userId, tenantId);
    return key ? caches.value[key] || null : null;
  }

  function getOrCreateCache(userId?: string | null, tenantId?: string | null): MessageContextCache | null {
    const key = contextKey(userId, tenantId);
    if (!key) return null;
    if (!caches.value[key]) caches.value[key] = createContext();
    return caches.value[key];
  }

  function getMessages(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    filter: MessageFilter,
  ): MobileMessage[] {
    return getCache(userId, tenantId)?.pages[filter].rows || [];
  }

  function getCurrentPage(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    filter: MessageFilter,
  ): number {
    return getCache(userId, tenantId)?.pages[filter].currentPage || 1;
  }

  function hasNextPage(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    filter: MessageFilter,
  ): boolean {
    return Boolean(getCache(userId, tenantId)?.pages[filter].hasNextPage);
  }

  function setMessages(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    filter: MessageFilter,
    rows: MobileMessage[],
    currentPage: number,
    hasMore: boolean,
  ): void {
    const cache = getOrCreateCache(userId, tenantId);
    if (!cache) return;
    cache.pages[filter] = {
      rows: [...rows],
      currentPage,
      hasNextPage: hasMore,
    };
  }

  function appendMessages(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    filter: MessageFilter,
    rows: MobileMessage[],
    currentPage: number,
    hasMore: boolean,
  ): void {
    const cache = getOrCreateCache(userId, tenantId);
    if (!cache) return;
    const page = cache.pages[filter];
    page.rows = [...page.rows, ...rows];
    page.currentPage = currentPage;
    page.hasNextPage = hasMore;
  }

  function getUnreadCount(userId?: string | null, tenantId?: string | null): number {
    return getCache(userId, tenantId)?.unreadCount || 0;
  }

  function setUnreadCount(userId: string | null | undefined, tenantId: string | null | undefined, count: number): void {
    const cache = getOrCreateCache(userId, tenantId);
    if (cache) cache.unreadCount = Math.max(0, count);
  }

  function markRead(userId: string | null | undefined, tenantId: string | null | undefined, messageId: number): void {
    const cache = getCache(userId, tenantId);
    if (!cache) return;
    cache.pages.all.rows = cache.pages.all.rows.map((message) => (
      message.id === messageId ? { ...message, isRead: true } : message
    ));
    cache.pages.unread.rows = cache.pages.unread.rows.filter((message) => message.id !== messageId);
  }

  function markAllRead(userId: string | null | undefined, tenantId: string | null | undefined): void {
    const cache = getCache(userId, tenantId);
    if (!cache) return;
    cache.unreadCount = 0;
    cache.pages.all.rows = cache.pages.all.rows.map((message) => ({ ...message, isRead: true }));
    cache.pages.unread = createPage();
  }

  function reset(): void {
    caches.value = {};
  }

  return {
    getMessages,
    getCurrentPage,
    hasNextPage,
    setMessages,
    appendMessages,
    getUnreadCount,
    setUnreadCount,
    markRead,
    markAllRead,
    reset,
  };
});
