<script setup lang="ts">
import MobileIcon from './MobileIcon.vue';
import type { MobileIconName } from '../types/mobileIcon';
import type { MobileTabKey } from '../feature';

export type { MobileTabKey } from '../feature';

interface MobileTabDefinition {
  key: MobileTabKey;
  label: string;
  icon: MobileIconName;
}

const tabs: readonly MobileTabDefinition[] = [
  { key: 'messages', label: '消息', icon: 'messages' },
  { key: 'workbench', label: '工作台', icon: 'home' },
  { key: 'contacts', label: '联系人', icon: 'contacts' },
  { key: 'mine', label: '我的', icon: 'mine' },
];

const props = withDefaults(defineProps<{
  activeTab?: MobileTabKey;
  unreadCount?: number;
}>(), {
  activeTab: 'workbench',
  unreadCount: 0,
});

const emit = defineEmits<{
  (event: 'change', tab: MobileTabKey): void;
}>();

function unreadBadge(count: number): string {
  return count > 99 ? '99+' : String(count);
}
</script>

<template>
  <view class="mobile-tab-bar">
    <view class="mobile-tab-bar__items">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="mobile-tab-bar__item"
        :class="{ 'is-active': tab.key === props.activeTab }"
        @click="emit('change', tab.key)"
      >
        <view class="mobile-tab-bar__icon-wrap">
          <MobileIcon :name="tab.icon" :size="48" />
          <text v-if="tab.key === 'messages' && props.unreadCount > 0" class="mobile-tab-bar__badge">
            {{ unreadBadge(props.unreadCount) }}
          </text>
        </view>
        <text class="mobile-tab-bar__label">{{ tab.label }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.mobile-tab-bar {
  flex: 0 0 auto;
  box-sizing: border-box;
  padding: 8rpx 16rpx calc(12rpx + var(--fa-safe-area-bottom));
  border-top: 1rpx solid var(--fa-color-border);
  background: var(--fa-color-card);
}

.mobile-tab-bar__items {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
}

.mobile-tab-bar__item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: var(--fa-size-touch);
  color: var(--fa-color-muted);
}

.mobile-tab-bar__item.is-active {
  color: var(--fa-color-primary);
}

.mobile-tab-bar__icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48rpx;
}

.mobile-tab-bar__label {
  margin-top: 4rpx;
  font-size: 22rpx;
  line-height: 32rpx;
}

.mobile-tab-bar__badge {
  position: absolute;
  top: -12rpx;
  right: -18rpx;
  min-width: 30rpx;
  height: 30rpx;
  box-sizing: border-box;
  padding: 0 6rpx;
  border: 2rpx solid var(--fa-color-card);
  border-radius: var(--fa-radius-pill);
  color: #fff;
  background: var(--fa-color-danger);
  font-size: 18rpx;
  line-height: 26rpx;
  text-align: center;
}
</style>
