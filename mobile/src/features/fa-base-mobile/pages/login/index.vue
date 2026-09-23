<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { ApiError } from '../../common/request';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';
import { APP_CONFIG } from '../../../../app.config';

const authStore = useAuthStore();
const username = ref(import.meta.env.DEV ? import.meta.env.VITE_APP_DEV_USERNAME || '' : '');
const password = ref(import.meta.env.DEV ? import.meta.env.VITE_APP_DEV_PASSWORD || '' : '');
const errorMessage = ref('');
const copyrightYear = new Date().getFullYear();
let serviceDomain = /^https?:\/\/[^/]+/.exec(APP_CONFIG.apiBaseUrl)?.[0] || APP_CONFIG.apiBaseUrl;

// #ifdef H5
if (APP_CONFIG.apiBaseUrl.startsWith('/')) {
  serviceDomain = window.location.origin;
}
// #endif

onShow(() => {
  telemetry.page('/features/fa-base-mobile/pages/login/index');
});

async function handleSubmit(): Promise<void> {
  errorMessage.value = '';

  if (!username.value.trim() || !password.value) {
    errorMessage.value = '请输入账号和密码';
    return;
  }

  try {
    await authStore.signIn(username.value.trim(), password.value);
    uni.reLaunch({ url: '/features/fa-base-mobile/pages/main/index' });
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '登录失败，请稍后重试';
  }
}
</script>

<template>
  <MobileThemeRoot>
    <view class="login-page fa-page">
      <view class="login-main">
        <view class="login-header">
          <text class="login-title">Fa Mobile</text>
          <text class="login-subtitle">移动端基础框架</text>
        </view>

        <view class="login-card fa-card">
          <view class="form-item">
            <text class="form-label">账号</text>
            <input
              v-model="username"
              class="form-input"
              type="text"
              placeholder="请输入账号"
              confirm-type="next"
            />
          </view>

          <view class="form-item">
            <text class="form-label">密码</text>
            <input
              v-model="password"
              class="form-input"
              type="password"
              placeholder="请输入密码"
              confirm-type="done"
              @confirm="handleSubmit"
            />
          </view>

          <text v-if="errorMessage" class="error-message">{{ errorMessage }}</text>

          <button
            class="login-button"
            :loading="authStore.loading"
            :disabled="authStore.loading"
            @tap="handleSubmit"
          >登录</button>
        </view>
      </view>

      <view class="login-footer">
        <text>© {{ copyrightYear }} {{ APP_CONFIG.name }} 版权所有</text>
        <text>版本 {{ APP_CONFIG.versionName }}</text>
        <text class="service-domain">服务域名：{{ serviceDomain }}</text>
      </view>
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}

.login-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 72rpx 0;
}

.login-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  color: var(--fa-color-muted);
  font-size: 22rpx;
  text-align: center;
}

.service-domain {
  word-break: break-all;
}

.login-header {
  margin: 0 16rpx 48rpx;
}

.login-title {
  display: block;
  margin-bottom: 12rpx;
  color: var(--fa-color-text);
  font-size: 64rpx;
  font-weight: 700;
}

.login-subtitle {
  color: var(--fa-color-muted);
  font-size: 28rpx;
}

.login-card {
  padding: 40rpx 32rpx;
}

.form-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.form-label {
  display: block;
  margin-bottom: 16rpx;
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.form-input {
  width: 100%;
  box-sizing: border-box;
  color: var(--fa-color-text);
  font-size: 30rpx;
}

.error-message {
  display: block;
  margin-top: 24rpx;
  color: var(--fa-color-danger);
  font-size: 24rpx;
}

.login-button {
  display: block;
  width: 100%;
  min-height: 88rpx;
  line-height: 88rpx;
  margin: 48rpx 0 0;
  border-radius: 999rpx;
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-primary);
  font-size: 30rpx;
}
</style>
