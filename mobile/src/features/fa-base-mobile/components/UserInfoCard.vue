<script setup lang="ts">
import type { PortalUser } from '../types/auth';

defineProps<{
  user: PortalUser;
}>();
</script>

<template>
  <view class="user-card fa-card">
    <view class="user-avatar">{{ user.name?.slice(0, 1) || user.username?.slice(0, 1) || '?' }}</view>
    <view class="user-main">
      <text class="user-name">{{ user.name || user.username }}</text>
      <text class="user-status">{{ user.status === false ? '已停用' : '正常使用' }}</text>
    </view>
    <view class="user-fields">
      <view class="field-row">
        <text class="field-label">账号</text>
        <text class="field-value">{{ user.username || '-' }}</text>
      </view>
      <view class="field-row">
        <text class="field-label">手机号</text>
        <text class="field-value">{{ user.tel || '-' }}</text>
      </view>
      <view class="field-row">
        <text class="field-label">邮箱</text>
        <text class="field-value">{{ user.email || '-' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.user-card {
  padding: 36rpx;
}

.user-avatar {
  width: 112rpx;
  height: 112rpx;
  margin-bottom: 24rpx;
  border-radius: 50%;
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff, #69b1ff);
  font-size: 52rpx;
  line-height: 112rpx;
  text-align: center;
}

.user-main {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 36rpx;
}

.user-name {
  font-size: 40rpx;
  font-weight: 600;
}

.user-status {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  color: #15803d;
  background: #dcfce7;
  font-size: 22rpx;
}

.user-fields {
  border-top: 1rpx solid var(--fa-color-border);
}

.field-row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.field-label {
  color: var(--fa-color-muted);
}

.field-value {
  max-width: 68%;
  overflow: hidden;
  color: var(--fa-color-text);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
