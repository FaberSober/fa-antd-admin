<script setup lang="ts">
import { computed, ref } from 'vue';
import { MOBILE_PAGE_ROUTES } from '../feature';
import { useAuthStore } from '../stores/auth';
import { useTenantStore } from '../stores/tenant';
import MobileIcon from './MobileIcon.vue';
import TenantWorkspaceSwitcher from './TenantWorkspaceSwitcher.vue';

const props = withDefaults(defineProps<{
  title?: string;
  tenantName?: string | null;
  tenantMark?: string | null;
  role?: string | null;
  notificationCount?: number;
  showNotification?: boolean;
}>(), {
  title: '',
  tenantName: '',
  tenantMark: '',
  role: '',
  notificationCount: 0,
  showNotification: true,
});

const emit = defineEmits<{
  (event: 'notification-click'): void;
}>();

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const tenantSwitcherRef = ref<{ open: () => void } | null>(null);
const switchingTenantId = ref<string | null>(null);
const displayTenantName = computed(() => props.tenantName?.trim() || '当前工作空间');
const displayRole = computed(() => props.role?.trim() || '当前用户');
const displayTenantMark = computed(() => (
  props.tenantMark?.trim() || displayTenantName.value.slice(0, 2)
));
const displayTitle = computed(() => props.title?.trim());
const notificationBadge = computed(() => {
  const count = Math.max(0, props.notificationCount || 0);
  return count > 99 ? '99+' : String(count);
});
const hasNotificationBadge = computed(() => (props.notificationCount || 0) > 0);

function openTenantSwitcher(): void {
  tenantSwitcherRef.value?.open();
}

function reloadTenants(): void {
  if (authStore.user) void tenantStore.loadForUser(authStore.user.id);
}

function switchTenant(tenantId: string): void {
  const userId = authStore.user?.id;
  if (!userId) return;

  switchingTenantId.value = tenantId;
  if (!tenantStore.switchTenant(userId, tenantId)) {
    switchingTenantId.value = null;
    return;
  }
  uni.reLaunch({ url: MOBILE_PAGE_ROUTES.main });
}
</script>

<template>
  <view class="mobile-header-container">
    <view class="mobile-header">
      <view class="mobile-header__tenant" @click="openTenantSwitcher">
        <view class="mobile-header__mark">
          <text>{{ displayTenantMark }}</text>
        </view>
        <view class="mobile-header__tenant-copy">
          <text class="mobile-header__tenant-name">{{ displayTenantName }}</text>
          <text class="mobile-header__role">{{ displayRole }}</text>
        </view>
        <MobileIcon name="chevron-right" :size="32" class="mobile-header__chevron" />
      </view>

      <view class="mobile-header__actions">
        <text v-if="displayTitle" class="mobile-header__title">{{ displayTitle }}</text>
        <view
          v-if="props.showNotification"
          class="mobile-header__notification"
          @click="emit('notification-click')"
        >
          <MobileIcon name="bell" :size="48" />
          <text v-if="hasNotificationBadge" class="mobile-header__badge">{{ notificationBadge }}</text>
        </view>
      </view>
    </view>

    <TenantWorkspaceSwitcher
      v-if="authStore.user"
      ref="tenantSwitcherRef"
      :workspaces="tenantStore.workspaces"
      :current-workspace="tenantStore.currentWorkspace"
      :loading="tenantStore.loading"
      :error-message="tenantStore.errorMessage"
      :switching-tenant-id="switchingTenantId"
      @select="switchTenant"
      @refresh="reloadTenants"
    />
  </view>
</template>

<style scoped>
.mobile-header-container {
  display: block;
  flex: 0 0 auto;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: calc(24rpx + var(--fa-safe-area-top)) 32rpx 16rpx;
  background: var(--fa-color-page);
}

.mobile-header__tenant,
.mobile-header__notification {
  min-height: var(--fa-size-touch);
}

.mobile-header__tenant {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 14rpx;
  margin-right: 16rpx;
}

.mobile-header__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 24rpx;
  font-weight: 700;
}

.mobile-header__tenant-copy {
  min-width: 0;
  flex: 1;
}

.mobile-header__tenant-name,
.mobile-header__role {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-header__tenant-name {
  color: var(--fa-color-text);
  font-size: 32rpx;
  font-weight: 700;
  line-height: 40rpx;
}

.mobile-header__role {
  color: var(--fa-color-text-secondary);
  font-size: 24rpx;
  line-height: 34rpx;
}

.mobile-header__chevron {
  color: var(--fa-color-muted);
}

.mobile-header__actions {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.mobile-header__title {
  max-width: 220rpx;
  overflow: hidden;
  margin-right: 12rpx;
  color: var(--fa-color-text);
  font-size: 40rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-header__notification {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--fa-size-touch);
  color: var(--fa-color-text);
}

.mobile-header__badge {
  position: absolute;
  top: 11rpx;
  right: 5rpx;
  min-width: 24rpx;
  height: 24rpx;
  box-sizing: border-box;
  padding: 0 5rpx;
  border: 2rpx solid var(--fa-color-page);
  border-radius: var(--fa-radius-pill);
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-danger);
  font-size: 16rpx;
  line-height: 20rpx;
  text-align: center;
}
</style>
