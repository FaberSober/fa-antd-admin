import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getCurrentUser, login, logout } from '../api/auth';
import { clearSession, getStoredUser, getToken, saveSession, saveUser } from '../common/session';
import type { PortalUser } from '../types/auth';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import { clearTenantId } from '@features/fa-core-mobile/common/tenant';

export const useAuthStore = defineStore('fa-base-mobile-auth', () => {
  const user = ref<PortalUser | null>(getStoredUser());
  const loading = ref(false);
  const isAuthenticated = computed(() => Boolean(getToken()));

  async function signIn(username: string, password: string): Promise<void> {
    loading.value = true;
    clearTenantId();
    try {
      const session = await login(username, password);
      saveSession(session.token, session.user);
      user.value = session.user;
      telemetry.identify({ userId: session.user.id });
      telemetry.track('mobile.auth.login', {
        eventType: 'LOGIN',
        module: 'fa-base-mobile',
        result: 'SUCCESS',
      });
    } catch (error) {
      telemetry.track('mobile.auth.login', {
        eventType: 'LOGIN',
        module: 'fa-base-mobile',
        result: 'FAIL',
        properties: { errorType: error instanceof Error ? error.name : 'UnknownError' },
      });
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function loadCurrentUser(): Promise<PortalUser | null> {
    if (!getToken()) {
      user.value = null;
      clearTenantId();
      telemetry.clearUser();
      return null;
    }

    loading.value = true;
    try {
      const currentUser = await getCurrentUser();
      user.value = currentUser;
      saveUser(currentUser);
      telemetry.identify({ userId: currentUser.id });
      return currentUser;
    } finally {
      loading.value = false;
    }
  }

  async function signOut(): Promise<void> {
    try {
      if (getToken()) await logout();
    } finally {
      clearSession();
      clearTenantId();
      user.value = null;
      telemetry.clearUser();
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    signIn,
    loadCurrentUser,
    signOut,
  };
});
