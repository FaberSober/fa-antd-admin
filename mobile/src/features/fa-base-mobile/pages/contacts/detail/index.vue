<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getContactDetail } from '../../../api/contacts';
import { buildFilePreviewUrl } from '../../../api/file';
import { ApiError } from '../../../common/request';
import { createPageRefresh } from '../../../common/page-refresh';
import MobileEmptyState from '../../../components/MobileEmptyState.vue';
import MobileIcon from '../../../components/MobileIcon.vue';
import MobileSectionHeader from '../../../components/MobileSectionHeader.vue';
import MobileShell from '../../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../../feature';
import { useAuthStore } from '../../../stores/auth';
import { useContactsStore } from '../../../stores/contacts';
import { useTenantStore } from '../../../stores/tenant';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const authStore = useAuthStore();
const contactsStore = useContactsStore();
const tenantStore = useTenantStore();
const contactId = ref('');
const avatarLoadError = ref(false);
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
const contact = computed(() => contactsStore.getContactDetail(
  authStore.user?.id,
  tenantStore.currentTenantId,
  contactId.value,
));
const avatarUrl = computed(() => {
  const avatar = contact.value?.avatar?.trim();
  if (!avatar) return '';
  if (/^(?:https?:)?\/\//.test(avatar) || avatar.startsWith('/') || avatar.startsWith('data:')) {
    return avatar;
  }
  return buildFilePreviewUrl(avatar);
});

function contactMark(): string {
  return contact.value?.name?.slice(0, 1) || '?';
}

function displayValue(value?: string | null, fallback = '未提供'): string {
  return value?.trim() || fallback;
}

function workStatusLabel(value?: number | null): string {
  return ({ 0: '在职', 1: '请假', 2: '离职' } as Record<number, string>)[value ?? -1] || '未知';
}

function workStatusClass(value?: number | null): string {
  if (value === 0) return 'is-active';
  if (value === 1) return 'is-leave';
  if (value === 2) return 'is-departed';
  return '';
}

function loadDetail(id = contactId.value): Promise<void> {
  avatarLoadError.value = false;
  return runRefresh(async (isCurrent) => {
    if (!id) throw new Error('联系人参数缺失');
    const user = authStore.user ?? await authStore.loadCurrentUser();
    if (!isCurrent()) return;
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    if (!tenantStore.currentWorkspace) await tenantStore.loadForUser(user.id);
    if (!isCurrent()) return;

    const result = await getContactDetail(id);
    if (!isCurrent()) return;
    contactsStore.setContactDetail(user.id, tenantStore.currentTenantId, result);
  }, () => contactsStore.hasContactDetail(
    authStore.user?.id,
    tenantStore.currentTenantId,
    id,
  ), (error) => (
    error instanceof ApiError ? error.message : '联系人详情加载失败，请稍后重试'
  ));
}

function goBack(): void {
  uni.navigateBack({
    delta: 1,
    fail: () => uni.reLaunch({ url: MOBILE_PAGE_ROUTES.contacts }),
  });
}

function copyValue(value: string | null | undefined, successTitle: string): void {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return;

  uni.setClipboardData({
    data: normalizedValue,
    success: () => uni.showToast({ title: successTitle, icon: 'none' }),
    fail: () => uni.showToast({ title: '复制失败，请稍后重试', icon: 'none' }),
  });
}

function callPhone(): void {
  const phone = contact.value?.tel?.trim();
  if (!phone) return;

  uni.makePhoneCall({
    phoneNumber: phone,
    fail: () => copyValue(phone, '手机号已复制'),
  });
}

function copyEmail(): void {
  copyValue(contact.value?.email, '邮箱已复制');
}

onLoad((options) => {
  contactId.value = typeof options?.id === 'string' ? options.id : '';
  telemetry.page(MOBILE_PAGE_ROUTES.contactsDetail);
  void loadDetail();
});

onBeforeUnmount(() => {
  invalidate();
});
</script>

