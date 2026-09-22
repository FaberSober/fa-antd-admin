import { ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  PortalContactDetail,
  PortalContactSummary,
  PortalDepartmentNode,
} from '../types/contacts';

interface CachedDepartmentMembers {
  rows: PortalContactSummary[];
  currentPage: number;
  hasNextPage: boolean;
}

interface ContactsContextCache {
  contacts: PortalContactSummary[];
  departments: PortalDepartmentNode[];
  members: Record<string, CachedDepartmentMembers>;
  details: Record<string, PortalContactDetail>;
}

function contextKey(userId?: string | null, tenantId?: string | null): string {
  const user = userId?.trim();
  const tenant = tenantId?.trim();
  return user && tenant ? `${encodeURIComponent(user)}:${encodeURIComponent(tenant)}` : '';
}

function createContext(): ContactsContextCache {
  return {
    contacts: [],
    departments: [],
    members: {},
    details: {},
  };
}

export const useContactsStore = defineStore('fa-base-mobile-contacts', () => {
  const caches = ref<Record<string, ContactsContextCache>>({});

  function getCache(userId?: string | null, tenantId?: string | null): ContactsContextCache | null {
    const key = contextKey(userId, tenantId);
    return key ? caches.value[key] || null : null;
  }

  function getOrCreateCache(userId?: string | null, tenantId?: string | null): ContactsContextCache | null {
    const key = contextKey(userId, tenantId);
    if (!key) return null;
    if (!caches.value[key]) caches.value[key] = createContext();
    return caches.value[key];
  }

  function getContacts(userId?: string | null, tenantId?: string | null): PortalContactSummary[] {
    return getCache(userId, tenantId)?.contacts || [];
  }

  function setContacts(userId: string | null | undefined, tenantId: string | null | undefined, rows: PortalContactSummary[]): void {
    const cache = getOrCreateCache(userId, tenantId);
    if (cache) cache.contacts = [...rows];
  }

  function getDepartments(userId?: string | null, tenantId?: string | null): PortalDepartmentNode[] {
    return getCache(userId, tenantId)?.departments || [];
  }

  function setDepartments(userId: string | null | undefined, tenantId: string | null | undefined, rows: PortalDepartmentNode[]): void {
    const cache = getOrCreateCache(userId, tenantId);
    if (cache) cache.departments = [...rows];
  }

  function getDepartmentMembers(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    departmentId?: string | null,
  ): CachedDepartmentMembers | null {
    const normalizedDepartmentId = departmentId?.trim();
    if (!normalizedDepartmentId) return null;
    return getCache(userId, tenantId)?.members[normalizedDepartmentId] || null;
  }

  function setDepartmentMembers(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    departmentId: string,
    rows: PortalContactSummary[],
    currentPage: number,
    hasMore: boolean,
  ): void {
    const cache = getOrCreateCache(userId, tenantId);
    const normalizedDepartmentId = departmentId.trim();
    if (!cache || !normalizedDepartmentId) return;
    cache.members[normalizedDepartmentId] = {
      rows: [...rows],
      currentPage,
      hasNextPage: hasMore,
    };
  }

  function appendDepartmentMembers(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    departmentId: string,
    rows: PortalContactSummary[],
    currentPage: number,
    hasMore: boolean,
  ): void {
    const cache = getOrCreateCache(userId, tenantId);
    const normalizedDepartmentId = departmentId.trim();
    if (!cache || !normalizedDepartmentId) return;
    const page = cache.members[normalizedDepartmentId] || {
      rows: [],
      currentPage: 1,
      hasNextPage: false,
    };
    page.rows = [...page.rows, ...rows];
    page.currentPage = currentPage;
    page.hasNextPage = hasMore;
    cache.members[normalizedDepartmentId] = page;
  }

  function getContactDetail(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    contactId?: string | null,
  ): PortalContactDetail | null {
    const normalizedContactId = contactId?.trim();
    if (!normalizedContactId) return null;
    return getCache(userId, tenantId)?.details[normalizedContactId] || null;
  }

  function setContactDetail(
    userId: string | null | undefined,
    tenantId: string | null | undefined,
    contact: PortalContactDetail,
  ): void {
    const cache = getOrCreateCache(userId, tenantId);
    const normalizedContactId = contact.id.trim();
    if (!cache || !normalizedContactId) return;
    cache.details[normalizedContactId] = contact;
  }

  function reset(): void {
    caches.value = {};
  }

  return {
    getContacts,
    setContacts,
    getDepartments,
    setDepartments,
    getDepartmentMembers,
    setDepartmentMembers,
    appendDepartmentMembers,
    getContactDetail,
    setContactDetail,
    reset,
  };
});
