import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getMyTenants } from '../api/tenant';
import { getStoredTenantId, saveStoredTenantId } from '../common/session';
import { clearTenantId, getTenantId, setTenantId } from '@features/fa-core-mobile/common/tenant';
import type { TenantWorkspace } from '../types/tenant';

export const useTenantStore = defineStore('fa-base-mobile-tenant', () => {
  const workspaces = ref<TenantWorkspace[]>([]);
  const currentTenantId = ref<string | null>(getTenantId());
  const loading = ref(false);
  const errorMessage = ref('');
  let loadedUserId: string | null = null;
  let loadVersion = 0;

  const currentWorkspace = computed<TenantWorkspace | null>(() => (
    workspaces.value.find((item) => item.tenantId === currentTenantId.value) || null
  ));

  async function loadForUser(userId: string): Promise<void> {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      reset();
      return;
    }

    const version = ++loadVersion;
    if (loadedUserId !== normalizedUserId) {
      loadedUserId = normalizedUserId;
      workspaces.value = [];
      currentTenantId.value = null;
      clearTenantId();
    }

    loading.value = true;
    errorMessage.value = '';
    try {
      const tenants = await getMyTenants();
      if (version !== loadVersion) return;

      const previousUnreadCounts = new Map(
        workspaces.value.map((item) => [item.tenantId, item.unreadCount]),
      );
      const nextWorkspaces = (Array.isArray(tenants) ? tenants : [])
        .filter((item) => item && typeof item.tenantId === 'string' && item.tenantId.trim())
        .map((item) => ({
          ...item,
          tenantId: item.tenantId.trim(),
          unreadCount: previousUnreadCounts.get(item.tenantId.trim()) || 0,
        }));
      workspaces.value = nextWorkspaces;

      const currentId = getTenantId();
      const storedId = getStoredTenantId(normalizedUserId);
      const selected = nextWorkspaces.find((item) => item.tenantId === currentId)
        || nextWorkspaces.find((item) => item.tenantId === storedId)
        || nextWorkspaces[0];

      if (selected) {
        currentTenantId.value = selected.tenantId;
        setTenantId(selected.tenantId);
        saveStoredTenantId(normalizedUserId, selected.tenantId);
      } else {
        currentTenantId.value = null;
        clearTenantId();
      }
    } catch (error) {
      if (version !== loadVersion) return;
      errorMessage.value = error instanceof Error && error.message ? error.message : '租户信息加载失败';
    } finally {
      if (version === loadVersion) loading.value = false;
    }
  }

  function switchTenant(userId: string, tenantId: string): boolean {
    const selected = workspaces.value.find((item) => item.tenantId === tenantId);
    if (!selected) return false;

    currentTenantId.value = selected.tenantId;
    setTenantId(selected.tenantId);
    saveStoredTenantId(userId, selected.tenantId);
    return true;
  }

  function setUnreadCount(tenantId: string | null | undefined, count: number): void {
    const normalizedTenantId = tenantId?.trim();
    if (!normalizedTenantId) return;
    const workspace = workspaces.value.find((item) => item.tenantId === normalizedTenantId);
    if (workspace) workspace.unreadCount = Math.max(0, count);
  }

  function reset(): void {
    loadVersion += 1;
    loadedUserId = null;
    workspaces.value = [];
    currentTenantId.value = null;
    loading.value = false;
    errorMessage.value = '';
    clearTenantId();
  }

  return {
    workspaces,
    currentTenantId,
    currentWorkspace,
    loading,
    errorMessage,
    loadForUser,
    switchTenant,
    setUnreadCount,
    reset,
  };
});
