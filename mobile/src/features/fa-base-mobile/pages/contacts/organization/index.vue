<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getContactDepartments, pageContacts } from '../../../api/contacts';
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
import type { PortalContactSummary, PortalDepartmentNode } from '../../../types/contacts';
import { telemetry } from '@features/fa-core-mobile/telemetry';

type DirectoryTone = 'primary' | 'purple' | 'orange';

const DIRECTORY_PAGE_SIZE = 20;
const authStore = useAuthStore();
const contactsStore = useContactsStore();
const tenantStore = useTenantStore();
const breadcrumbs = ref<PortalDepartmentNode[]>([]);
const loadingMore = ref(false);
const directoryRefresh = createPageRefresh();
const memberRefresh = createPageRefresh();
const {
  errorMessage,
  initialLoading: departmentInitialLoading,
  run: runDirectoryRefresh,
  invalidate: invalidateDirectory,
} = directoryRefresh;
const {
  errorMessage: memberErrorMessage,
  initialLoading: memberInitialLoading,
  busy: memberLoading,
  run: runMemberRefresh,
  invalidate: invalidateMembers,
} = memberRefresh;
let requestVersion = 0;

const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));
const currentDepartment = computed(() => (
  breadcrumbs.value[breadcrumbs.value.length - 1] || null
));
const isRoot = computed(() => !currentDepartment.value);
const pageTitle = computed(() => currentDepartment.value?.name || '组织架构');
const departments = computed(() => contactsStore.getDepartments(
  authStore.user?.id,
  tenantStore.currentTenantId,
));
const visibleDepartments = computed(() => currentDepartment.value?.children || departments.value);
const memberTitle = computed(() => `${currentDepartment.value?.name || ''}成员`);
const memberCache = computed(() => contactsStore.getDepartmentMembers(
  authStore.user?.id,
  tenantStore.currentTenantId,
  currentDepartment.value?.id,
));
const members = computed(() => memberCache.value?.rows || []);
const currentMemberPage = computed(() => memberCache.value?.currentPage || 1);
const hasNextPage = computed(() => Boolean(memberCache.value?.hasNextPage));

function departmentTone(index: number): DirectoryTone {
  return ['primary', 'purple', 'orange'][index % 3] as DirectoryTone;
}

function contactMark(contact: PortalContactSummary): string {
  return contact.name?.slice(0, 1) || '?';
}

function contactSubtitle(contact: PortalContactSummary): string {
  return [contact.username?.trim(), contact.departmentName?.trim()]
    .filter(Boolean)
    .join(' · ') || '暂无部门信息';
}

function openContact(userId: string): void {
  uni.navigateTo({
    url: `${MOBILE_PAGE_ROUTES.contactsDetail}?id=${encodeURIComponent(userId)}`,
  });
}

function resetMembers(): void {
  requestVersion += 1;
  invalidateMembers();
  loadingMore.value = false;
}

async function ensureSession(isCurrent: () => boolean): Promise<boolean> {
  const user = authStore.user ?? await authStore.loadCurrentUser();
  if (!isCurrent()) return false;
  if (!user) {
    uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
    return false;
  }
  if (!tenantStore.currentWorkspace && !tenantStore.hasLoadedForUser(user.id)) {
    await tenantStore.loadForUser(user.id);
  }
  return isCurrent();
}

function loadDirectory(): Promise<void> {
  resetMembers();
  return runDirectoryRefresh(async (isCurrent) => {
    if (!await ensureSession(isCurrent)) return;

    const result = await getContactDepartments();
    if (!isCurrent()) return;
    const userId = authStore.user?.id;
    if (userId) {
      contactsStore.setDepartments(userId, tenantStore.currentTenantId, Array.isArray(result) ? result : []);
      const departmentId = currentDepartment.value?.id;
      if (departmentId) await loadMembers(departmentId);
    }
  }, () => contactsStore.hasDepartments(authStore.user?.id, tenantStore.currentTenantId), (error) => (
    error instanceof ApiError ? error.message : '组织架构加载失败，请稍后重试'
  ));
}

function loadMembers(departmentId: string): Promise<void> {
  return runMemberRefresh(async (isCurrent) => {
    const page = await pageContacts({
      current: 1,
      pageSize: DIRECTORY_PAGE_SIZE,
      query: { departmentId },
    });
    if (!isCurrent()) return;

    const rows = Array.isArray(page.rows) ? page.rows : [];
    const userId = authStore.user?.id;
    if (userId) {
      contactsStore.setDepartmentMembers(
        userId,
        tenantStore.currentTenantId,
        departmentId,
        rows,
        page.pagination?.current || 1,
        Boolean(page.pagination?.hasNextPage && rows.length),
      );
    }
  }, () => contactsStore.hasDepartmentMembers(
    authStore.user?.id,
    tenantStore.currentTenantId,
    departmentId,
  ), (error) => (
    error instanceof ApiError ? error.message : '成员加载失败，请稍后重试'
  ));
}

