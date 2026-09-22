<script setup lang="ts">
import { computed, onActivated, onBeforeUnmount, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { ApiError } from '../../common/request';
import { createPageRefresh } from '../../common/page-refresh';
import MobileIcon from '../../components/MobileIcon.vue';
import MobileShell from '../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import { useTenantStore } from '../../stores/tenant';
import type { MobileIconName } from '../../types/mobileIcon';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import { THEME_DANGER_COLORS, useThemeStore } from '@features/fa-core-mobile/theme';

interface MineSetting {
  id: string;
  label: string;
  icon: MobileIconName;
  route: string;
}

const MINE_SETTINGS: readonly MineSetting[] = [
  { id: 'account', label: '账号与安全', icon: 'organization', route: MOBILE_PAGE_ROUTES.mineSecurity },
  { id: 'notification', label: '消息中心', icon: 'bell', route: MOBILE_PAGE_ROUTES.messages },
  { id: 'appearance', label: '外观设置', icon: 'grid', route: MOBILE_PAGE_ROUTES.mineAppearance },
  { id: 'about', label: '关于 Fa Mobile', icon: 'question', route: MOBILE_PAGE_ROUTES.mineAbout },
];

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const themeStore = useThemeStore();
const showDemoEntry = import.meta.env.DEV;
const logoutLoading = ref(false);
const pageRefresh = createPageRefresh();
const {
  errorMessage,
  initialLoading,
  run: runRefresh,
  invalidate,
} = pageRefresh;

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

function openDemo(): void {
  uni.navigateTo({ url: '/features/fa-demo-mobile/pages/home/index' });
}

function openMinePage(url: string): void {
  uni.navigateTo({ url });
}

function openMessages(): void {
  openMinePage(MOBILE_PAGE_ROUTES.messages);
}

function loadProfile(): Promise<void> {
  return runRefresh(async (isCurrent) => {
    const user = await authStore.loadCurrentUser();
    if (!isCurrent()) return;
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    await tenantStore.loadForUser(user.id);
    if (!isCurrent()) return;
  }, () => Boolean(authStore.user), (error) => (
    error instanceof ApiError ? error.message : '用户信息加载失败'
  ));
}

function confirmLogout(): void {
  if (logoutLoading.value) return;
  uni.showModal({
    title: '退出登录',
    content: '退出后需要重新登录，确定要继续吗？',
    confirmText: '退出登录',
    confirmColor: THEME_DANGER_COLORS[themeStore.mode],
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

onBeforeUnmount(() => {
  invalidate();
});

function handlePageShow(): void {
  telemetry.page(MOBILE_PAGE_ROUTES.mine);
  void loadProfile();
}

onShow(handlePageShow);
onActivated(handlePageShow);
</script>

<template>
  <MobileShell
    active-tab="mine"
    title="我的"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="unreadCount"
    :unread-count="unreadCount"
    @notification-click="openMessages"
  >
    <view class="mine-page">
      <view v-if="initialLoading" class="mine-state fa-card">
        <text class="fa-muted">正在加载个人信息...</text>
      </view>

      <view v-else-if="errorMessage" class="mine-state fa-card">
        <text class="mine-state__error">{{ errorMessage }}</text>
        <button class="mine-state__retry" @click="loadProfile">重新加载</button>
      </view>

      <template v-else>
        <view class="profile-card fa-card" @click="openMinePage(MOBILE_PAGE_ROUTES.mineAccount)">
          <view class="profile-card__avatar">{{ profileMark }}</view>
          <view class="profile-card__copy">
            <text class="profile-card__name">{{ profileName }}</text>
            <text class="profile-card__email">{{ profileEmail }}</text>
            <text class="profile-card__tenant">{{ profileTenant }}</text>
          </view>
          <MobileIcon name="chevron-right" :size="36" class="profile-card__arrow" />
        </view>

        <text class="mine-section-title">设置</text>
        <view class="settings-card fa-card">
          <view
            v-for="setting in MINE_SETTINGS"
            :key="setting.id"
            class="settings-row"
            @click="openMinePage(setting.route)"
          >
            <MobileIcon :name="setting.icon" :size="44" class="settings-row__icon" />
            <text class="settings-row__label">{{ setting.label }}</text>
            <MobileIcon name="chevron-right" :size="36" class="settings-row__arrow" />
          </view>
        </view>

        <view v-if="showDemoEntry" class="demo-entry fa-card" @click="openDemo">
          <view class="demo-entry__copy">
            <text class="demo-entry__title">移动端 Demo</text>
            <text class="demo-entry__description">查看移动端组件和交互示例</text>
          </view>
          <view class="demo-entry__action">
            <text>进入 Demo</text>
            <MobileIcon name="arrow-right" :size="32" />
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

.demo-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 32rpx;
  padding: 28rpx;
}

.demo-entry__copy {
  min-width: 0;
  flex: 1;
}

.demo-entry__title,
.demo-entry__description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.demo-entry__title {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 700;
  line-height: 42rpx;
}

.demo-entry__description {
  margin-top: 4rpx;
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 34rpx;
}

.demo-entry__action {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 4rpx;
  color: var(--fa-color-primary);
  font-size: 24rpx;
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
