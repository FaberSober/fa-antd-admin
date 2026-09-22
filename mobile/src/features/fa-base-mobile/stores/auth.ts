import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getCurrentUser, login, logout } from '../api/auth';
import { clearSession, getStoredUser, getToken, saveSession, saveUser } from '../common/session';
import type { PortalUser } from '../types/auth';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import { useTenantStore } from './tenant';
import { useMessageStore } from './message';
import { useContactsStore } from './contacts';

export const useAuthStore = defineStore('fa-base-mobile-auth', () => {
  const user = ref<PortalUser | null>(getStoredUser());
  const loading = ref(false);
  const isAuthenticated = computed(() => Boolean(getToken()));
  const tenantStore = useTenantStore();
  const messageStore = useMessageStore();
  const contactsStore = useContactsStore();
  let signOutPromise: Promise<void> | null = null;

  function clearLocalAuthState(): void {
    clearSession();
    tenantStore.reset();
    messageStore.reset();
    contactsStore.reset();
    user.value = null;
    telemetry.clearUser();
  }

  async function signIn(username: string, password: string): Promise<void> {
    loading.value = true;
    tenantStore.reset();
    messageStore.reset();
    contactsStore.reset();
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
      clearLocalAuthState();
      return null;
    }

    loading.value = true;
    try {
      const currentUser = await getCurrentUser();
      if (user.value?.id && user.value.id !== currentUser.id) {
        tenantStore.reset();
        messageStore.reset();
        contactsStore.reset();
      }
      user.value = currentUser;
      saveUser(currentUser);
      telemetry.identify({ userId: currentUser.id });
      return currentUser;
    } finally {
      loading.value = false;
    }
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