async function loadMoreMembers(): Promise<void> {
  const departmentId = currentDepartment.value?.id;
  if (!departmentId || !hasNextPage.value || memberLoading.value || loadingMore.value) return;

  const version = ++requestVersion;
  loadingMore.value = true;
  try {
    const page = await pageContacts({
      current: currentMemberPage.value + 1,
      pageSize: DIRECTORY_PAGE_SIZE,
      query: { departmentId },
    });
    if (version !== requestVersion) return;

    const rows = Array.isArray(page.rows) ? page.rows : [];
    const userId = authStore.user?.id;
    if (userId) {
      contactsStore.appendDepartmentMembers(
        userId,
        tenantStore.currentTenantId,
        departmentId,
        rows,
        page.pagination?.current || currentMemberPage.value + 1,
        Boolean(page.pagination?.hasNextPage && rows.length),
      );
    }
  } catch (error) {
    if (version !== requestVersion) return;
    const message = error instanceof ApiError ? error.message : '更多成员加载失败，请稍后重试';
    if (members.value.length) {
      uni.showToast({ title: message, icon: 'none' });
    } else {
      memberErrorMessage.value = message;
    }
  } finally {
    if (version === requestVersion) loadingMore.value = false;
  }
}

function openDepartment(department: PortalDepartmentNode): void {
  resetMembers();
  breadcrumbs.value = [...breadcrumbs.value, department];
  void loadMembers(department.id);
}

function selectBreadcrumb(index: number): void {
  const department = breadcrumbs.value[index];
  if (!department) return;
  resetMembers();
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
  void loadMembers(department.id);
}

function goToRoot(): void {
  requestVersion += 1;
  breadcrumbs.value = [];
  resetMembers();
}

function handleBack(): void {
  if (!breadcrumbs.value.length) {
    uni.navigateBack({ delta: 1 });
    return;
  }

  resetMembers();
  breadcrumbs.value = breadcrumbs.value.slice(0, -1);
  const parent = currentDepartment.value;
  if (parent) {
    void loadMembers(parent.id);
  } else {
    resetMembers();
  }
}

onBeforeUnmount(() => {
  requestVersion += 1;
  invalidateDirectory();
  invalidateMembers();
});

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.contactsOrganization);
  void loadDirectory();
});
</script>

<template>
  <MobileShell
    active-tab="contacts"
    :title="pageTitle"
    :tenant-name="tenantStore.currentWorkspace?.tenantName"
    :tenant-role="tenantRole"
    :notification-count="unreadCount"
    :unread-count="unreadCount"
    :show-tab-bar="false"
  >
    <view class="organization-page">
      <view class="organization-toolbar">
        <view class="organization-back" @tap="handleBack">
          <MobileIcon name="chevron-right" :size="36" class="organization-back__icon" />
          <text>{{ isRoot ? '返回联系人' : '上一级' }}</text>
        </view>
        <text v-if="currentDepartment" class="organization-toolbar__count">
          {{ currentDepartment.memberCount }} 名成员
        </text>
      </view>

      <scroll-view scroll-x class="organization-breadcrumb">
        <view class="organization-breadcrumb__content">
          <text
            class="organization-breadcrumb__item"
            :class="{ 'is-active': isRoot }"
            @tap="goToRoot"
          >全部部门</text>
          <template v-for="(department, index) in breadcrumbs" :key="department.id">
            <MobileIcon name="chevron-right" :size="28" class="organization-breadcrumb__separator" />
            <text
              class="organization-breadcrumb__item"
              :class="{ 'is-active': index === breadcrumbs.length - 1 }"
              @tap="selectBreadcrumb(index)"
            >{{ department.name }}</text>
          </template>
        </view>
      </scroll-view>

      <view v-if="departmentInitialLoading" class="organization-state fa-card">
        <text class="fa-muted">正在加载组织架构...</text>
      </view>

      <view v-else-if="errorMessage" class="organization-state fa-card">
        <text class="organization-state__error">{{ errorMessage }}</text>
        <button class="organization-state__retry" @tap="loadDirectory">重新加载</button>
      </view>

      <template v-else>
        <view v-if="visibleDepartments.length" class="departments-section">
          <MobileSectionHeader :title="isRoot ? '部门' : '下级部门'" />
          <view class="department-card fa-card">
            <view
              v-for="(department, index) in visibleDepartments"
              :key="department.id"
              class="department-entry"
              @tap="openDepartment(department)"
            >
              <view
                class="department-entry__icon"
                :class="`department-entry__icon--${departmentTone(index)}`"
              >
                <MobileIcon name="organization" :size="44" />
              </view>
              <view class="department-entry__copy">
                <text class="department-entry__title">{{ department.name }}</text>
                <text class="department-entry__description">
                  {{ department.memberCount }} 名成员{{ department.hasChildren ? ' · 含下级部门' : '' }}
                </text>
              </view>
              <MobileIcon name="chevron-right" :size="36" class="department-entry__arrow" />
            </view>
          </view>
        </view>

        <MobileEmptyState
          v-if="isRoot && !visibleDepartments.length"
          icon="organization"
          title="暂无部门"
          description="当前租户暂无可用组织架构"
        />

        <view v-if="currentDepartment" class="members-section">
          <MobileSectionHeader :title="memberTitle" />

          <view v-if="memberInitialLoading" class="organization-state fa-card">
            <text class="fa-muted">正在加载成员...</text>
          </view>

          <view v-else-if="memberErrorMessage" class="organization-state fa-card">
            <text class="organization-state__error">{{ memberErrorMessage }}</text>
            <button class="organization-state__retry" @tap="loadMembers(currentDepartment.id)">重新加载</button>
          </view>

          <view v-else-if="members.length" class="member-list">
            <view
              v-for="member in members"
              :key="member.id"
              class="member-row"
              @tap="openContact(member.id)"
            >
              <view class="member-row__avatar">{{ contactMark(member) }}</view>
              <view class="member-row__copy">
                <text class="member-row__name">{{ member.name }}</text>
                <text class="member-row__description">{{ contactSubtitle(member) }}</text>
              </view>
            </view>
          </view>

          <MobileEmptyState
            v-else
            icon="contacts"
            title="暂无成员"
            description="当前部门暂无可用成员"
          />

          <text v-if="loadingMore" class="organization-loading-more fa-muted">正在加载更多成员...</text>
          <button
            v-else-if="hasNextPage"
            class="organization-load-more"
            @tap="loadMoreMembers"
          >加载更多成员</button>
        </view>
      </template>
    </view>
  </MobileShell>
