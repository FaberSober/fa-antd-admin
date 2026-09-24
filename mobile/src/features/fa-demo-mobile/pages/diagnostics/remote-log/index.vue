<script setup lang="ts">
import { onHide, onShow } from '@dcloudio/uni-app';
import { hasToken } from '@features/fa-base-mobile/common/session';
import { remoteClientConnection } from '@features/fa-core-mobile/common/remote-client';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import { ref } from 'vue';

const LOGIN_ROUTE = '/features/fa-base-mobile/pages/login/index';
const PAGE_ROUTE = '/features/fa-demo-mobile/pages/diagnostics/remote-log/index';
const lastTriggered = ref('尚未触发');
const connectionStatus = ref(remoteClientConnection.getStatus());
const connectionLabels = {
  connected: '已连接',
  connecting: '连接中',
  reconnecting: '重连中',
  disconnected: '未连接',
};
let statusTimer: ReturnType<typeof setInterval> | undefined;

function ensureAuthenticated(): void {
  if (!hasToken()) {
    uni.reLaunch({ url: LOGIN_ROUTE });
  }
}

function triggerConsoleSamples(): void {
  console.debug('[RemoteLogDemo] DEBUG');
  console.log('[RemoteLogDemo] LOG');
  console.info('[RemoteLogDemo] INFO');
  console.warn('[RemoteLogDemo] WARN');
  console.error('[RemoteLogDemo] ERROR');
  console.info('[RemoteLogDemo] 脱敏样例', {
    password: 'DEMO_PASSWORD_123',
    accessToken: 'DEMO_ACCESS_TOKEN_123',
    nested: { cookie: 'DEMO_COOKIE_123' },
    authorization: 'Bearer DEMO_BEARER_TOKEN_123',
    url: 'https://example.invalid/debug?token=DEMO_QUERY_TOKEN_123',
  });
  lastTriggered.value = '已触发五种 Console 级别和脱敏样例';
}

function triggerUncaughtError(): void {
  lastTriggered.value = '已触发未捕获运行时异常';
  setTimeout(() => {
    throw new Error('[RemoteLogDemo] uncaught runtime error');
  }, 0);
}

function triggerUnhandledRejection(): void {
  lastTriggered.value = '已触发未处理 Promise 拒绝';
  void Promise.reject(new Error('[RemoteLogDemo] unhandled promise rejection'));
}

function triggerLargeLog(): void {
  const fields = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [`field${index}`, 'remote-log-demo-'.repeat(60)]),
  );
  console.info('[RemoteLogDemo] 长日志截断样例', fields);
  lastTriggered.value = '已触发长日志截断样例';
}

function refreshConnectionStatus(): void {
  connectionStatus.value = remoteClientConnection.getStatus();
}

function stopStatusRefresh(): void {
  if (statusTimer) clearInterval(statusTimer);
  statusTimer = undefined;
}

onShow(() => {
  telemetry.page(PAGE_ROUTE);
  ensureAuthenticated();
  stopStatusRefresh();
  refreshConnectionStatus();
  statusTimer = setInterval(refreshConnectionStatus, 1_000);
});

onHide(stopStatusRefresh);
</script>

<template>
  <MobileThemeRoot>
    <view class="remote-log-page fa-page">
      <view class="page-heading">
        <text class="page-title">远程日志 Demo</text>
        <text class="page-subtitle">先在管理端开启本设备采集，再点按按钮触发日志</text>
      </view>

      <view class="status-card fa-card">
        <text class="section-title">远程连接状态</text>
        <view class="status-row">
          <text>WebSocket</text>
          <view class="status-result">
            <view :class="['status-dot', `status-dot--${connectionStatus.connectionState}`]" />
            <text>{{ connectionLabels[connectionStatus.connectionState] }}</text>
          </view>
        </view>
        <view class="status-row">
          <text>日志采集</text>
          <view class="status-result">
            <view :class="['status-dot', connectionStatus.captureActive ? 'status-dot--connected' : 'status-dot--disconnected']" />
            <text>{{ connectionStatus.captureActive ? '采集中' : '未开启' }}</text>
          </view>
        </view>
        <text class="status-note">页面显示时每秒刷新一次；采集需由管理端开启。</text>
      </view>

      <view class="demo-section fa-card">
        <text class="section-title">Console 与脱敏</text>
        <text class="section-description">依次输出 DEBUG、LOG、INFO、WARN、ERROR，并包含虚构敏感字段。</text>
        <button class="demo-button demo-button--primary" @tap="triggerConsoleSamples">触发 Console 样例</button>
      </view>

      <view class="demo-section fa-card">
        <text class="section-title">运行时异常</text>
        <text class="section-description">通过异步 throw 触发 App 未捕获异常上报。</text>
        <button class="demo-button demo-button--warn" @tap="triggerUncaughtError">触发未捕获异常</button>
      </view>

      <view class="demo-section fa-card">
        <text class="section-title">Promise 拒绝</text>
        <text class="section-description">触发未处理的 Promise rejection 上报。</text>
        <button class="demo-button demo-button--warn" @tap="triggerUnhandledRejection">触发 Promise 拒绝</button>
      </view>

      <view class="demo-section fa-card">
        <text class="section-title">日志长度限制</text>
        <text class="section-description">输出超过单条限制的测试对象，确认远程消息会被截断。</text>
        <button class="demo-button" @tap="triggerLargeLog">触发长日志</button>
      </view>

      <view class="result-card fa-card">
        <text class="result-label">最近触发</text>
        <text class="result-value">{{ lastTriggered }}</text>
        <text class="result-note">样例仅包含 DEMO 虚构值，不要在此页面输出真实凭证。</text>
      </view>
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.remote-log-page {
  padding-top: 48rpx;
  padding-bottom: 72rpx;
}

.page-heading {
  margin: 0 8rpx 28rpx;
}

.page-title,
.page-subtitle,
.section-title,
.section-description,
.result-label,
.result-value,
.result-note {
  display: block;
}

.page-title {
  margin-bottom: 12rpx;
  font-size: 44rpx;
  font-weight: 700;
}

.page-subtitle,
.section-description,
.result-note {
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 1.6;
}

.demo-section,
.result-card,
.status-card {
  margin-bottom: 20rpx;
  padding: 28rpx;
}

.section-title,
.result-label {
  margin-bottom: 8rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.section-description {
  margin-bottom: 20rpx;
}

.status-row,
.status-result {
  display: flex;
  align-items: center;
}

.status-row {
  justify-content: space-between;
  margin-top: 18rpx;
  font-size: 28rpx;
}

.status-result {
  gap: 12rpx;
  color: var(--fa-color-muted);
}

.status-note {
  display: block;
  margin-top: 20rpx;
  color: var(--fa-color-muted);
  font-size: 22rpx;
}

.status-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}

.status-dot--connected {
  background: #16a34a;
}

.status-dot--connecting,
.status-dot--reconnecting {
  background: #f59e0b;
}

.status-dot--disconnected {
  background: #9ca3af;
}

.demo-button {
  margin: 0;
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

.result-value {
  margin-bottom: 8rpx;
  font-size: 28rpx;
}
</style>
