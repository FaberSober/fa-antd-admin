<script setup lang="ts">
import { MOBILE_TAB_ROUTES } from '../feature';
import type { MobileTabKey } from '../feature';
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

const emit = defineEmits<{
  (event: 'tenant-click'): void;
  (event: 'notification-click'): void;
  (event: 'tab-change', tab: MobileTabKey): void;
}>();

function handleTabChange(tab: MobileTabKey): void {
  emit('tab-change', tab);
  if (tab !== props.activeTab) uni.reLaunch({ url: MOBILE_TAB_ROUTES[tab] });
}
</script>

<template>
  <view class="mobile-shell" :class="{ 'mobile-shell--no-header': !props.showHeader }">
    <MobileHeader
      v-if="props.showHeader"
      :title="props.title"
      :tenant-name="props.tenantName"
      :tenant-mark="props.tenantMark"
      :role="props.tenantRole"
      :notification-count="props.notificationCount"
      @tenant-click="emit('tenant-click')"
      @notification-click="emit('notification-click')"
    />

    <scroll-view scroll-y class="mobile-shell__content">
      <slot />
    </scroll-view>

    <MobileTabBar
      v-if="props.showTabBar"
      :active-tab="props.activeTab"
      :unread-count="props.unreadCount"
      @change="handleTabChange"
    />
  </view>
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
