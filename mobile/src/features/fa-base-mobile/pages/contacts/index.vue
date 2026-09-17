<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import MobileEmptyState from '../../components/MobileEmptyState.vue';
import MobileIcon from '../../components/MobileIcon.vue';
import MobileSearchField from '../../components/MobileSearchField.vue';
import MobileSectionHeader from '../../components/MobileSectionHeader.vue';
import MobileShell from '../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import { useTenantStore } from '../../stores/tenant';
import { telemetry } from '@features/fa-core-mobile/telemetry';

type ContactTone = 'primary' | 'purple' | 'orange';

interface ContactPreview {
  id: string;
  name: string;
  role: string;
  department: string;
  tone: ContactTone;
}

// 联系人接口尚未确定，开发环境只使用隔离的视觉数据；生产构建展示正式空态。
const CONTACT_FIXTURES: readonly ContactPreview[] = import.meta.env.DEV
  ? [
      { id: 'lin-xiao', name: '林晓', role: '产品负责人', department: '产品部', tone: 'primary' },
      { id: 'chen-mo', name: '陈默', role: '技术负责人', department: '研发中心', tone: 'purple' },
      { id: 'su-wan', name: '苏婉', role: '客户成功经理', department: '客户成功部', tone: 'orange' },
    ]
  : [];

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const searchQuery = ref('');
const contacts = ref<ContactPreview[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));
const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase());
const filteredContacts = computed(() => {
  const keyword = normalizedSearchQuery.value;
  if (!keyword) return contacts.value;
  return contacts.value.filter((contact) => (
    [contact.name, contact.role, contact.department]
      .some((value) => value.toLocaleLowerCase().includes(keyword))
  ));
});

function loadContacts(): void {
  loading.value = true;
  errorMessage.value = '';
  try {
    contacts.value = CONTACT_FIXTURES.map((contact) => ({ ...contact }));
  } catch (error) {
    errorMessage.value = error instanceof Error && error.message ? error.message : '联系人加载失败';
  } finally {
    loading.value = false;
  }
}

function showContactMessage(title: string): void {
  uni.showToast({ title: `${title}功能即将开放`, icon: 'none' });
}

function showAllContacts(): void {
  showContactMessage('全部联系人');
}

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.contacts);
  loadContacts();
});
</script>

<template>
  <MobileShell
    active-tab="contacts"
    title="联系人"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="unreadCount"
    :unread-count="unreadCount"
  >
    <view class="contacts-page">
      <view v-if="loading" class="contacts-state fa-card">
        <text class="fa-muted">正在加载联系人...</text>
      </view>

      <view v-else-if="errorMessage" class="contacts-state fa-card">
        <text class="contacts-state__error">{{ errorMessage }}</text>
        <button class="contacts-state__retry" @click="loadContacts">重新加载</button>
      </view>

      <template v-else>
        <MobileSearchField v-model="searchQuery" placeholder="搜索联系人、部门" />

        <view class="directory-section">
          <MobileSectionHeader title="组织与联系人" />
          <view class="directory-card fa-card">
            <view class="directory-entry" @click="showContactMessage('组织架构')">
              <view class="directory-entry__icon directory-entry__icon--primary">
                <MobileIcon name="organization" :size="48" />
              </view>
              <view class="directory-entry__copy">
                <view class="directory-entry__title">组织架构</view>
                <view class="directory-entry__description">查看全部成员与部门</view>
              </view>
              <MobileIcon name="chevron-right" :size="36" class="directory-entry__arrow" />
            </view>
            <view class="directory-entry" @click="showContactMessage('我的联系人')">
              <view class="directory-entry__icon directory-entry__icon--purple">
                <MobileIcon name="contacts" :size="48" />
              </view>
              <view class="directory-entry__copy">
                <view class="directory-entry__title">我的联系人</view>
                <view class="directory-entry__description">常用联系人</view>
              </view>
              <MobileIcon name="chevron-right" :size="36" class="directory-entry__arrow" />
            </view>
          </view>
        </view>

        <view class="recent-section">
          <MobileSectionHeader title="最近联系人" action-text="全部" @action="showAllContacts" />
          <view v-if="filteredContacts.length" class="contact-list">
            <view
              v-for="contact in filteredContacts"
              :key="contact.id"
              class="contact-row"
              @click="showContactMessage(contact.name)"
            >
              <view
                class="contact-row__avatar"
                :class="`contact-row__avatar--${contact.tone}`"
              >
                {{ contact.name.slice(0, 1) }}
              </view>
              <view class="contact-row__copy">
                <view class="contact-row__name">{{ contact.name }}</view>
                <view class="contact-row__description">{{ contact.role }} · {{ contact.department }}</view>
              </view>
              <MobileIcon name="chevron-right" :size="36" class="contact-row__arrow" />
            </view>
          </view>
          <MobileEmptyState
            v-else
            icon="contacts"
            :title="searchQuery ? '没有找到匹配联系人' : '暂无联系人'"
            :description="searchQuery ? '尝试搜索其他关键词' : '联系人数据接入后将在这里展示'"
          />
        </view>
      </template>
    </view>
  </MobileShell>
</template>

<style scoped>
.contacts-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 0 32rpx 48rpx;
}

.directory-section {
  margin-top: 24rpx;
}

.recent-section {
  margin-top: 32rpx;
}

.contacts-page :deep(.mobile-section-header),
.contacts-page :deep(.mobile-section-header__action) {
  min-height: 80rpx;
}

.contacts-state {
  margin-top: 24rpx;
  padding: 40rpx 32rpx;
  text-align: center;
}

.contacts-state__error {
  display: block;
  margin-bottom: 24rpx;
  color: var(--fa-color-danger);
}

.contacts-state__retry {
  width: 240rpx;
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
}

.directory-card {
  padding: 0;
  overflow: hidden;
}

.directory-entry {
  display: flex;
  align-items: center;
  min-height: 96rpx;
  box-sizing: border-box;
  padding: 16rpx 24rpx;
}

.directory-entry + .directory-entry {
  border-top: 1rpx solid var(--fa-color-border);
}

.directory-entry:active,
.contact-row:active {
  opacity: 0.78;
}

.directory-entry__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 64rpx;
  margin-right: 20rpx;
  border-radius: 20rpx;
}

.directory-entry__icon--primary {
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
}

.directory-entry__icon--purple {
  color: var(--fa-color-purple);
  background: var(--fa-color-purple-soft);
}

.directory-entry__copy,
.contact-row__copy {
  min-width: 0;
  flex: 1;
}

.directory-entry__title,
.directory-entry__description,
.contact-row__name,
.contact-row__description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.directory-entry__title {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}

.directory-entry__description,
.contact-row__description {
  margin-top: 2rpx;
  color: var(--fa-color-text-secondary);
  font-size: 26rpx;
  line-height: 38rpx;
}

.directory-entry__arrow,
.contact-row__arrow {
  flex: 0 0 auto;
  margin-left: 16rpx;
  color: var(--fa-color-border-strong);
}

.contact-list {
  padding: 0 4rpx;
}

.contact-row {
  display: flex;
  align-items: center;
  min-height: 104rpx;
  box-sizing: border-box;
  padding: 16rpx 0;
}

.contact-row__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 64rpx;
  margin-right: 20rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.contact-row__avatar--primary {
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
}

.contact-row__avatar--purple {
  color: var(--fa-color-purple);
  background: var(--fa-color-purple-soft);
}

.contact-row__avatar--orange {
  color: var(--fa-color-orange);
  background: var(--fa-color-orange-soft);
}

.contact-row__name {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}
</style>
