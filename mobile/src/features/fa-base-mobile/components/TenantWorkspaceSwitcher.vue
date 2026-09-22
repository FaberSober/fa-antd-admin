<script setup lang="ts">
import { computed, ref } from 'vue';
import MobileIcon from './MobileIcon.vue';
import type { TenantWorkspace } from '../types/tenant';

const props = withDefaults(defineProps<{
  workspaces: readonly TenantWorkspace[];
  currentWorkspace: TenantWorkspace | null;
  loading: boolean;
  errorMessage: string;
  switchingTenantId?: string | null;
}>(), {
  switchingTenantId: null,
});

const emit = defineEmits<{
  (event: 'select', tenantId: string): void;
  (event: 'refresh'): void;
}>();

const visible = ref(false);
const canOpen = computed(() => props.workspaces.length !== 1 || props.loading || Boolean(props.errorMessage));

function workspaceName(workspace: TenantWorkspace | null): string {
  return workspace?.tenantName?.trim() || workspace?.tenantId || '未选择租户';
}

function workspaceDescription(workspace: TenantWorkspace): string {
  return workspace.description?.trim() || (workspace.isAdmin ? '管理员' : '成员');
}

function avatarText(workspace: TenantWorkspace | null): string {
  return workspaceName(workspace).slice(0, 1).toUpperCase();
}

function unreadBadge(count: number): string {
  return count > 99 ? '99+' : String(count);
}

const sortedWorkspaces = computed(() => [...props.workspaces].sort((left, right) => {
  const nameResult = workspaceName(left).localeCompare(workspaceName(right));
  return nameResult || left.tenantId.localeCompare(right.tenantId);
}));

function open(): void {
  if (!canOpen.value) return;
  visible.value = true;
}

function close(): void {
  if (props.switchingTenantId) return;
  visible.value = false;
}

function selectWorkspace(tenantId: string): void {
  if (props.switchingTenantId) return;
  if (tenantId === props.currentWorkspace?.tenantId) {
    close();
    return;
  }
  emit('select', tenantId);
}

function refresh(): void {
  emit('refresh');
}

function joinOtherTenant(): void {
  uni.showToast({ title: '加入其他租户功能即将开放', icon: 'none' });
}

defineExpose({ open, close });
</script>

<template>
  <view class="workspace-switcher">
    <view v-if="errorMessage && !visible" class="workspace-error">
      <text class="workspace-error-text">{{ errorMessage }}</text>
      <button class="workspace-retry" @click="refresh">重试</button>
    </view>

    <view v-if="visible" class="workspace-mask" @click="close">
      <view class="workspace-sheet" @click.stop>
        <view class="sheet-handle" />
        <view class="sheet-header">
          <view class="sheet-heading">
            <text class="sheet-title">切换租户</text>
            <text class="sheet-description">选择后，后续业务数据将切换到对应租户。</text>
          </view>
          <view class="sheet-close" @click="close">
            <MobileIcon name="close" :size="40" />
          </view>
        </view>

        <scroll-view scroll-y class="workspace-list" :show-scrollbar="false">
          <view v-if="loading" class="workspace-state">
            <text>正在加载租户...</text>
          </view>
          <view v-else-if="errorMessage" class="workspace-state workspace-state--error">
            <text class="workspace-state-message">{{ errorMessage }}</text>
            <button class="workspace-retry" @click="refresh">重试</button>
          </view>
          <view v-else-if="!workspaces.length" class="workspace-state">
            <text>暂无可用租户</text>
          </view>
          <template v-else>
            <view class="workspace-section">
              <text class="workspace-section-title">全部租户</text>
              <view
                v-for="workspace in sortedWorkspaces"
                :key="workspace.tenantId"
                class="workspace-item"
                :class="{
                  'is-selected': workspace.tenantId === currentWorkspace?.tenantId,
                  'is-switching': workspace.tenantId === switchingTenantId,
                }"
                @click="selectWorkspace(workspace.tenantId)"
              >
                <view class="workspace-avatar workspace-avatar-small">{{ avatarText(workspace) }}</view>
                <view class="workspace-item-main">
                  <text class="workspace-item-name">{{ workspaceName(workspace) }}</text>
                  <text class="workspace-item-description">{{ workspaceDescription(workspace) }}</text>
                </view>
                <view class="workspace-item-status">
                  <text v-if="workspace.tenantId === switchingTenantId" class="workspace-switching">切换中</text>
                  <text v-else-if="workspace.unreadCount > 0" class="unread-badge">
                    {{ unreadBadge(workspace.unreadCount) }}
                  </text>
                  <text v-if="workspace.tenantId === currentWorkspace?.tenantId" class="workspace-check">✓</text>
                </view>
              </view>
            </view>

            <view class="join-tenant" @click="joinOtherTenant">
              <view class="join-tenant-copy">
                <MobileIcon name="organization" :size="40" />
                <text>加入其他租户</text>
              </view>
              <MobileIcon name="arrow-right" :size="32" />
            </view>
          </template>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.workspace-switcher {
  display: block;
}

