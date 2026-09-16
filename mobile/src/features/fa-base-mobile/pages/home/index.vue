<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { ApiError } from '../../common/request';
import { checkAndPromptUpdate } from '../../common/update';
import UserInfoCard from '../../components/UserInfoCard.vue';
import TenantWorkspaceSwitcher from '../../components/TenantWorkspaceSwitcher.vue';
import { useTenantStore } from '../../stores/tenant';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const errorMessage = ref('');
let updateCheckStarted = false;
const HOME_ROUTE = '/features/fa-base-mobile/pages/home/index';

async function loadUser(): Promise<void> {
  errorMessage.value = '';
  try {
    const user = await authStore.loadCurrentUser();
    if (!user) {
      uni.reLaunch({ url: '/features/fa-base-mobile/pages/login/index' });
      return;
    }
    await tenantStore.loadForUser(user.id);
    if (!updateCheckStarted) {
      updateCheckStarted = true;
      void checkAndPromptUpdate();
    }
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '用户信息加载失败';
  }
}

async function handleLogout(): Promise<void> {
  try {
    await authStore.signOut();
  } finally {
    uni.reLaunch({ url: '/features/fa-base-mobile/pages/login/index' });
  }
}

function openDemo(): void {
  uni.navigateTo({ url: '/features/fa-demo-mobile/pages/home/index' });
}

function reloadTenants(): void {
  if (authStore.user) void tenantStore.loadForUser(authStore.user.id);
}

function switchTenant(tenantId: string): void {
  const userId = authStore.user?.id;
  if (!userId || !tenantStore.switchTenant(userId, tenantId)) return;
  uni.reLaunch({ url: HOME_ROUTE });
}

onShow(() => {
  telemetry.page('/features/fa-base-mobile/pages/home/index');
  void loadUser();
});
</script>

<template>
  <view class="home-page fa-page">
    <view class="home-heading">
      <text class="home-title">首页</text>
      <text class="home-subtitle">当前为移动端基础框架预览</text>
    </view>

    <view v-if="authStore.loading" class="state-card fa-card">
      <text class="fa-muted">正在加载用户信息...</text>
    </view>

    <view v-else-if="errorMessage" class="state-card fa-card">
      <text class="error-message">{{ errorMessage }}</text>
      <button class="retry-button" @click="loadUser">重新加载</button>
    </view>

    <template v-else>
      <TenantWorkspaceSwitcher
        v-if="authStore.user"
        :workspaces="tenantStore.workspaces"
        :current-workspace="tenantStore.currentWorkspace"
        :loading="tenantStore.loading"
        :error-message="tenantStore.errorMessage"
        @select="switchTenant"
        @refresh="reloadTenants"
      />

      <UserInfoCard v-if="authStore.user" :user="authStore.user" />
    </template>

    <view v-if="authStore.user && !errorMessage" class="demo-entry fa-card">
      <view class="demo-entry-heading">
        <text class="demo-entry-title">移动端 Demo</text>
        <text class="demo-entry-description">查看移动端组件和交互示例</text>
      </view>
      <button class="demo-entry-button" @click="openDemo">进入 Demo</button>
    </view>

    <button class="logout-button" @click="handleLogout">退出登录</button>
  </view>
</template>

<style scoped>
.home-page {
  padding-top: 56rpx;
}

.home-heading {
  margin: 0 8rpx 32rpx;
}

.home-title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 48rpx;
  font-weight: 700;
}

.home-subtitle {
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.state-card {
  padding: 40rpx 32rpx;
  text-align: center;
}

.error-message {
  display: block;
  margin-bottom: 24rpx;
  color: #dc2626;
}

.retry-button {
  width: 240rpx;
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: #eff6ff;
  font-size: 26rpx;
}

.logout-button {
  margin-top: 48rpx;
  border: 1rpx solid #fecaca;
  border-radius: 999rpx;
  color: #dc2626;
  background: #fff;
  font-size: 28rpx;
}

.demo-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 32rpx;
  padding: 28rpx 32rpx;
}

.demo-entry-heading {
  min-width: 0;
}

.demo-entry-title,
.demo-entry-description {
  display: block;
}

.demo-entry-title {
  margin-bottom: 8rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.demo-entry-description {
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.demo-entry-button {
  flex: 0 0 auto;
  width: 188rpx;
  margin: 0;
  color: #ffffff;
  background: var(--fa-color-primary);
  font-size: 26rpx;
}
</style>