</template>

<style scoped>
.organization-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 0 32rpx calc(48rpx + var(--fa-safe-area-bottom));
}

.organization-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--fa-size-touch);
}

.organization-back {
  display: flex;
  align-items: center;
  min-height: var(--fa-size-touch);
  color: var(--fa-color-primary);
  font-size: 28rpx;
}

.organization-back:active,
.department-entry:active,
.member-row:active,
.organization-breadcrumb__item:active {
  opacity: 0.78;
}

.organization-back__icon {
  margin-right: 4rpx;
  transform: rotate(180deg);
}

.organization-toolbar__count {
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.organization-breadcrumb {
  width: 100%;
  min-height: var(--fa-size-touch);
  box-sizing: border-box;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.organization-breadcrumb__content {
  display: flex;
  align-items: center;
  width: max-content;
  min-height: var(--fa-size-touch);
  padding-right: 32rpx;
}

.organization-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  min-height: var(--fa-size-touch);
  max-width: 280rpx;
  overflow: hidden;
  color: var(--fa-color-muted);
  font-size: 26rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.organization-breadcrumb__item.is-active {
  color: var(--fa-color-text);
  font-weight: 600;
}

.organization-breadcrumb__separator {
  margin: 0 8rpx;
  color: var(--fa-color-border-strong);
}

.departments-section,
.members-section {
  margin-top: 24rpx;
}

.department-card {
  padding: 0;
  overflow: hidden;
}

.department-entry {
  display: flex;
  align-items: center;
  min-height: 112rpx;
  box-sizing: border-box;
  padding: 20rpx 24rpx;
}

.department-entry + .department-entry {
  border-top: 1rpx solid var(--fa-color-border);
}

.department-entry__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 64rpx;
  margin-right: 20rpx;
  border-radius: 20rpx;
}

.department-entry__icon--primary {
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
}

.department-entry__icon--purple {
  color: var(--fa-color-purple);
  background: var(--fa-color-purple-soft);
}

.department-entry__icon--orange {
  color: var(--fa-color-orange);
  background: var(--fa-color-orange-soft);
}

.department-entry__copy,
.member-row__copy {
  min-width: 0;
  flex: 1;
}

.department-entry__title,
.department-entry__description,
.member-row__name,
.member-row__description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.department-entry__title,
.member-row__name {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}

.department-entry__description,
.member-row__description {
  margin-top: 2rpx;
  color: var(--fa-color-text-secondary);
  font-size: 26rpx;
  line-height: 38rpx;
}

.department-entry__arrow {
  flex: 0 0 auto;
  margin-left: 16rpx;
  color: var(--fa-color-border-strong);
}

.member-list {
  padding: 0 4rpx;
}

.member-row {
  display: flex;
  align-items: center;
  min-height: 104rpx;
  box-sizing: border-box;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.member-row:last-child {
  border-bottom: 0;
}

.member-row__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 64rpx;
  margin-right: 20rpx;
  border-radius: 20rpx;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 28rpx;
  font-weight: 700;
}

.organization-state {
  margin-top: 24rpx;
  padding: 40rpx 32rpx;
  text-align: center;
}

.organization-state__error {
  display: block;
  margin-bottom: 24rpx;
  color: var(--fa-color-danger);
}

.organization-state__retry {
  width: 240rpx;
  min-height: var(--fa-size-touch);
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
  line-height: var(--fa-size-touch);
}

.organization-loading-more {
  display: block;
  padding: 24rpx 0;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
}

.organization-load-more {
  display: block;
  width: 280rpx;
  min-height: var(--fa-size-touch);
  margin: 24rpx auto 0;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
  line-height: var(--fa-size-touch);
}
</style>
