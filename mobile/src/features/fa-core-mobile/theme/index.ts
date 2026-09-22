import { ref } from 'vue';
import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark';

export const THEME_MODE_STORAGE_KEY = 'fa.mobile.theme-mode';
export const THEME_DANGER_COLORS: Record<ThemeMode, string> = {
  light: '#ef4444',
  dark: '#f87171',
};
export const THEME_NAVIGATION_BAR_COLORS: Record<ThemeMode, {
  backgroundColor: string;
  frontColor: '#000000' | '#ffffff';
}> = {
  light: {
    backgroundColor: '#f5f7fb',
    frontColor: '#000000',
  },
  dark: {
    backgroundColor: '#0e1420',
    frontColor: '#ffffff',
  },
};

function readStoredThemeMode(): ThemeMode {
  return uni.getStorageSync(THEME_MODE_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

export function syncThemeNavigationBar(mode: ThemeMode): void {
  uni.setNavigationBarColor(THEME_NAVIGATION_BAR_COLORS[mode]);
}

export const useThemeStore = defineStore('fa-core-mobile-theme', () => {
  const mode = ref<ThemeMode>(readStoredThemeMode());

  function syncNavigationBar(): void {
    syncThemeNavigationBar(mode.value);
  }

  function setMode(nextMode: ThemeMode): void {
    mode.value = nextMode;
    uni.setStorageSync(THEME_MODE_STORAGE_KEY, nextMode);
    syncNavigationBar();
  }

  return {
    mode,
    setMode,
    syncNavigationBar,
  };
});
