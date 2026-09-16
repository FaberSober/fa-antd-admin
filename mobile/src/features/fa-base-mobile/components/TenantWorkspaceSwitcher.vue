<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TenantWorkspace } from '../types/tenant';

const props = defineProps<{
  workspaces: readonly TenantWorkspace[];
  currentWorkspace: TenantWorkspace | null;
  loading: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  (event: 'select', tenantId: string): void;
  (event: 'refresh'): void;
}>();

const visible = ref(false);
const canOpen = computed(() => props.workspaces.length !== 1 || props.loading || Boolean(props.errorMessage));

function workspaceName(workspace: TenantWorkspace | null): string {
  return workspace?.tenantName?.trim() || workspace?.tenantId || '未选择工作空间';
}

function avatarText(workspace: TenantWorkspace | null): string {
  return workspaceName(workspace).slice(0, 1).toUpperCase();
}

function unreadBadge(count: number): string {
  return count > 99 ? '99+' : String(count);
}

function open(): void {
  if (canOpen.value) visible.value = true;
}

function close(): void {
  visible.value = false;
}

function selectWorkspace(tenantId: string): void {
  emit('select', tenantId);
  close();
}

function refresh(): void {
  emit('refresh');
}
</script>

<template>
  <view class="workspace-switcher">
    <view class="current-workspace fa-card" :class="{ 'is-disabled': !canOpen }" @click="open">
      <view class="workspace-avatar">{{ avatarText(currentWorkspace) }}</view>
      <view class="workspace-copy">
        <text class="workspace-label">当前工作空间</text>
        <text class="workspace-name">{{ workspaceName(currentWorkspace) }}</text>
      </view>
      <view class="workspace-summary">
        <text v-if="currentWorkspace && currentWorkspace.unreadCount > 0" class="unread-badge">
          {{ unreadBadge(currentWorkspace.unreadCount) }}
        </text>
        <text v-if="canOpen" class="workspace-chevron">⌄</text>
      </view>
    </view>

    <view v-if="errorMessage" class="workspace-error">
      <text class="workspace-error-text">{{ errorMessage }}</text>
      <button class="workspace-retry" @click="refresh">重试</button>
    </view>

    <view v-if="visible" class="workspace-mask" @click="close">
      <view class="workspace-sheet" @click.stop>
        <view class="sheet-header">
          <text class="sheet-title">切换工作空间</text>
          <text class="sheet-close" @click="close">×</text>
        </view>
        <text class="sheet-description">选择后，后续业务数据将切换到对应租户。</text>

        <scroll-view scroll-y class="workspace-list">
          <view v-if="loading" class="workspace-state">正在加载工作空间...</view>
          <view v-else-if="!workspaces.length" class="workspace-state">暂无可用工作空间</view>
          <template v-else>
            <view
              v-for="workspace in workspaces"
              :key="workspace.tenantId"
              class="workspace-item"
              :class="{ 'is-selected': workspace.tenantId === currentWorkspace?.tenantId }"
              @click="selectWorkspace(workspace.tenantId)"
            >
              <view class="workspace-avatar workspace-avatar-small">{{ avatarText(workspace) }}</view>
              <view class="workspace-item-main">
                <text class="workspace-item-name">{{ workspaceName(workspace) }}</text>
                <text v-if="workspace.description" class="workspace-item-description">{{ workspace.description }}</text>
              </view>
              <text v-if="workspace.unreadCount > 0" class="unread-badge">
                {{ unreadBadge(workspace.unreadCount) }}
              </text>
              <text v-if="workspace.tenantId === currentWorkspace?.tenantId" class="workspace-check">✓</text>
            </view>
          </template>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.workspace-switcher {
  margin-bottom: 32rpx;
}

.current-workspace {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 28rpx;
}

.current-workspace.is-disabled {
  opacity: 0.9;
}

.workspace-avatar {
  flex: 0 0 auto;
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff, #7c3aed);
  font-size: 40rpx;
  font-weight: 600;
  line-height: 88rpx;
  text-align: center;
}

.workspace-avatar-small {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  font-size: 32rpx;
  line-height: 72rpx;
}

.workspace-copy,
.workspace-item-main {
  min-width: 0;
  flex: 1;
}

.workspace-label,
.workspace-name,
.workspace-item-name,
.workspace-item-description {
  display: block;
}

.workspace-label {
  margin-bottom: 8rpx;
  color: var(--fa-color-muted);
  font-size: 22rpx;
}

.workspace-name,
.workspace-item-name {
  overflow: hidden;
  font-size: 30rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-summary {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.unread-badge {
  min-width: 34rpx;
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  color: #ffffff;
  background: #ef4444;
  font-size: 20rpx;
  line-height: 28rpx;
  text-align: center;
}

.workspace-chevron {
  color: var(--fa-color-muted);
  font-size: 36rpx;
}

.workspace-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-top: 16rpx;
  padding: 0 8rpx;
}

.workspace-error-text {
  flex: 1;
  color: #dc2626;
  font-size: 24rpx;
}

.workspace-retry {
  flex: 0 0 auto;
  width: 120rpx;
  margin: 0;
  color: var(--fa-color-primary);
  background: transparent;
  font-size: 24rpx;
}

.workspace-mask {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  background: rgba(15, 23, 42, 0.45);
}

.workspace-sheet {
  width: 100%;
  box-sizing: border-box;
  padding: 32rpx 32rpx calc(32rpx + env(safe-area-inset-bottom));
  border-radius: 32rpx 32rpx 0 0;
  background: var(--fa-color-card);
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sheet-title {
  font-size: 36rpx;
  font-weight: 600;
}

.sheet-close {
  padding: 0 12rpx;
  color: var(--fa-color-muted);
  font-size: 48rpx;
  line-height: 48rpx;
}

.sheet-description {
  display: block;
  margin-top: 8rpx;
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.workspace-list {
  height: 520rpx;
  max-height: 60vh;
  margin-top: 24rpx;
}

.workspace-state {
  padding: 96rpx 0;
  color: var(--fa-color-muted);
  text-align: center;
}

.workspace-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 20rpx 16rpx;
  border-radius: 20rpx;
}

.workspace-item.is-selected {
  background: #eff6ff;
}

.workspace-item-name {
  font-size: 30rpx;
  font-weight: 500;
}

.workspace-item-description {
  overflow: hidden;
  margin-top: 6rpx;
  color: var(--fa-color-muted);
  font-size: 22rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-check {
  color: var(--fa-color-primary);
  font-size: 34rpx;
  font-weight: 600;
}
</style>
