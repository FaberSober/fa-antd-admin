<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { ApiError } from '../../common/request';
import { pageContacts } from '../../api/contacts';
import MobileEmptyState from '../../components/MobileEmptyState.vue';
import MobileIcon from '../../components/MobileIcon.vue';
import MobileSearchField from '../../components/MobileSearchField.vue';
import MobileSectionHeader from '../../components/MobileSectionHeader.vue';
import MobileShell from '../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import { useTenantStore } from '../../stores/tenant';
import type { PortalContactSummary } from '../../types/contacts';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const CONTACTS_PAGE_SIZE = 100;
const searchQuery = ref('');
const allContacts = ref<PortalContactSummary[]>([]);
const contactsLoading = ref(false);
const errorMessage = ref('');
let requestVersion = 0;

const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));
const normalizedSearchQuery = computed(() => searchQuery.value.trim());
const hasSearch = computed(() => Boolean(normalizedSearchQuery.value));
const sectionTitle = computed(() => (hasSearch.value ? '搜索结果' : '联系人'));
const visibleContacts = computed(() => {
  const keyword = normalizedSearchQuery.value.toLocaleLowerCase();
  if (!keyword) return allContacts.value;

  return allContacts.value.filter((contact) =>
    [contact.name, contact.username, contact.departmentName, contact.roleNames]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase().includes(keyword)),
  );
});

function contactSubtitle(contact: PortalContactSummary): string {
  return [contact.username?.trim(), contact.departmentName?.trim()]
    .filter(Boolean)
    .join(' · ') || '暂无部门信息';
}

function contactTone(index: number): 'primary' | 'purple' | 'orange' {
  return ['primary', 'purple', 'orange'][index % 3] as 'primary' | 'purple' | 'orange';
}

function contactMark(contact: PortalContactSummary): string {
  return contact.name?.slice(0, 1) || '?';
}

function openOrganization(): void {
  uni.navigateTo({ url: MOBILE_PAGE_ROUTES.contactsOrganization });
}

function openContact(userId: string): void {
  uni.navigateTo({
    url: `${MOBILE_PAGE_ROUTES.contactsDetail}?id=${encodeURIComponent(userId)}`,
  });
}

async function loadAllContacts(version: number): Promise<PortalContactSummary[] | null> {
  const result: PortalContactSummary[] = [];
  let current = 1;

  while (version === requestVersion) {
    const page = await pageContacts({
      current,
      pageSize: CONTACTS_PAGE_SIZE,
    });
    if (version !== requestVersion) return null;

    const rows = Array.isArray(page.rows) ? page.rows : [];
    result.push(...rows);
    if (!page.pagination?.hasNextPage || rows.length === 0) return result;
    current += 1;
  }

  return null;
}

async function loadContacts(): Promise<void> {
  const version = ++requestVersion;
  contactsLoading.value = true;
  errorMessage.value = '';
  try {
    const user = authStore.user ?? await authStore.loadCurrentUser();
    if (version !== requestVersion) return;
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    if (!tenantStore.currentWorkspace) {
      await tenantStore.loadForUser(user.id);
    }
    if (version !== requestVersion) return;

    const loadedContacts = await loadAllContacts(version);
    if (version !== requestVersion) return;
    if (loadedContacts) allContacts.value = loadedContacts;
  } catch (error) {
    if (version !== requestVersion) return;
    allContacts.value = [];
    errorMessage.value = error instanceof ApiError ? error.message : '联系人加载失败，请稍后重试';
  } finally {
    if (version === requestVersion) contactsLoading.value = false;
  }
}

onBeforeUnmount(() => {
  requestVersion += 1;
});

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.contacts);
  void loadContacts();
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
      <MobileSearchField v-model="searchQuery" placeholder="搜索联系人、账号、部门" />

      <view class="directory-section">
        <MobileSectionHeader title="组织与联系人" />
        <view class="directory-card fa-card">
          <view class="directory-entry" @click="openOrganization">
            <view class="directory-entry__icon directory-entry__icon--primary">
              <MobileIcon name="organization" :size="48" />
            </view>
            <view class="directory-entry__copy">
              <view class="directory-entry__title">组织架构</view>
              <view class="directory-entry__description">查看全部成员与部门</view>
            </view>
            <MobileIcon name="chevron-right" :size="36" class="directory-entry__arrow" />
          </view>
          <view class="directory-entry">
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
        <MobileSectionHeader :title="sectionTitle" />
        <view v-if="contactsLoading" class="contacts-state fa-card">
          <text class="fa-muted">正在加载联系人...</text>
        </view>

        <view v-else-if="errorMessage" class="contacts-state fa-card">
          <text class="contacts-state__error">{{ errorMessage }}</text>
          <button class="contacts-state__retry" @click="loadContacts">重新加载</button>
        </view>

        <view v-else-if="visibleContacts.length" class="contact-list">
          <view
            v-for="(contact, index) in visibleContacts"
            :key="contact.id"
            class="contact-row"
            @click="openContact(contact.id)"
          >
            <view
              class="contact-row__avatar"
              :class="`contact-row__avatar--${contactTone(index)}`"
            >
              {{ contactMark(contact) }}
            </view>
            <view class="contact-row__copy">
              <view class="contact-row__name">{{ contact.name }}</view>
              <view class="contact-row__description">{{ contactSubtitle(contact) }}</view>
            </view>
            <MobileIcon name="chevron-right" :size="36" class="contact-row__arrow" />
          </view>
        </view>

        <MobileEmptyState
          v-else
          icon="contacts"
          :title="hasSearch ? '没有找到匹配联系人' : '暂无联系人'"
          :description="hasSearch ? '尝试搜索其他关键词' : '当前租户暂无可用联系人'"
        />
      </view>
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
  min-height: var(--fa-size-touch);
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
  line-height: var(--fa-size-touch);
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
