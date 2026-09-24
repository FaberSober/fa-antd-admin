<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { hasToken } from '@features/fa-base-mobile/common/session';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const LOGIN_ROUTE = '/features/fa-base-mobile/pages/login/index';
const BUTTON_DEMO_ROUTE = '/features/fa-demo-mobile/pages/basic/button/index';
const UPLOAD_DEMO_ROUTE = '/features/fa-demo-mobile/pages/basic/upload/index';
const NATIVE_PLUGIN_DEMO_ROUTE = '/features/fa-demo-mobile/pages/basic/native-plugin/index';
const REMOTE_LOG_DEMO_ROUTE = '/features/fa-demo-mobile/pages/diagnostics/remote-log/index';

function ensureAuthenticated(): void {
  if (!hasToken()) {
    uni.reLaunch({ url: LOGIN_ROUTE });
  }
}

function openButtonDemo(): void {
  uni.navigateTo({ url: BUTTON_DEMO_ROUTE });
}

function openUploadDemo(): void {
  uni.navigateTo({ url: UPLOAD_DEMO_ROUTE });
}

function openNativePluginDemo(): void {
  uni.navigateTo({ url: NATIVE_PLUGIN_DEMO_ROUTE });
}

function openRemoteLogDemo(): void {
  uni.navigateTo({ url: REMOTE_LOG_DEMO_ROUTE });
}

onShow(() => {
  telemetry.page('/features/fa-demo-mobile/pages/home/index');
  ensureAuthenticated();
});
</script>

<template>
  <MobileThemeRoot>
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
        <button class="entry-button" @tap="openButtonDemo">查看 Demo</button>
      </view>

      <view class="demo-entry fa-card">
        <view>
          <text class="entry-title">文件上传</text>
          <text class="entry-description">选择图片并上传到后端文件服务</text>
        </view>
        <button class="entry-button" @tap="openUploadDemo">查看 Demo</button>
      </view>

      <view class="demo-entry fa-card">
        <view>
          <text class="entry-title">原生插件</text>
          <text class="entry-description">调用 Android 原生模块显示 Toast</text>
        </view>
        <button class="entry-button" @tap="openNativePluginDemo">查看 Demo</button>
      </view>

      <view class="demo-entry fa-card">
        <view>
          <text class="entry-title">远程日志</text>
          <text class="entry-description">触发 Console、运行时异常、Promise 拒绝和脱敏样例</text>
        </view>
        <button class="entry-button" @tap="openRemoteLogDemo">查看 Demo</button>
      </view>
    </view>
  </MobileThemeRoot>
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
  width: 220rpx;
  margin: 0;
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-primary);
  font-size: 26rpx;
  white-space: nowrap;
}
</style>
