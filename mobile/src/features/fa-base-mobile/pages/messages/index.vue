<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { batchReadMessages, countMessages, pageMessages, readAllMessages } from '../../api/message';
import { ApiError } from '../../common/request';
import { createPageRefresh } from '../../common/page-refresh';
import MobileEmptyState from '../../components/MobileEmptyState.vue';
import MobileIcon from '../../components/MobileIcon.vue';
import MobileShell from '../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import { useMessageStore, type MessageFilter } from '../../stores/message';
import { useTenantStore } from '../../stores/tenant';
import type { MobileMessage } from '../../types/message';
import type { MobileIconName } from '../../types/mobileIcon';
import { telemetry } from '@features/fa-core-mobile/telemetry';

type MessageTone = 'primary' | 'orange' | 'purple' | 'green';

const MESSAGE_PAGE_SIZE = 20;
const authStore = useAuthStore();
const messageStore = useMessageStore();
const tenantStore = useTenantStore();
const activeFilter = ref<MessageFilter>('all');
const loadingMore = ref(false);
const readLoading = ref(false);
const pageRefresh = createPageRefresh();
const {
  busy: loading,
  errorMessage,
  run: runRefresh,
  invalidate,
} = pageRefresh;
let requestVersion = 0;

const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));
const messages = computed(() => messageStore.getMessages(
  authStore.user?.id,
  tenantStore.currentTenantId,
  activeFilter.value,
));
const currentPage = computed(() => messageStore.getCurrentPage(
  authStore.user?.id,
  tenantStore.currentTenantId,
  activeFilter.value,
));
const hasNextPage = computed(() => messageStore.hasNextPage(
  authStore.user?.id,
  tenantStore.currentTenantId,
  activeFilter.value,
));
const filteredMessages = computed(() => messages.value);
const hasUnreadMessages = computed(() => messageStore.getUnreadCount(
  authStore.user?.id,
  tenantStore.currentTenantId,
) > 0 || messages.value.some((message) => !message.isRead));

function messageIcon(message: MobileMessage): MobileIconName {
  return message.type === 2 ? 'clock' : 'bell';
}

function messageTone(message: MobileMessage): MessageTone {
  if (message.type === 2) return 'orange';
  return message.isRead ? 'green' : 'primary';
}

function messageTypeLabel(message: MobileMessage): string {
  return message.type === 2 ? '流程消息' : '系统消息';
}

function messageSummary(message: MobileMessage): string {
  const sender = message.fromUserName?.trim();
  return sender ? `来自 ${sender}` : '来自系统';
}

function messageContent(message: MobileMessage): string {
  return message.content?.trim() || '暂无消息内容';
}

