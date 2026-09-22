<script setup lang="ts">
import { computed } from 'vue';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';
import { useThemeStore, type ThemeMode } from '@features/fa-core-mobile/theme';

interface ThemeOption {
  mode: ThemeMode;
  title: string;
  description: string;
}

const THEME_OPTIONS: readonly ThemeOption[] = [
  { mode: 'light', title: '浅色模式', description: '明亮清晰，适合日间使用' },
  { mode: 'dark', title: '深色模式', description: '降低亮度，适合夜间使用' },
];

const themeStore = useThemeStore();
const currentThemeTitle = computed(() => (
  THEME_OPTIONS.find((option) => option.mode === themeStore.mode)?.title || '浅色模式'
));

function selectTheme(mode: ThemeMode): void {
  if (themeStore.mode !== mode) themeStore.setMode(mode);
}
</script>

<template>
  <MobileThemeRoot>
    <view class="appearance-page fa-page">
      <view class="appearance-intro">
        <text class="appearance-title">主题模式</text>
        <text class="appearance-description">选择后立即生效并自动保存</text>
      </view>

      <view class="appearance-card fa-card">
        <view
          v-for="option in THEME_OPTIONS"
          :key="option.mode"
          class="appearance-option"
          :class="{ 'appearance-option--active': themeStore.mode === option.mode }"
          @click="selectTheme(option.mode)"
        >
          <view class="appearance-option__copy">
            <text class="appearance-option__title">{{ option.title }}</text>
            <text class="appearance-option__description">{{ option.description }}</text>
          </view>
          <view
            class="appearance-option__indicator"
            :class="{ 'appearance-option__indicator--active': themeStore.mode === option.mode }"
          >
            <text v-if="themeStore.mode === option.mode">✓</text>
          </view>
        </view>
      </view>

      <view class="appearance-current fa-card">
        <text class="appearance-current__label">当前主题</text>
        <text class="appearance-current__value">{{ currentThemeTitle }}</text>
      </view>
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.appearance-page {
  min-height: 100vh;
}

.appearance-intro {
  margin: 8rpx 0 24rpx;
}

.appearance-title,
.appearance-description,
.appearance-option__title,
.appearance-option__description,
.appearance-current__label,
.appearance-current__value {
  display: block;
}

.appearance-title {
  color: var(--fa-color-text);
  font-size: 40rpx;
  font-weight: 700;
  line-height: 56rpx;
}

.appearance-description {
  margin-top: 8rpx;
  color: var(--fa-color-muted);
  font-size: 25rpx;
  line-height: 36rpx;
}

.appearance-card {
  padding: 0 32rpx;
}

.appearance-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 112rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.appearance-option:last-child {
  border-bottom: 0;
}

.appearance-option--active {
  color: var(--fa-color-primary);
}

.appearance-option__copy {
  min-width: 0;
  flex: 1;
  padding: 20rpx 0;
}

.appearance-option__title {
  color: var(--fa-color-text);
  font-size: 30rpx;
  line-height: 42rpx;
}

.appearance-option--active .appearance-option__title {
  color: var(--fa-color-primary);
  font-weight: 600;
}

.appearance-option__description {
  margin-top: 4rpx;
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 34rpx;
}

.appearance-option__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40rpx;
  height: 40rpx;
  margin-left: 24rpx;
  border: 2rpx solid var(--fa-color-border-strong);
  border-radius: 50%;
  color: var(--fa-color-text-inverse);
  font-size: 24rpx;
  line-height: 1;
}

.appearance-option__indicator--active {
  border-color: var(--fa-color-primary);
  background: var(--fa-color-primary);
}

.appearance-current {
  margin-top: 24rpx;
}

.appearance-current__label {
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 34rpx;
}

.appearance-current__value {
  margin-top: 8rpx;
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}
</style>
