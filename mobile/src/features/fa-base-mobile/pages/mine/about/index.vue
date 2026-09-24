<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { APP_CONFIG } from '@/app.config';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';
import { DEMO_ENTRY_STORAGE_KEY } from '../../../feature';
import {
  getCurrentAppVersion,
  getCurrentWgtVersion,
  type AppVersion,
} from '@features/fa-core-mobile/update';
import { checkAndPromptUpdate } from '../../../common/update';

const apkVersion = ref<AppVersion>(getCurrentAppVersion());
const wgtVersion = ref<AppVersion>({ ...apkVersion.value });
const checking = ref(false);
let logoTapCount = 0;

function handleLogoTap(): void {
  logoTapCount += 1;
  if (logoTapCount < 7) return;

  logoTapCount = 0;
  const enabled = uni.getStorageSync(DEMO_ENTRY_STORAGE_KEY) !== true;
  uni.setStorageSync(DEMO_ENTRY_STORAGE_KEY, enabled);
  uni.showToast({ title: enabled ? 'Demo 入口已开启' : 'Demo 入口已关闭', icon: 'none' });
}

async function loadVersionInfo(): Promise<void> {
  apkVersion.value = getCurrentAppVersion();
  wgtVersion.value = await getCurrentWgtVersion();
}

async function handleCheckUpdate(): Promise<void> {
  if (checking.value) return;
  checking.value = true;
  try {
    await checkAndPromptUpdate({ manual: true });
    await loadVersionInfo();
  } finally {
    checking.value = false;
  }
}

onShow(() => {
  void loadVersionInfo();
});
</script>

<template>
  <MobileThemeRoot>
    <view class="about-page fa-page">
      <view class="about-header">
        <view class="about-logo" @tap="handleLogoTap">FA</view>
        <text class="about-name">{{ APP_CONFIG.name }}</text>
        <text class="about-description">应用版本与资源更新信息</text>
      </view>

      <view class="about-card fa-card">
        <view class="about-version-row">
          <view class="about-version-copy">
            <text class="about-version-title">APK 版本</text>
            <text class="about-version-description">Android 原生安装包版本</text>
          </view>
          <text class="about-version-value">
            {{ apkVersion.versionName }} ({{ apkVersion.versionCode }})
          </text>
        </view>
        <view class="about-version-row">
          <view class="about-version-copy">
            <text class="about-version-title">WGT 版本</text>
            <text class="about-version-description">当前运行的前端资源包版本</text>
          </view>
          <text class="about-version-value">
            {{ wgtVersion.versionName }} ({{ wgtVersion.versionCode }})
          </text>
        </view>
      </view>

      <button
        class="about-update-button"
        :class="{ 'about-update-button--loading': checking }"
        :disabled="checking"
        :loading="checking"
        @tap="handleCheckUpdate"
      >
        {{ checking ? '正在检查...' : '检查更新' }}
      </button>
      <text class="about-update-hint">检查时将优先处理 APK 更新，再检查 WGT 更新</text>
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
}

.about-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 36rpx 0 32rpx;
}

.about-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  border-radius: 28rpx;
  background: var(--fa-color-primary);
  color: var(--fa-color-text-inverse);
  font-size: 38rpx;
  font-weight: 700;
}

.about-name,
.about-description,
.about-version-title,
.about-version-description,
.about-version-value,
.about-update-hint {
  display: block;
}

.about-name {
  margin-top: 20rpx;
  color: var(--fa-color-text);
  font-size: 36rpx;
  font-weight: 700;
  line-height: 50rpx;
}

.about-description {
  margin-top: 6rpx;
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 34rpx;
}

.about-card {
  padding: 0 32rpx;
}

.about-version-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 116rpx;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.about-version-row:last-child {
  border-bottom: 0;
}

.about-version-copy {
  min-width: 0;
  padding: 20rpx 0;
}

.about-version-title {
  color: var(--fa-color-text);
  font-size: 29rpx;
  line-height: 42rpx;
}

.about-version-description {
  margin-top: 4rpx;
  color: var(--fa-color-muted);
  font-size: 23rpx;
  line-height: 32rpx;
}

.about-version-value {
  flex: 0 0 auto;
  margin-left: 24rpx;
  color: var(--fa-color-text);
  font-size: 27rpx;
  font-weight: 600;
  line-height: 38rpx;
}

.about-update-button {
  margin-top: 32rpx;
  border-radius: 18rpx;
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-primary);
  font-size: 30rpx;
}

.about-update-button.about-update-button--loading {
  border-color: var(--fa-color-primary);
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-primary);
  opacity: 1;
}

.about-update-hint {
  margin-top: 16rpx;
  color: var(--fa-color-muted);
  font-size: 23rpx;
  line-height: 34rpx;
  text-align: center;
}
</style>
