<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import MobileEmptyState from '../../components/MobileEmptyState.vue';
import MobileIcon from '../../components/MobileIcon.vue';
import MobileShell from '../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import { useMessageStore } from '../../stores/message';
import { useTenantStore } from '../../stores/tenant';
import type { MobileIconName } from '../../types/mobileIcon';
import { telemetry } from '@features/fa-core-mobile/telemetry';

type MessageFilter = 'all' | 'unread';
type MessageTone = 'primary' | 'orange' | 'purple' | 'green';

interface MobileMessage {
  id: string;
  title: string;
  summary: string;
  category: string;
  time: string;
  icon: MobileIconName;
  tone: MessageTone;
  read: boolean;
}

// 消息接口尚未确定，开发环境只使用隔离的视觉数据；生产构建展示正式空态。
const MESSAGE_FIXTURES: readonly MobileMessage[] = import.meta.env.DEV
  ? [
      {
        id: 'welcome',
        title: '欢迎使用 Fa Mobile',
        summary: '你的企业工作空间已经准备就绪',
        category: '系统消息',
        time: '刚刚',
        icon: 'lightning',
        tone: 'primary',
        read: false,
      },
      {
        id: 'todo-reminder',
        title: '本周待办事项提醒',
        summary: '你有 3 项待办事项即将到期',
        category: '工作提醒',
        time: '10:24',
        icon: 'clock',
        tone: 'orange',
        read: false,
      },
      {
        id: 'organization-update',
        title: '组织架构更新',
        summary: '管理员更新了部门和成员信息',
        category: '租户通知',
        time: '昨天',
        icon: 'organization',
        tone: 'purple',
        read: true,
      },
      {
        id: 'system-maintenance',
        title: '系统维护公告',
        summary: '服务将在周日凌晨进行短暂维护',
        category: '普通消息',
        time: '周一',
        icon: 'bell',
        tone: 'green',
        read: true,
      },
    ]
  : [];

const authStore = useAuthStore();
const messageStore = useMessageStore();
const tenantStore = useTenantStore();
const activeFilter = ref<MessageFilter>('all');
const messages = ref<MobileMessage[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));
const unreadMessageCount = computed(() => messages.value.filter((message) => !message.read).length);
const notificationCount = computed(() => Math.max(unreadCount.value, unreadMessageCount.value));
const filteredMessages = computed(() => (
  activeFilter.value === 'unread'
    ? messages.value.filter((message) => !message.read)
    : messages.value
));

function loadMessages(): void {
  loading.value = true;
  errorMessage.value = '';
  try {
    messages.value = MESSAGE_FIXTURES.map((message) => ({ ...message }));
    messageStore.setUnreadCount(unreadMessageCount.value);
  } catch (error) {
    errorMessage.value = error instanceof Error && error.message ? error.message : '消息加载失败';
  } finally {
    loading.value = false;
  }
}

function selectMessage(message: MobileMessage): void {
  message.read = true;
  messageStore.setUnreadCount(unreadMessageCount.value);
}

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.messages);
  loadMessages();
});
</script>

<template>
  <MobileShell
    active-tab="messages"
    title="消息"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="notificationCount"
    :unread-count="notificationCount"
  >
    <view class="messages-page">
      <view class="message-filters">
        <view
          class="message-filter"
          :class="{ 'is-active': activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          <text>全部</text>
          <text class="message-filter__count">{{ messages.length }}</text>
        </view>
        <view
          class="message-filter"
          :class="{ 'is-active': activeFilter === 'unread' }"
          @click="activeFilter = 'unread'"
        >
          <text>未读</text>
          <text class="message-filter__count">{{ unreadMessageCount }}</text>
        </view>
      </view>

      <view v-if="loading" class="message-state fa-card">
        <text class="fa-muted">正在加载消息...</text>
      </view>

      <view v-else-if="errorMessage" class="message-state fa-card">
        <text class="message-state__error">{{ errorMessage }}</text>
        <button class="message-state__retry" @click="loadMessages">重新加载</button>
      </view>

      <view v-else-if="filteredMessages.length" class="message-list">
        <view
          v-for="message in filteredMessages"
          :key="message.id"
          class="message-row"
          :class="[
            `message-row--${message.tone}`,
            { 'is-unread': !message.read },
          ]"
          @click="selectMessage(message)"
        >
          <view class="message-row__icon">
            <MobileIcon :name="message.icon" :size="48" />
          </view>
          <view class="message-row__content">
            <text class="message-row__title">{{ message.title }}</text>
            <text class="message-row__summary">{{ message.summary }}</text>
            <text class="message-row__category">{{ message.category }}</text>
          </view>
          <view class="message-row__meta">
            <text class="message-row__time">{{ message.time }}</text>
            <view v-if="!message.read" class="message-row__dot" />
          </view>
        </view>
      </view>

      <MobileEmptyState
        v-else
        icon="messages"
        :title="activeFilter === 'unread' ? '暂无未读消息' : '暂无消息'"
        description="消息内容将在这里展示"
      />
    </view>
  </MobileShell>
