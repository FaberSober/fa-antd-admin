<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { hasToken } from '@features/fa-base-mobile/common/session';
import { telemetry } from '@/telemetry';

const LOGIN_ROUTE = '/features/fa-base-mobile/pages/login/index';
const BUTTON_DEMO_ROUTE = '/features/fa-demo-mobile/pages/basic/button/index';

function ensureAuthenticated(): void {
  if (!hasToken()) {
    uni.reLaunch({ url: LOGIN_ROUTE });
  }
}

function openButtonDemo(): void {
  uni.navigateTo({ url: BUTTON_DEMO_ROUTE });
}

onShow(() => {
  telemetry.page('/features/fa-demo-mobile/pages/home/index');
  ensureAuthenticated();
});
</script>

<template>
  <view class="demo-page fa-page">
    <view class="demo-heading">
      <text class="demo-title">移动端 Demo</text>
      <text class="demo-subtitle">按页面查看 uni-app 原生组件示例</text>
    </view>

    <view class="demo-entry fa-card">
      <view>
        <text class="entry-title">按钮样式</text>
        <text class="entry-description">查看基础类型、尺寸、状态和镂空样式</text>
      </view>
      <button class="entry-button" @click="openButtonDemo">查看 Demo</button>
    </view>
  </view>
</template>

<style scoped>
.demo-page {
  padding-top: 56rpx;
}

.demo-heading {
  margin: 0 8rpx 32rpx;
}

.demo-title,
.demo-subtitle,
.entry-title,
.entry-description {
  display: block;
}

.demo-title {
  margin-bottom: 12rpx;
  font-size: 48rpx;
  font-weight: 700;
}

.demo-subtitle,
.entry-description {
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.demo-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
}

.entry-title {
  margin-bottom: 10rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.entry-button {
  flex: 0 0 auto;
  width: 188rpx;
  margin: 0;
  color: #ffffff;
  background: var(--fa-color-primary);
  font-size: 26rpx;
}
</style>
