import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getCurrentUser, login, logout } from '../api/auth';
import { clearSession, getStoredUser, getToken, saveSession, saveUser } from '../common/session';
import type { PortalUser } from '../types/auth';

export const useAuthStore = defineStore('fa-base-mobile-auth', () => {
  const user = ref<PortalUser | null>(getStoredUser());
  const loading = ref(false);
  const isAuthenticated = computed(() => Boolean(getToken()));

  async function signIn(username: string, password: string): Promise<void> {
    loading.value = true;
    try {
      const session = await login(username, password);
      saveSession(session.token, session.user);
      user.value = session.user;
    } finally {
      loading.value = false;
    }
  }

  async function loadCurrentUser(): Promise<PortalUser | null> {
    if (!getToken()) {
      user.value = null;
      return null;
    }

    loading.value = true;
    try {
      const currentUser = await getCurrentUser();
      user.value = currentUser;
      saveUser(currentUser);
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
      user.value = null;
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