</template>

<style scoped>
.messages-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 16rpx 32rpx 48rpx;
}

.message-filters {
  display: flex;
  align-items: stretch;
  height: 72rpx;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.message-filter {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 116rpx;
  height: 72rpx;
  box-sizing: border-box;
  padding: 0 0 2rpx;
  color: var(--fa-color-muted);
  font-size: 30rpx;
}

.message-filter + .message-filter {
  margin-left: 24rpx;
}

.message-filter.is-active {
  color: var(--fa-color-text);
  font-weight: 600;
}

.message-filter.is-active::after {
  position: absolute;
  right: 0;
  bottom: -1rpx;
  left: 0;
  height: 4rpx;
  border-radius: 4rpx 4rpx 0 0;
  background: var(--fa-color-primary);
  content: '';
}

.message-filter__count {
  color: inherit;
  font-size: 26rpx;
  font-weight: 400;
}

.message-list {
  border-bottom: 1rpx solid var(--fa-color-border);
}

.message-row {
  display: flex;
  align-items: flex-start;
  min-height: 152rpx;
  box-sizing: border-box;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.message-row:last-child {
  border-bottom: 0;
}

.message-row.is-unread {
  margin: 0 -32rpx;
  padding-right: 32rpx;
  padding-left: 32rpx;
  background: var(--fa-color-primary-soft);
}

.message-row__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 64rpx;
  margin-right: 20rpx;
  border-radius: 20rpx;
}

.message-row--primary .message-row__icon {
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
}

.message-row--orange .message-row__icon {
  color: var(--fa-color-orange);
  background: var(--fa-color-orange-soft);
}

.message-row--purple .message-row__icon {
  color: var(--fa-color-purple);
  background: var(--fa-color-purple-soft);
}

.message-row--green .message-row__icon {
  color: var(--fa-color-green);
  background: var(--fa-color-green-soft);
}

.message-row__content {
  min-width: 0;
  flex: 1;
}

.message-row__title,
.message-row__summary,
.message-row__category {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-row__title {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}

.message-row__summary {
  margin-top: 2rpx;
  color: var(--fa-color-text-secondary);
  font-size: 26rpx;
  line-height: 38rpx;
}

.message-row__category {
  margin-top: 2rpx;
  color: var(--fa-color-muted);
  font-size: 22rpx;
  line-height: 32rpx;
}

.message-row__meta {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  flex: 0 0 auto;
  min-width: 70rpx;
  height: 64rpx;
  margin-left: 12rpx;
}

.message-row__time {
  color: var(--fa-color-muted);
  font-size: 22rpx;
  line-height: 32rpx;
}

.message-row__dot {
  width: 16rpx;
  height: 16rpx;
  margin-top: 18rpx;
  border-radius: 50%;
  background: var(--fa-color-primary);
}

.message-state {
  margin-top: 24rpx;
  padding: 40rpx 32rpx;
  text-align: center;
}

.message-state__error {
  display: block;
  margin-bottom: 24rpx;
  color: var(--fa-color-danger);
}

.message-state__retry {
  width: 240rpx;
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
}
</style>
