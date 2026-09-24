<script setup lang="ts">
import { finishUpdatePrompt, updatePromptState } from './prompt';

const prompt = updatePromptState;
</script>

<template>
  <view v-if="prompt" class="update-prompt-mask">
    <view class="update-prompt-card">
      <template v-if="prompt.kind === 'confirm'">
        <view class="update-prompt-heading">
          <text class="update-prompt-eyebrow">版本更新</text>
          <text v-if="prompt.forceUpdate" class="update-prompt-required">必须更新</text>
        </view>
        <text class="update-prompt-title">{{ prompt.title }}</text>
        <view class="update-prompt-meta">
          <text v-if="prompt.versionName" class="update-prompt-version">{{ prompt.versionName }}</text>
          <text class="update-prompt-package">{{ prompt.packageName }}</text>
        </view>
        <scroll-view scroll-y class="update-prompt-description">
          <text>{{ prompt.description }}</text>
        </scroll-view>
        <view class="update-prompt-actions">
          <button
            v-if="prompt.showCancel"
            class="update-prompt-button update-prompt-button--secondary"
            @tap.stop="finishUpdatePrompt(false)"
          >
            {{ prompt.cancelText }}
          </button>
          <button
            class="update-prompt-button update-prompt-button--primary"
            :class="{ 'update-prompt-button--full': !prompt.showCancel }"
            @tap.stop="finishUpdatePrompt(true)"
          >
            {{ prompt.confirmText }}
          </button>
        </view>
      </template>

      <template v-else>
        <text class="update-prompt-eyebrow">{{ prompt.phase === 'VERIFYING' ? '安全校验' : '版本更新' }}</text>
        <text class="update-prompt-title">
          {{ prompt.phase === 'VERIFYING' ? '正在校验安装包' : '正在下载更新' }}
        </text>
        <view class="update-prompt-meta">
          <text v-if="prompt.versionName" class="update-prompt-version">{{ prompt.versionName }}</text>
          <text class="update-prompt-package">{{ prompt.packageName }}</text>
        </view>
        <view class="update-progress-summary">
          <text class="update-progress-label">
            {{ prompt.phase === 'VERIFYING' ? '正在校验文件完整性' : '下载进度' }}
          </text>
          <text class="update-progress-value">{{ prompt.progress }}%</text>
        </view>
        <view
          class="update-progress-track"
          role="progressbar"
          :aria-valuenow="prompt.progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="prompt.phase === 'VERIFYING' ? '正在校验安装包' : '更新包下载进度'"
        >
          <view class="update-progress-fill" :style="{ width: `${prompt.progress}%` }" />
        </view>
        <text class="update-progress-hint">请保持网络连接，完成后将提示安装</text>
      </template>
    </view>
  </view>
</template>

<style scoped>
.update-prompt-mask {
  position: fixed;
  z-index: 99999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: calc(32rpx + var(--fa-safe-area-top)) 32rpx calc(32rpx + var(--fa-safe-area-bottom));
  background: var(--fa-color-mask);
}

.update-prompt-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640rpx;
  max-height: calc(100vh - 64rpx - var(--fa-safe-area-top) - var(--fa-safe-area-bottom));
  box-sizing: border-box;
  padding: 36rpx;
  overflow: hidden;
  border: 1rpx solid var(--fa-color-border);
  border-radius: 28rpx;
  background: var(--fa-color-card);
  box-shadow: var(--fa-shadow-elevated);
}

.update-prompt-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.update-prompt-eyebrow,
.update-prompt-required,
.update-prompt-version,
.update-prompt-package,
.update-progress-label,
.update-progress-value,
.update-progress-hint {
  display: block;
}

.update-prompt-eyebrow {
  color: var(--fa-color-primary);
  font-size: 24rpx;
  font-weight: 600;
  line-height: 34rpx;
}

.update-prompt-required {
  padding: 6rpx 14rpx;
  border-radius: var(--fa-radius-pill);
  background: var(--fa-color-danger-soft);
  color: var(--fa-color-danger);
  font-size: 22rpx;
  line-height: 30rpx;
}

.update-prompt-title {
  display: block;
  margin-top: 14rpx;
  color: var(--fa-color-text);
  font-size: 38rpx;
  font-weight: 700;
  line-height: 52rpx;
}

.update-prompt-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}

.update-prompt-version,
.update-prompt-package {
  padding: 8rpx 16rpx;
  border-radius: var(--fa-radius-pill);
  font-size: 23rpx;
  line-height: 32rpx;
}

.update-prompt-version {
  background: var(--fa-color-primary-soft);
  color: var(--fa-color-primary);
  font-weight: 600;
}

.update-prompt-package {
  background: var(--fa-color-surface-muted);
  color: var(--fa-color-text-secondary);
}

.update-prompt-description {
  height: 260rpx;
  box-sizing: border-box;
  margin-top: 24rpx;
  padding: 22rpx 24rpx;
  border-radius: var(--fa-radius-md);
  background: var(--fa-color-surface-muted);
  color: var(--fa-color-text-secondary);
  font-size: 27rpx;
  line-height: 42rpx;
  white-space: pre-wrap;
}

.update-prompt-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.update-prompt-button {
  flex: 1;
  min-width: 0;
  height: 88rpx;
  margin: 0;
  border-radius: var(--fa-radius-md);
  font-size: 28rpx;
  font-weight: 600;
  line-height: 88rpx;
}

.update-prompt-button--secondary {
  border: 1rpx solid var(--fa-color-border-strong);
  background: var(--fa-color-card);
  color: var(--fa-color-text-secondary);
}

.update-prompt-button--primary {
  background: var(--fa-color-primary);
  color: var(--fa-color-text-inverse);
}

.update-prompt-button--full {
  flex-basis: 100%;
}

.update-progress-summary {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 42rpx;
}

.update-progress-label {
  color: var(--fa-color-text-secondary);
  font-size: 25rpx;
  line-height: 36rpx;
}

.update-progress-value {
  color: var(--fa-color-primary);
  font-size: 36rpx;
  font-weight: 700;
  line-height: 46rpx;
  font-variant-numeric: tabular-nums;
}

.update-progress-track {
  height: 16rpx;
  margin-top: 18rpx;
  overflow: hidden;
  border-radius: var(--fa-radius-pill);
  background: var(--fa-color-border);
}

.update-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--fa-color-primary), var(--fa-color-primary-gradient-end));
  transition: width 180ms ease-out;
}

.update-progress-hint {
  margin-top: 20rpx;
  color: var(--fa-color-muted);
  font-size: 23rpx;
  line-height: 34rpx;
}

.update-prompt-button:active {
  opacity: 0.82;
}
</style>