function messageTime(value?: string | null): string {
  const matched = value?.trim().match(/^\d{4}-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  return matched ? `${matched[1]}-${matched[2]} ${matched[3]}:${matched[4]}` : value?.trim() || '-';
}

function messageQuery(): Record<string, unknown> {
  return activeFilter.value === 'unread' ? { isRead: false } : {};
}

async function refreshUnreadCount(
  userId: string,
  tenantId: string | null,
  isCurrent: () => boolean = () => true,
): Promise<void> {
  try {
    const statistics = await countMessages();
    if (!isCurrent()) return;
    const unreadCount = Number(statistics?.unreadCount) || 0;
    messageStore.setUnreadCount(userId, tenantId, unreadCount);
    tenantStore.setUnreadCount(tenantId, unreadCount);
  } catch {
    // Keep the last known badge when the statistics request fails.
  }
}

function selectFilter(filter: MessageFilter): void {
  if (activeFilter.value === filter || loading.value || loadingMore.value || readLoading.value) return;
  activeFilter.value = filter;
  void loadMessages();
}

function loadMessages(): Promise<void> {
  if (loadingMore.value || readLoading.value) return Promise.resolve();

  return runRefresh(async (isCurrent) => {
    const user = authStore.user ?? await authStore.loadCurrentUser();
    if (!isCurrent()) return;
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    if (!tenantStore.currentWorkspace) await tenantStore.loadForUser(user.id);
    if (!isCurrent()) return;

    const page = await pageMessages({
      current: 1,
      pageSize: MESSAGE_PAGE_SIZE,
      query: messageQuery(),
    });
    if (!isCurrent()) return;

    const rows = Array.isArray(page.rows) ? page.rows : [];
    const tenantId = tenantStore.currentTenantId;
    messageStore.setMessages(
      user.id,
      tenantId,
      activeFilter.value,
      rows,
      page.pagination?.current || 1,
      Boolean(page.pagination?.hasNextPage && rows.length),
    );
    await refreshUnreadCount(user.id, tenantId, isCurrent);
  }, () => messageStore.hasMessages(
    authStore.user?.id,
    tenantStore.currentTenantId,
    activeFilter.value,
  ), (error) => (
    error instanceof ApiError ? error.message : '消息加载失败，请稍后重试'
  ));
}

async function loadMoreMessages(): Promise<void> {
  if (!hasNextPage.value || loading.value || loadingMore.value || readLoading.value) return;
  const userId = authStore.user?.id;
  const tenantId = tenantStore.currentTenantId;
  if (!userId || !tenantId) return;

  const version = ++requestVersion;
  loadingMore.value = true;
  errorMessage.value = '';
  try {
    const page = await pageMessages({
      current: currentPage.value + 1,
      pageSize: MESSAGE_PAGE_SIZE,
      query: messageQuery(),
    });
    if (version !== requestVersion) return;

    const rows = Array.isArray(page.rows) ? page.rows : [];
    messageStore.appendMessages(
      userId,
      tenantId,
      activeFilter.value,
      rows,
      page.pagination?.current || currentPage.value + 1,
      Boolean(page.pagination?.hasNextPage && rows.length),
    );
  } catch (error) {
    if (version === requestVersion) {
      errorMessage.value = error instanceof ApiError ? error.message : '更多消息加载失败，请稍后重试';
    }
  } finally {
    if (version === requestVersion) loadingMore.value = false;
  }
}

function refreshMessages(): void {
  void loadMessages();
}

async function markMessageRead(message: MobileMessage): Promise<void> {
  if (readLoading.value || message.isRead) return;

  readLoading.value = true;
  errorMessage.value = '';
  try {
    await batchReadMessages([message.id]);
    const userId = authStore.user?.id;
    const tenantId = tenantStore.currentTenantId;
    messageStore.markRead(userId, tenantId, message.id);
    const unreadCount = messageStore.getUnreadCount(userId, tenantId) - 1;
    messageStore.setUnreadCount(userId, tenantId, unreadCount);
    tenantStore.setUnreadCount(tenantId, unreadCount);
    if (userId) await refreshUnreadCount(userId, tenantId);
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '消息已读失败，请稍后重试';
  } finally {
    readLoading.value = false;
  }
}

function confirmReadAll(): void {
  if (readLoading.value || !hasUnreadMessages.value) return;

  uni.showModal({
    title: '全部已读',
    content: '确认将全部消息标记为已读吗？',
    confirmText: '全部已读',
    success: ({ confirm }) => {
      if (confirm) void markAllMessagesRead();
    },
  });
}

async function markAllMessagesRead(): Promise<void> {
  if (readLoading.value) return;

  readLoading.value = true;
  errorMessage.value = '';
  try {
    await readAllMessages();
    const userId = authStore.user?.id;
    const tenantId = tenantStore.currentTenantId;
    messageStore.markAllRead(userId, tenantId);
    tenantStore.setUnreadCount(tenantId, 0);
    if (userId) await refreshUnreadCount(userId, tenantId);
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '全部已读失败，请稍后重试';
  } finally {
    readLoading.value = false;
  }
}

onBeforeUnmount(() => {
  requestVersion += 1;
  invalidate();
});

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.messages);
  void loadMessages();
});
</script>

