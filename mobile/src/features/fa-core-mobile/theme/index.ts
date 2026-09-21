import { ref } from 'vue';
import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark';

export const THEME_MODE_STORAGE_KEY = 'fa.mobile.theme-mode';

function readStoredThemeMode(): ThemeMode {
  return uni.getStorageSync(THEME_MODE_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

export const useThemeStore = defineStore('fa-core-mobile-theme', () => {
  const mode = ref<ThemeMode>(readStoredThemeMode());

  function setMode(nextMode: ThemeMode): void {
    mode.value = nextMode;
    uni.setStorageSync(THEME_MODE_STORAGE_KEY, nextMode);
  }

  return {
    mode,
    setMode,
  };
});
