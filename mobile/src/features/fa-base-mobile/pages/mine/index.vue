<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { ApiError } from '../../common/request';
import MobileIcon from '../../components/MobileIcon.vue';
import MobileShell from '../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import { useTenantStore } from '../../stores/tenant';
import type { MobileIconName } from '../../types/mobileIcon';
import { telemetry } from '@features/fa-core-mobile/telemetry';

interface MineSetting {
  id: string;
  label: string;
  icon: MobileIconName;
}

const MINE_SETTINGS: readonly MineSetting[] = [
  { id: 'account', label: '账号与安全', icon: 'organization' },
  { id: 'notification', label: '通知设置', icon: 'bell' },
  { id: 'appearance', label: '外观设置', icon: 'grid' },
  { id: 'about', label: '关于 Fa Mobile', icon: 'question' },
];

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const logoutLoading = ref(false);
const profileLoading = ref(true);
const errorMessage = ref('');

const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));
const profileName = computed(() => authStore.user?.name?.trim() || authStore.user?.username?.trim() || '当前用户');
const profileEmail = computed(() => authStore.user?.email?.trim() || authStore.user?.username?.trim() || '-');
const profileTenant = computed(() => tenantStore.currentWorkspace?.tenantName?.trim() || '暂无工作空间');
const profileMark = computed(() => profileName.value.slice(0, 1) || '?');

async function loadProfile(): Promise<void> {
  profileLoading.value = true;
  errorMessage.value = '';
  try {
    const user = await authStore.loadCurrentUser();
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    await tenantStore.loadForUser(user.id);
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '用户信息加载失败';
  } finally {
    profileLoading.value = false;
  }
}

function showSettingMessage(setting: MineSetting): void {
  uni.showToast({ title: `${setting.label}功能即将开放`, icon: 'none' });
}

function confirmLogout(): void {
  if (logoutLoading.value) return;
  uni.showModal({
    title: '退出登录',
    content: '退出后需要重新登录，确定要继续吗？',
    confirmText: '退出登录',
    confirmColor: '#ef4444',
    success: ({ confirm }) => {
      if (confirm) void logout();
    },
  });
}

async function logout(): Promise<void> {
  logoutLoading.value = true;
  try {
    await authStore.signOut();
  } finally {
    logoutLoading.value = false;
    uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
  }
}

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.mine);
  void loadProfile();
});
</script>

<template>
  <MobileShell
    active-tab="mine"
    title="我的"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="unreadCount"
    :unread-count="unreadCount"
  >
    <view class="mine-page">
      <view v-if="profileLoading" class="mine-state fa-card">
        <text class="fa-muted">正在加载个人信息...</text>
      </view>

      <view v-else-if="errorMessage" class="mine-state fa-card">
        <text class="mine-state__error">{{ errorMessage }}</text>
        <button class="mine-state__retry" @click="loadProfile">重新加载</button>
      </view>

      <template v-else>
        <view class="profile-card fa-card" @click="showSettingMessage({ id: 'profile', label: '个人资料', icon: 'mine' })">
          <view class="profile-card__avatar">{{ profileMark }}</view>
          <view class="profile-card__copy">
            <text class="profile-card__name">{{ profileName }}</text>
            <text class="profile-card__email">{{ profileEmail }}</text>
            <text class="profile-card__tenant">{{ profileTenant }}</text>
          </view>
          <MobileIcon name="chevron-right" :size="36" class="profile-card__arrow" />
        </view>

        <text class="mine-section-title">工作空间</text>
        <view class="settings-card fa-card">
          <view
            v-for="setting in MINE_SETTINGS"
            :key="setting.id"
            class="settings-row"
            @click="showSettingMessage(setting)"
          >
            <MobileIcon :name="setting.icon" :size="44" class="settings-row__icon" />
            <text class="settings-row__label">{{ setting.label }}</text>
            <MobileIcon name="chevron-right" :size="36" class="settings-row__arrow" />
          </view>
        </view>

        <button class="logout-button" :loading="logoutLoading" @click="confirmLogout">
          <MobileIcon name="arrow-right" :size="40" class="logout-button__icon" />
          <text>退出登录</text>
        </button>
      </template>
    </view>
  </MobileShell>
</template>

<style scoped>
.mine-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 16rpx 32rpx 48rpx;
}

.mine-state {
  margin-top: 24rpx;
  padding: 40rpx 32rpx;
  text-align: center;
}

.mine-state__error {
  display: block;
  margin-bottom: 24rpx;
  color: var(--fa-color-danger);
}

.mine-state__retry {
  width: 240rpx;
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
}

.profile-card {
  display: flex;
  align-items: center;
  min-height: 160rpx;
  padding: 28rpx;
}

.profile-card:active,
.settings-row:active {
  opacity: 0.78;
}

.profile-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 96rpx;
  height: 96rpx;
  margin-right: 24rpx;
  border-radius: 28rpx;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 38rpx;
  font-weight: 700;
}

.profile-card__copy {
  min-width: 0;
  flex: 1;
}

.profile-card__name,
.profile-card__email,
.profile-card__tenant {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-card__name {
  color: var(--fa-color-text);
  font-size: 34rpx;
  font-weight: 700;
  line-height: 46rpx;
}

.profile-card__email,
.profile-card__tenant {
  color: var(--fa-color-text-secondary);
  font-size: 26rpx;
  line-height: 38rpx;
}

.profile-card__arrow,
.settings-row__arrow {
  flex: 0 0 auto;
  margin-left: 16rpx;
  color: var(--fa-color-border-strong);
}

.mine-section-title {
  display: block;
  margin: 48rpx 0 20rpx;
  color: var(--fa-color-text);
  font-size: 34rpx;
  line-height: 44rpx;
}

.settings-card {
  padding: 0;
  overflow: hidden;
}

.settings-row {
  display: flex;
  align-items: center;
  min-height: 88rpx;
  box-sizing: border-box;
  padding: 20rpx 24rpx;
}

.settings-row + .settings-row {
  border-top: 1rpx solid var(--fa-color-border);
}

.settings-row__icon {
  flex: 0 0 auto;
  margin-right: 20rpx;
  color: var(--fa-color-muted);
}

.settings-row__label {
  min-width: 0;
  flex: 1;
  color: var(--fa-color-text);
  font-size: 30rpx;
  line-height: 42rpx;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--fa-size-touch);
  margin: 48rpx auto 0;
  padding: 0 24rpx;
  color: var(--fa-color-danger);
  background: transparent;
  font-size: 30rpx;
}

.logout-button__icon {
  margin-right: 12rpx;
  transform: rotate(180deg);
}
</style>