.workspace-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 16rpx;
  padding: 16rpx 8rpx;
}

.workspace-error-text {
  min-width: 0;
  flex: 1;
  color: var(--fa-color-danger);
  font-size: 24rpx;
}

.workspace-retry {
  flex: 0 0 auto;
  min-width: 120rpx;
  min-height: 64rpx;
  margin: 0;
  padding: 0 16rpx;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 24rpx;
  line-height: 64rpx;
}

.workspace-mask {
  position: fixed;
  z-index: 30;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  background: var(--fa-color-mask);
}

.workspace-sheet {
  width: 100%;
  max-height: 88vh;
  box-sizing: border-box;
  padding: 0 32rpx calc(24rpx + var(--fa-safe-area-bottom));
  border-radius: 32rpx 32rpx 0 0;
  background: var(--fa-color-card);
}

.sheet-handle {
  width: 72rpx;
  height: 8rpx;
  margin: 16rpx auto 20rpx;
  border-radius: var(--fa-radius-pill);
  background: var(--fa-color-border-strong);
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.sheet-heading {
  min-width: 0;
  flex: 1;
}

.sheet-title,
.sheet-description {
  display: block;
}

.sheet-title {
  color: var(--fa-color-text);
  font-size: 40rpx;
  font-weight: 600;
  line-height: 52rpx;
}

.sheet-description {
  margin-top: 4rpx;
  overflow: hidden;
  color: var(--fa-color-muted);
  font-size: 22rpx;
  line-height: 32rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sheet-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--fa-size-touch);
  height: var(--fa-size-touch);
  color: var(--fa-color-text);
}

.workspace-list {
  height: 620rpx;
  max-height: 58vh;
  margin-top: 20rpx;
  scrollbar-width: none;
}

.workspace-list::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.workspace-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260rpx;
  padding: 48rpx 0;
  color: var(--fa-color-muted);
  text-align: center;
}

.workspace-state--error {
  flex-direction: column;
  gap: 20rpx;
}

.workspace-state-message {
  max-width: 80%;
  color: var(--fa-color-danger);
  line-height: 36rpx;
}

.workspace-section {
  margin-bottom: 20rpx;
}

.workspace-section-title {
  display: block;
  margin: 16rpx 0 8rpx;
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 36rpx;
}

.workspace-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-height: var(--fa-size-touch);
  box-sizing: border-box;
  padding: 12rpx 16rpx;
  border-radius: 20rpx;
}

.workspace-item.is-selected {
  background: var(--fa-color-primary-soft);
}

.workspace-item.is-switching {
  opacity: 0.65;
}

.workspace-avatar {
  flex: 0 0 auto;
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  color: var(--fa-color-text-inverse);
  background: linear-gradient(135deg, var(--fa-color-primary), var(--fa-color-purple));
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

.workspace-item-main {
  min-width: 0;
  flex: 1;
}

.workspace-item-name,
.workspace-item-description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-item-name {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 40rpx;
}

.workspace-item-description {
  margin-top: 2rpx;
  color: var(--fa-color-muted);
  font-size: 22rpx;
  line-height: 32rpx;
}

.workspace-item-status {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 0 0 auto;
}

.unread-badge {
  min-width: 34rpx;
  padding: 4rpx 10rpx;
  border-radius: var(--fa-radius-pill);
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-danger);
  font-size: 20rpx;
  line-height: 28rpx;
  text-align: center;
}

.workspace-check {
  color: var(--fa-color-primary);
  font-size: 34rpx;
  font-weight: 600;
}

.workspace-switching {
  color: var(--fa-color-primary);
  font-size: 22rpx;
}

.join-tenant {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--fa-size-touch);
  margin-top: 20rpx;
  padding: 12rpx 16rpx;
  border-top: 1rpx solid var(--fa-color-border);
  color: var(--fa-color-primary);
  font-size: 28rpx;
}

.join-tenant-copy {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
</style>
