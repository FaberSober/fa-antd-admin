import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getCurrentUser, login, logout } from '../api/auth';
import { clearSession, getStoredUser, getToken, saveSession, saveUser } from '../common/session';
import type { PortalUser } from '../types/auth';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import { useTenantStore } from './tenant';

export const useAuthStore = defineStore('fa-base-mobile-auth', () => {
  const user = ref<PortalUser | null>(getStoredUser());
  const loading = ref(false);
  const isAuthenticated = computed(() => Boolean(getToken()));
  const tenantStore = useTenantStore();
  let signOutPromise: Promise<void> | null = null;
  let currentUserPromise: Promise<PortalUser | null> | null = null;
  let authVersion = 0;

  function clearLocalAuthState(): void {
    authVersion += 1;
    currentUserPromise = null;
    clearSession();
    tenantStore.reset();
    user.value = null;
    telemetry.clearUser();
  }

  async function signIn(username: string, password: string): Promise<void> {
    authVersion += 1;
    currentUserPromise = null;
    loading.value = true;
    tenantStore.reset();
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

  function loadCurrentUser(): Promise<PortalUser | null> {
    if (!getToken()) {
      user.value = null;
      clearLocalAuthState();
      return Promise.resolve(null);
    }
    if (currentUserPromise) return currentUserPromise;

    const version = authVersion;
    loading.value = true;
    let request: Promise<PortalUser | null>;
    request = (async () => {
      try {
        const currentUser = await getCurrentUser();
        if (version !== authVersion) return user.value;
        if (user.value?.id && user.value.id !== currentUser.id) {
          tenantStore.reset();
        }
        user.value = currentUser;
        saveUser(currentUser);
        telemetry.identify({ userId: currentUser.id });
        return currentUser;
      } finally {
        if (version === authVersion) loading.value = false;
      }
    })();
    currentUserPromise = request;
    const clearRequest = (): void => {
      if (currentUserPromise === request) currentUserPromise = null;
    };
    request.then(clearRequest, clearRequest);
    return request;
  }

  async function signOut(): Promise<void> {
    if (signOutPromise) return signOutPromise;

    signOutPromise = (async () => {
      try {
        if (getToken()) await logout();
      } finally {
        clearLocalAuthState();
      }
    })();

    try {
      await signOutPromise;
    } finally {
      signOutPromise = null;
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
