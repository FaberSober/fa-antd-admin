<template>
  <view class="mobile-theme-root">
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
