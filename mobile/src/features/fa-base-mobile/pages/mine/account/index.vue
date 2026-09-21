<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { ApiError } from '../../../common/request';
import { MOBILE_PAGE_ROUTES } from '../../../feature';
import { useAuthStore } from '../../../stores/auth';
import { useTenantStore } from '../../../stores/tenant';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const loading = ref(true);
const errorMessage = ref('');

const userName = computed(() => authStore.user?.name?.trim() || authStore.user?.username?.trim() || '当前用户');
const userMark = computed(() => userName.value.slice(0, 1) || '?');
const accountStatus = computed(() => (authStore.user?.status === false ? '已停用' : '正常使用'));
const tenantName = computed(() => tenantStore.currentWorkspace?.tenantName?.trim() || '暂无工作空间');
const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '未选择角色';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});

async function loadProfile(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';
  try {
    const user = await authStore.loadCurrentUser();
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    await tenantStore.loadForUser(user.id);
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '个人资料加载失败';
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.mineAccount);
  void loadProfile();
});
</script>

<template>
  <view class="account-page fa-page">
    <view v-if="loading" class="account-state fa-card">
      <text class="fa-muted">正在加载个人资料...</text>
    </view>

    <view v-else-if="errorMessage" class="account-state fa-card">
      <text class="account-state__error">{{ errorMessage }}</text>
      <button class="account-state__retry" @click="loadProfile">重新加载</button>
    </view>

    <template v-else-if="authStore.user">
      <view class="account-profile fa-card">
        <view class="account-profile__avatar">{{ userMark }}</view>
        <view class="account-profile__main">
          <text class="account-profile__name">{{ userName }}</text>
          <text
            class="account-profile__status"
            :class="{ 'account-profile__status--disabled': authStore.user.status === false }"
          >{{ accountStatus }}</text>
        </view>
      </view>

      <view class="account-info fa-card">
        <view class="account-info__row">
          <text class="account-info__label">账号</text>
          <text class="account-info__value">{{ authStore.user.username || '-' }}</text>
        </view>
        <view class="account-info__row">
          <text class="account-info__label">手机号</text>
          <text class="account-info__value">{{ authStore.user.tel || '-' }}</text>
        </view>
        <view class="account-info__row">
          <text class="account-info__label">邮箱</text>
          <text class="account-info__value">{{ authStore.user.email || '-' }}</text>
        </view>
      </view>

      <view class="account-workspace fa-card">
        <text class="account-workspace__title">当前工作空间</text>
        <text class="account-workspace__name">{{ tenantName }}</text>
        <text class="account-workspace__role">{{ tenantRole }}</text>
        <text v-if="tenantStore.errorMessage" class="account-workspace__error">
          {{ tenantStore.errorMessage }}
        </text>
      </view>
    </template>
  </view>
</template>

<style scoped>
.account-page {
  min-height: 100vh;
  padding-top: 24rpx;
  padding-bottom: 48rpx;
}

.account-state {
  text-align: center;
}

.account-state__error,
.account-workspace__error {
  color: var(--fa-color-danger);
}

.account-state__error {
  display: block;
  margin-bottom: 24rpx;
}

.account-state__retry {
  width: 240rpx;
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
}

.account-profile {
  display: flex;
  align-items: center;
}

.account-profile__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 112rpx;
  height: 112rpx;
  margin-right: 24rpx;
  border-radius: 50%;
  color: #ffffff;
  background: linear-gradient(135deg, var(--fa-color-primary), #69b1ff);
  font-size: 52rpx;
  font-weight: 700;
}

.account-profile__main {
  min-width: 0;
  flex: 1;
}

.account-profile__name,
.account-profile__status,
.account-workspace__title,
.account-workspace__name,
.account-workspace__role,
.account-workspace__error {
  display: block;
}

.account-profile__name {
  color: var(--fa-color-text);
  font-size: 40rpx;
  font-weight: 700;
  line-height: 52rpx;
}

.account-profile__status {
  width: fit-content;
  margin-top: 10rpx;
  padding: 6rpx 14rpx;
  border-radius: var(--fa-radius-pill);
  color: #15803d;
  background: var(--fa-color-green-soft);
  font-size: 22rpx;
  line-height: 30rpx;
}

.account-profile__status--disabled {
  color: var(--fa-color-danger);
  background: var(--fa-color-danger-soft);
}

.account-info,
.account-workspace {
  margin-top: 24rpx;
}

.account-info {
  padding: 0 32rpx;
}

.account-info__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88rpx;
  gap: 24rpx;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.account-info__row:last-child {
  border-bottom: 0;
}

.account-info__label {
  flex: 0 0 auto;
  color: var(--fa-color-muted);
}

.account-info__value {
  min-width: 0;
  overflow: hidden;
  color: var(--fa-color-text);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-workspace__title {
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 36rpx;
}

.account-workspace__name {
  margin-top: 8rpx;
  color: var(--fa-color-text);
  font-size: 34rpx;
  font-weight: 700;
  line-height: 46rpx;
}

.account-workspace__role {
  margin-top: 4rpx;
  color: var(--fa-color-text-secondary);
  font-size: 26rpx;
  line-height: 38rpx;
}

.account-workspace__error {
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 34rpx;
}
</style>
