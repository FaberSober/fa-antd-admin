<script setup lang="ts">
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import MobileEmptyState from '../../components/MobileEmptyState.vue';
import MobileShell from '../../components/MobileShell.vue';
import { MOBILE_PAGE_ROUTES } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import { useTenantStore } from '../../stores/tenant';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});
const unreadCount = computed(() => Math.max(0, tenantStore.currentWorkspace?.unreadCount || 0));

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.messages);
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
    <view class="mobile-page">
      <MobileEmptyState
        icon="messages"
        title="暂无消息"
        description="消息内容将在这里展示"
      />
    </view>
  </MobileShell>
</template>

<style scoped>
.mobile-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 16rpx 32rpx 48rpx;
}
</style>