<template>
  <MobileShell
    active-tab="messages"
    title="消息"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="unreadCount"
    :unread-count="unreadCount"
  >
    <view class="messages-page">
      <view class="message-toolbar">
        <view class="message-filters">
          <view
            class="message-filter"
            :class="{ 'is-active': activeFilter === 'all' }"
            @click="selectFilter('all')"
          >
            <text>全部</text>
          </view>
          <view
            class="message-filter"
            :class="{ 'is-active': activeFilter === 'unread' }"
            @click="selectFilter('unread')"
          >
            <text>未读</text>
          </view>
        </view>
        <button
          class="message-read-all"
          :disabled="readLoading || !hasUnreadMessages"
          @click="confirmReadAll"
        >全部已读</button>
        <button
          class="message-refresh"
          :disabled="loading || loadingMore || readLoading"
          @click="refreshMessages"
        >刷新</button>
      </view>

      <view v-if="loading && !messages.length" class="message-state fa-card">
        <text class="fa-muted">正在加载消息...</text>
      </view>

      <template v-else>
        <view v-if="errorMessage" class="message-state fa-card">
          <text class="message-state__error">{{ errorMessage }}</text>
          <button class="message-state__retry" @click="refreshMessages">重新加载</button>
        </view>

        <view v-if="filteredMessages.length" class="message-list">
          <view
            v-for="message in filteredMessages"
            :key="message.id"
            class="message-row"
            :class="[
              `message-row--${messageTone(message)}`,
              { 'is-unread': !message.isRead },
            ]"
            @click="markMessageRead(message)"
          >
            <view class="message-row__icon">
              <MobileIcon :name="messageIcon(message)" :size="48" />
            </view>
            <view class="message-row__content">
              <text class="message-row__title">{{ messageContent(message) }}</text>
              <text class="message-row__summary">{{ messageSummary(message) }}</text>
              <text class="message-row__category">{{ messageTypeLabel(message) }}</text>
            </view>
            <view class="message-row__meta">
              <text class="message-row__time">{{ messageTime(message.crtTime) }}</text>
              <view v-if="!message.isRead" class="message-row__dot" />
            </view>
          </view>
        </view>

        <view v-if="loadingMore" class="message-loading-more fa-muted">正在加载更多...</view>
        <button
          v-else-if="hasNextPage"
          class="message-load-more"
          @click="loadMoreMessages"
        >加载更多</button>

        <MobileEmptyState
          v-else-if="!errorMessage && !filteredMessages.length"
          icon="messages"
          :title="activeFilter === 'unread' ? '暂无未读消息' : '暂无消息'"
          description="消息内容将在这里展示"
        />
      </template>
    </view>
  </MobileShell>
</template>

<style scoped>
.messages-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 16rpx 32rpx 48rpx;
}

.message-toolbar {
  display: flex;
  align-items: stretch;
  height: 72rpx;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.message-filters {
  flex: 1;
  display: flex;
  align-items: stretch;
  height: 72rpx;
}

.message-refresh {
  width: 96rpx;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--fa-radius-sm);
  color: var(--fa-color-primary);
  background-color: transparent;
  font-size: 26rpx;
  line-height: 72rpx;
}

.message-read-all {
  width: 132rpx;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--fa-radius-sm);
  color: var(--fa-color-primary);
  background-color: transparent;
  font-size: 26rpx;
  line-height: 72rpx;
}

.message-refresh:active,
.message-read-all:active,
.message-refresh.button-hover,
.message-read-all.button-hover {
  color: var(--fa-color-primary);
  background-color: var(--fa-color-primary-soft);
}

.message-refresh[disabled],
.message-read-all[disabled] {
  color: var(--fa-color-muted);
  background-color: transparent;
  opacity: 1;
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

.message-loading-more {
  display: block;
  padding: 24rpx 0;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
}

.message-load-more {
  display: block;
  width: 240rpx;
  margin: 24rpx auto 0;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
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
