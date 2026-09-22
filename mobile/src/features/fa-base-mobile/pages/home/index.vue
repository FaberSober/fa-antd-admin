<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { computed, inject, onActivated, onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { ApiError } from '../../common/request';
import { checkAndPromptUpdate } from '../../common/update';
import { createPageRefresh } from '../../common/page-refresh';
import {
  MOBILE_PAGE_ROUTES,
  MOBILE_TAB_NAVIGATION_KEY,
  MOBILE_TAB_ROUTES,
} from '../../feature';
import MobileEmptyState from '../../components/MobileEmptyState.vue';
import MobileIcon from '../../components/MobileIcon.vue';
import MobileSearchField from '../../components/MobileSearchField.vue';
import MobileSectionHeader from '../../components/MobileSectionHeader.vue';
import MobileShell from '../../components/MobileShell.vue';
import { useTenantStore } from '../../stores/tenant';
import type { MobileIconName } from '../../types/mobileIcon';
import { telemetry } from '@features/fa-core-mobile/telemetry';

interface QuickFeature {
  id: string;
  title: string;
  description: string;
  icon: MobileIconName;
  tone: 'primary' | 'purple' | 'orange' | 'green';
}

const QUICK_FEATURES: readonly QuickFeature[] = [
  {
    id: 'todo',
    title: '待办事项',
    description: '查看待处理事项',
    icon: 'clock',
    tone: 'primary',
  },
  {
    id: 'recent',
    title: '最近使用',
    description: '快速继续工作',
    icon: 'file',
    tone: 'purple',
  },
  {
    id: 'announcement',
    title: '系统公告',
    description: '查看最新通知',
    icon: 'bell',
    tone: 'orange',
  },
  {
    id: 'help',
    title: '帮助中心',
    description: '获取使用帮助',
    icon: 'question',
    tone: 'green',
  },
];

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const navigateToTab = inject(MOBILE_TAB_NAVIGATION_KEY);
const searchQuery = ref('');
const pageRefresh = createPageRefresh();
const {
  errorMessage,
  initialLoading,
  run: runRefresh,
  invalidate,
} = pageRefresh;
let updateCheckStarted = false;

const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));
const displayName = computed(() => authStore.user?.name?.trim() || authStore.user?.username?.trim() || '');
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
});
const greetingIdentity = computed(() => tenantRole.value || displayName.value);
const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase());
const filteredQuickFeatures = computed(() => {
  const keyword = normalizedSearchQuery.value;
  if (!keyword) return QUICK_FEATURES;
  return QUICK_FEATURES.filter((feature) => (
    feature.title.toLocaleLowerCase().includes(keyword)
    || feature.description.toLocaleLowerCase().includes(keyword)
  ));
});

function loadUser(): Promise<void> {
  return runRefresh(async (isCurrent) => {
    const user = await authStore.loadCurrentUser();
    if (!isCurrent()) return;
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    await tenantStore.loadForUser(user.id);
    if (!isCurrent()) return;
    if (!updateCheckStarted) {
      updateCheckStarted = true;
      void checkAndPromptUpdate();
    }
  }, () => Boolean(authStore.user), (error) => (
    error instanceof ApiError ? error.message : '用户信息加载失败'
  ));
}

function openMessages(): void {
  if (navigateToTab) {
    navigateToTab('messages');
    return;
  }
  uni.reLaunch({ url: MOBILE_TAB_ROUTES.messages });
}

function showFeatureMessage(feature: QuickFeature): void {
  uni.showToast({ title: `${feature.title}功能即将开放`, icon: 'none' });
}

function editQuickFeatures(): void {
  uni.showToast({ title: '常用功能配置即将开放', icon: 'none' });
}

onBeforeUnmount(() => {
  invalidate();
});

function handlePageShow(): void {
  telemetry.page(MOBILE_PAGE_ROUTES.workbench);
  void loadUser();
}

onShow(handlePageShow);
onActivated(handlePageShow);
onMounted(handlePageShow);
</script>

