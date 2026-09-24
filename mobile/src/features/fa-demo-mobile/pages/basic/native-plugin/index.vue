<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { hasToken } from '@features/fa-base-mobile/common/session';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const LOGIN_ROUTE = '/features/fa-base-mobile/pages/login/index';

interface NativeDemoPlugin {
  showToast(message: string): void;
}

let nativeDemoPlugin: NativeDemoPlugin | null = null;

// #ifdef APP-PLUS
nativeDemoPlugin = uni.requireNativePlugin('FaNativeDemo') as NativeDemoPlugin;
// #endif

function ensureAuthenticated(): void {
  if (!hasToken()) {
    uni.reLaunch({ url: LOGIN_ROUTE });
  }
}

function showNativeToast(): void {
  if (!nativeDemoPlugin) {
    uni.showToast({ title: '当前平台不支持原生插件', icon: 'none' });
    return;
  }

  nativeDemoPlugin.showToast('Toast 来自 Android 原生插件');
}

onShow(() => {
  telemetry.page('/features/fa-demo-mobile/pages/basic/native-plugin/index');
  ensureAuthenticated();
});
</script>

<template>
  <view class="plugin-page fa-page">
    <view class="page-heading">
      <text class="page-title">原生插件</text>
      <text class="page-subtitle">通过 uni.requireNativePlugin 调用 Android UniModule</text>
    </view>

    <view class="demo-section fa-card">
      <text class="section-title">Toast 示例</text>
      <text class="section-description">将消息传入原生模块，由 Android Toast 显示。</text>
      <button class="demo-button demo-button--primary" @tap="showNativeToast">显示原生 Toast</button>
    </view>
  </view>
</template>

<style scoped>
.plugin-page {
  padding-top: 56rpx;
  padding-bottom: 72rpx;
}

.page-heading {
  margin: 0 8rpx 32rpx;
}

.page-title,
.page-subtitle,
.section-title,
.section-description {
  display: block;
}

.page-title {
  margin-bottom: 12rpx;
  font-size: 48rpx;
  font-weight: 700;
}

.page-subtitle,
.section-description {
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.demo-section {
  padding: 32rpx;
}

.section-title {
  margin-bottom: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.section-description {
  margin-bottom: 24rpx;
}

.demo-button {
  margin: 0;
  font-size: 28rpx;
}

.demo-button--primary {
  color: #ffffff;
  background: var(--fa-color-primary);
}
</style>
