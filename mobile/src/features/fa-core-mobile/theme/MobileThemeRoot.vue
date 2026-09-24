<script setup lang="ts">
import { onActivated, onMounted, watch } from 'vue';
import { useThemeStore } from './index';
import { clientDebugLogs, clientDebugModeEnabled } from '../common/debug-mode';
// #ifdef APP-PLUS
import { updatePromptState } from '../update/prompt';
import UpdatePromptHost from '../update/UpdatePromptHost.vue';
import ErudaDebugConsole from '../debug/ErudaDebugConsole.vue';
// #endif

const themeStore = useThemeStore();

function syncNavigationBar(): void {
  themeStore.syncNavigationBar();
}

// #ifdef APP-PLUS
function handleErudaError(message: string): void {
  console.error('[FaMobile Debug] Eruda initialization failed', message);
  uni.showToast({ title: '调试面板启动失败', icon: 'none' });
}
// #endif

onMounted(syncNavigationBar);
onActivated(syncNavigationBar);
watch(() => themeStore.mode, syncNavigationBar);
</script>

<template>
  <view
    class="mobile-theme-root"
    :class="`mobile-theme-root--${themeStore.mode}`"
    :data-theme="themeStore.mode"
  >
    <slot />
    <!-- #ifdef APP-PLUS -->
    <UpdatePromptHost v-if="updatePromptState" />
    <ErudaDebugConsole
      :enabled="clientDebugModeEnabled"
      :logs="clientDebugLogs"
      @error="handleErudaError"
    />
    <!-- #endif -->
  </view>
</template>

<style scoped>
.mobile-theme-root {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  color: var(--fa-color-text);
  background: var(--fa-color-page);
}
</style>