<template>
  <MobileShell
    active-tab="workbench"
    title="工作台"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="unreadCount"
    :unread-count="unreadCount"
    @notification-click="openMessages"
  >
    <view class="home-page">
      <view v-if="initialLoading" class="state-card fa-card">
        <text class="fa-muted">正在加载用户信息...</text>
      </view>

      <view v-else-if="errorMessage" class="state-card fa-card">
        <text class="error-message">{{ errorMessage }}</text>
        <button class="retry-button" @click="loadUser">重新加载</button>
      </view>

      <template v-else>
        <view class="welcome-section">
          <view class="welcome-copy">
            <view class="welcome-greeting">
              <text>{{ greeting }}</text>
              <text v-if="greetingIdentity">，{{ greetingIdentity }}</text>
            </view>
            <view class="welcome-title">开始今天的工作吧</view>
          </view>
          <view class="welcome-action">
            <MobileIcon name="lightning" :size="48" />
          </view>
        </view>

        <MobileSearchField
          v-model="searchQuery"
          placeholder="搜索功能、消息和联系人"
          shortcut="⌘ K"
        />

        <view class="quick-section">
          <MobileSectionHeader title="常用功能" action-text="编辑" @action="editQuickFeatures" />
          <view v-if="filteredQuickFeatures.length" class="quick-feature-grid">
            <view
              v-for="feature in filteredQuickFeatures"
              :key="feature.id"
              class="quick-feature-card-wrap"
            >
              <view
                class="quick-feature-card fa-card"
                :class="`quick-feature-card--${feature.tone}`"
                @click="showFeatureMessage(feature)"
              >
                <view class="quick-feature-icon">
                  <MobileIcon :name="feature.icon" :size="48" />
                </view>
                <view class="quick-feature-title">{{ feature.title }}</view>
                <view class="quick-feature-description">{{ feature.description }}</view>
              </view>
            </view>
          </view>
          <MobileEmptyState
            v-else
            icon="search"
            title="没有找到匹配功能"
            description="尝试搜索其他关键词"
          />
        </view>

        <view class="module-section">
          <MobileSectionHeader title="业务模块" />
          <MobileEmptyState
            icon="grid"
            title="功能模块将在这里展示"
            description="联系管理员配置你的工作空间"
          />
        </view>
      </template>
    </view>
  </MobileShell>
</template>

<style scoped>
.home-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 16rpx 32rpx 48rpx;
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin: 16rpx 0 36rpx;
}

.welcome-copy {
  min-width: 0;
  flex: 1;
}

.welcome-greeting,
.welcome-title {
  display: block;
}

.welcome-greeting {
  overflow: hidden;
  color: var(--fa-color-text-secondary);
  font-size: 30rpx;
  line-height: 44rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.welcome-title {
  margin-top: 6rpx;
  color: var(--fa-color-text);
  font-size: 48rpx;
  font-weight: 700;
  line-height: 64rpx;
}

.welcome-action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
}

.quick-section,
.module-section {
  margin-top: 28rpx;
}

.quick-feature-grid {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  margin: 0 -8rpx;
}

.quick-feature-card-wrap {
  width: 50%;
  box-sizing: border-box;
  padding: 0 8rpx 16rpx;
}

.quick-feature-card {
  min-width: 0;
  min-height: 192rpx;
  box-sizing: border-box;
  padding: 24rpx;
}

.quick-feature-card:active {
  opacity: 0.78;
}

.quick-feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
}

.quick-feature-card--primary .quick-feature-icon {
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
}

.quick-feature-card--purple .quick-feature-icon {
  color: var(--fa-color-purple);
  background: var(--fa-color-purple-soft);
}

.quick-feature-card--orange .quick-feature-icon {
  color: var(--fa-color-orange);
  background: var(--fa-color-orange-soft);
}

.quick-feature-card--green .quick-feature-icon {
  color: var(--fa-color-green);
  background: var(--fa-color-green-soft);
}

.quick-feature-title,
.quick-feature-description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-feature-title {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}

.quick-feature-description {
  margin-top: 4rpx;
  color: var(--fa-color-text-secondary);
  font-size: 24rpx;
  line-height: 36rpx;
}

.state-card {
  padding: 40rpx 32rpx;
  text-align: center;
}

.error-message {
  display: block;
  margin-bottom: 24rpx;
  color: var(--fa-color-danger);
}

.retry-button {
  width: 240rpx;
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
}
</style>