<template>
  <MobileShell
    active-tab="contacts"
    title="联系人详情"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="unreadCount"
    :unread-count="unreadCount"
    :show-tab-bar="false"
  >
    <view class="contact-detail-page">
      <view class="contact-detail-toolbar">
        <view class="contact-detail-back" @tap="goBack">
          <MobileIcon name="chevron-right" :size="36" class="contact-detail-back__icon" />
          <text>返回联系人</text>
        </view>
      </view>

      <view v-if="initialLoading" class="contact-detail-state fa-card">
        <text class="fa-muted">正在加载联系人详情...</text>
      </view>

      <view v-else-if="errorMessage" class="contact-detail-state fa-card">
        <text class="contact-detail-state__error">{{ errorMessage }}</text>
        <button class="contact-detail-state__retry" @tap="loadDetail()">重新加载</button>
      </view>

      <template v-else-if="contact">
        <view class="contact-profile fa-card">
          <image
            v-if="avatarUrl && !avatarLoadError"
            class="contact-profile__avatar contact-profile__avatar--image"
            :src="avatarUrl"
            mode="aspectFill"
            @error="avatarLoadError = true"
          />
          <view v-else class="contact-profile__avatar">{{ contactMark() }}</view>
          <view class="contact-profile__main">
            <text class="contact-profile__name">{{ displayValue(contact.name, '未命名联系人') }}</text>
            <text class="contact-profile__account">{{ displayValue(contact.username, '暂无账号') }}</text>
          </view>
          <text
            class="contact-profile__status"
            :class="workStatusClass(contact.workStatus)"
          >{{ workStatusLabel(contact.workStatus) }}</text>
        </view>

        <view class="contact-info fa-card">
          <MobileSectionHeader title="基本信息" />
          <view class="contact-info__row">
            <text class="contact-info__label">账号</text>
            <text class="contact-info__value">{{ displayValue(contact.username) }}</text>
          </view>
          <view class="contact-info__row">
            <text class="contact-info__label">部门</text>
            <text class="contact-info__value">{{ displayValue(contact.departmentName, '暂无部门') }}</text>
          </view>
          <view class="contact-info__row">
            <text class="contact-info__label">工作状态</text>
            <text class="contact-info__value">{{ workStatusLabel(contact.workStatus) }}</text>
          </view>
        </view>

        <view class="contact-info fa-card">
          <MobileSectionHeader title="联系方式" />
          <view class="contact-info__row contact-action">
            <text class="contact-info__label">手机号</text>
            <view class="contact-action__value">
              <text class="contact-action__text">{{ displayValue(contact.tel) }}</text>
              <button v-if="contact.tel" class="contact-action__button" @tap="callPhone">拨打</button>
            </view>
          </view>
          <view class="contact-info__row contact-action">
            <text class="contact-info__label">邮箱</text>
            <view class="contact-action__value">
              <text class="contact-action__text">{{ displayValue(contact.email) }}</text>
              <button v-if="contact.email" class="contact-action__button" @tap="copyEmail">复制</button>
            </view>
          </view>
        </view>
      </template>

      <MobileEmptyState
        v-else
        icon="contacts"
        title="未找到联系人"
        description="该联系人可能已失效"
      />
    </view>
  </MobileShell>
</template>

<style scoped>
.contact-detail-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 0 32rpx calc(48rpx + var(--fa-safe-area-bottom));
}

.contact-detail-toolbar {
  min-height: var(--fa-size-touch);
}

.contact-detail-back {
  display: flex;
  align-items: center;
  min-height: var(--fa-size-touch);
  color: var(--fa-color-primary);
  font-size: 28rpx;
}

.contact-detail-back:active {
  opacity: 0.78;
}

.contact-detail-back__icon {
  margin-right: 4rpx;
  transform: rotate(180deg);
}

.contact-detail-state {
  margin-top: 24rpx;
  padding: 40rpx 32rpx;
  text-align: center;
}

.contact-detail-state__error {
  display: block;
  margin-bottom: 24rpx;
  color: var(--fa-color-danger);
}

.contact-detail-state__retry {
  width: 240rpx;
  margin: 0 auto;
  min-height: var(--fa-size-touch);
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
  line-height: var(--fa-size-touch);
}

.contact-profile {
  display: flex;
  align-items: center;
  padding: 32rpx;
}

.contact-profile__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 112rpx;
  height: 112rpx;
  margin-right: 24rpx;
  border-radius: 32rpx;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 48rpx;
  font-weight: 700;
}

.contact-profile__avatar--image {
  background: var(--fa-color-surface-muted);
}

.contact-profile__main {
  min-width: 0;
  flex: 1;
}

.contact-profile__name,
.contact-profile__account {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-profile__name {
  color: var(--fa-color-text);
  font-size: 38rpx;
  font-weight: 700;
  line-height: 52rpx;
}

.contact-profile__account {
  margin-top: 6rpx;
  color: var(--fa-color-text-secondary);
  font-size: 26rpx;
  line-height: 38rpx;
}

.contact-profile__status {
  flex: 0 0 auto;
  margin-left: 16rpx;
  padding: 6rpx 14rpx;
  border-radius: var(--fa-radius-pill);
  color: var(--fa-color-muted);
  background: var(--fa-color-surface-muted);
  font-size: 22rpx;
  line-height: 32rpx;
}

.contact-profile__status.is-active {
  color: var(--fa-color-success);
  background: var(--fa-color-success-soft);
}

.contact-profile__status.is-leave {
  color: var(--fa-color-orange);
  background: var(--fa-color-orange-soft);
}

.contact-profile__status.is-departed {
  color: var(--fa-color-danger);
  background: var(--fa-color-danger-soft);
}

.contact-info {
  margin-top: 24rpx;
  padding: 16rpx 32rpx 24rpx;
}

.contact-info :deep(.mobile-section-header) {
  min-height: 72rpx;
}

.contact-info__row {
  display: flex;
  align-items: center;
  min-height: 80rpx;
  border-top: 1rpx solid var(--fa-color-border);
}

.contact-info__label {
  flex: 0 0 144rpx;
  color: var(--fa-color-muted);
  font-size: 26rpx;
  line-height: 38rpx;
}

.contact-info__value {
  min-width: 0;
  flex: 1;
  color: var(--fa-color-text);
  font-size: 28rpx;
  line-height: 40rpx;
  text-align: right;
}

.contact-action__value {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
}

.contact-action__text {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: var(--fa-color-text);
  font-size: 28rpx;
  line-height: 40rpx;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-action__button {
  flex: 0 0 auto;
  min-width: 112rpx;
  min-height: 64rpx;
  margin: 0 0 0 16rpx;
  padding: 0 18rpx;
  border: 0;
  border-radius: var(--fa-radius-pill);
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 24rpx;
  line-height: 64rpx;
}

.contact-action__button::after {
  border: 0;
}
</style>
