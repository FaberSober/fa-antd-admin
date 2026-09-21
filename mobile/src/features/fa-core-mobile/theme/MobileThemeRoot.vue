<script setup lang="ts">
import { useThemeStore } from './index';

const themeStore = useThemeStore();
</script>

<template>
  <view
    class="mobile-theme-root"
    :class="`mobile-theme-root--${themeStore.mode}`"
    :data-theme="themeStore.mode"
  >
    <slot />
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
