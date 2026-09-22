<script setup lang="ts">
import { computed, inject } from 'vue';
import { MOBILE_TAB_NAVIGATION_KEY, MOBILE_TAB_ROUTES } from '../feature';
import { useAuthStore } from '../stores/auth';
import { useMessageStore } from '../stores/message';
import { useTenantStore } from '../stores/tenant';
import type { MobileTabKey } from '../feature';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';
import MobileHeader from './MobileHeader.vue';
import MobileTabBar from './MobileTabBar.vue';

const props = withDefaults(defineProps<{
  activeTab?: MobileTabKey;
  title?: string;
  tenantName?: string | null;
  tenantMark?: string | null;
  tenantRole?: string | null;
  notificationCount?: number;
  unreadCount?: number;
  showHeader?: boolean;
  showTabBar?: boolean;
}>(), {
  activeTab: 'workbench',
  title: '',
  tenantName: '',
  tenantMark: '',
  tenantRole: '',
  notificationCount: 0,
  unreadCount: 0,
  showHeader: true,
  showTabBar: true,
});

const messageStore = useMessageStore();
const authStore = useAuthStore();
const tenantStore = useTenantStore();
const navigateToTab = inject(MOBILE_TAB_NAVIGATION_KEY);
const cachedUnreadCount = computed(() => messageStore.getUnreadCount(
  authStore.user?.id,
  tenantStore.currentTenantId,
));
const effectiveNotificationCount = computed(() => Math.max(
  props.notificationCount,
  cachedUnreadCount.value,
));
const effectiveUnreadCount = computed(() => Math.max(
  props.unreadCount,
  cachedUnreadCount.value,
));

const emit = defineEmits<{
  (event: 'notification-click'): void;
  (event: 'tab-change', tab: MobileTabKey): void;
}>();

function handleTabChange(tab: MobileTabKey): void {
  emit('tab-change', tab);
  if (tab === props.activeTab) return;
  if (navigateToTab) {
    navigateToTab(tab);
    return;
  }
  uni.reLaunch({ url: MOBILE_TAB_ROUTES[tab] });
}
</script>

<template>
  <MobileThemeRoot>
    <view class="mobile-shell" :class="{ 'mobile-shell--no-header': !props.showHeader }">
      <MobileHeader
        v-if="props.showHeader"
        :title="props.title"
        :tenant-name="props.tenantName"
        :tenant-mark="props.tenantMark"
        :role="props.tenantRole"
        :notification-count="effectiveNotificationCount"
        @notification-click="emit('notification-click')"
      />

      <scroll-view scroll-y class="mobile-shell__content">
        <slot />
      </scroll-view>

      <MobileTabBar
        v-if="props.showTabBar"
        :active-tab="props.activeTab"
        :unread-count="effectiveUnreadCount"
        @change="handleTabChange"
      />
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.mobile-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  background: var(--fa-color-page);
}

.mobile-shell--no-header {
  padding-top: var(--fa-safe-area-top);
}

.mobile-shell__content {
  width: 100%;
  height: 0;
  min-height: 0;
  flex: 1;
  box-sizing: border-box;
}
</style>
