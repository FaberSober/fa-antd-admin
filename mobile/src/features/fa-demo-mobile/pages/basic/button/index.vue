<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { hasToken } from '@features/fa-base-mobile/common/session';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const LOGIN_ROUTE = '/features/fa-base-mobile/pages/login/index';

function ensureAuthenticated(): void {
  if (!hasToken()) {
    uni.reLaunch({ url: LOGIN_ROUTE });
  }
}

onShow(() => {
  telemetry.page('/features/fa-demo-mobile/pages/basic/button/index');
  ensureAuthenticated();
});
</script>

<template>
  <MobileThemeRoot>
    <view class="button-page fa-page">
      <view class="page-heading">
        <text class="page-title">按钮样式</text>
        <text class="page-subtitle">使用 uni-app 原生 button 展示常用状态</text>
      </view>

      <view class="demo-section fa-card">
        <text class="section-title">基础类型</text>
        <button class="demo-button demo-button--primary">Primary</button>
        <button class="demo-button">Default</button>
        <button class="demo-button demo-button--warn">Warn</button>
      </view>

      <view class="demo-section fa-card">
        <text class="section-title">尺寸与样式</text>
        <button class="demo-button" size="mini">Mini Button</button>
        <button class="demo-button demo-button--primary demo-button--plain">Plain Button</button>
      </view>

      <view class="demo-section fa-card">
        <text class="section-title">交互状态</text>
        <button class="demo-button demo-button--primary" loading>Loading</button>
        <button class="demo-button demo-button--disabled" disabled>Disabled</button>
      </view>
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.button-page {
  padding-top: 56rpx;
  padding-bottom: 72rpx;
}

.page-heading {
  margin: 0 8rpx 32rpx;
}

.page-title,
.page-subtitle,
.section-title {
  display: block;
}

.page-title {
  margin-bottom: 12rpx;
  font-size: 48rpx;
  font-weight: 700;
}

.page-subtitle {
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.demo-section {
  margin-bottom: 24rpx;
  padding: 32rpx;
}

.section-title {
  margin-bottom: 24rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.demo-button {
  margin: 0 0 20rpx;
  color: var(--fa-color-text);
  border: 1rpx solid var(--fa-color-border);
  background: var(--fa-color-surface-muted);
  font-size: 28rpx;
}

.demo-button--primary {
  color: var(--fa-color-text-inverse);
  border-color: var(--fa-color-primary);
  background: var(--fa-color-primary);
}

.demo-button--warn {
  color: var(--fa-color-orange-contrast);
  border-color: var(--fa-color-orange);
  background: var(--fa-color-orange);
}

.demo-button--plain {
  color: var(--fa-color-primary);
  border: 1rpx solid var(--fa-color-primary);
  background: transparent;
}

.demo-button.demo-button--disabled {
  color: var(--fa-color-muted);
  border-color: var(--fa-color-border);
  background: var(--fa-color-surface-muted);
  opacity: 1;
}

.demo-button:last-child {
  margin-bottom: 0;
}
</style>
