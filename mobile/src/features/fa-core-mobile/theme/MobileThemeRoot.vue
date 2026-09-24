<script setup lang="ts">
import { onActivated, onMounted, watch } from 'vue';
import { useThemeStore } from './index';
// #ifdef APP-PLUS
import { updatePromptState } from '../update/prompt';
import UpdatePromptHost from '../update/UpdatePromptHost.vue';
// #endif

const themeStore = useThemeStore();

function syncNavigationBar(): void {
  themeStore.syncNavigationBar();
}

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
