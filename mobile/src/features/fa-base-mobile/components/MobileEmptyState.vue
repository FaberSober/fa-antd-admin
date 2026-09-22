<script setup lang="ts">
import MobileIcon from './MobileIcon.vue';
import type { MobileIconName } from '../types/mobileIcon';

const props = withDefaults(defineProps<{
  icon?: MobileIconName;
  title?: string;
  description?: string;
  actionText?: string;
}>(), {
  icon: 'grid',
  title: '暂无数据',
  description: '',
  actionText: '',
});

const emit = defineEmits<{
  (event: 'action'): void;
}>();
</script>

<template>
  <view class="mobile-empty-state">
    <view class="mobile-empty-state__icon">
      <MobileIcon :name="props.icon" :size="56" />
    </view>
    <text class="mobile-empty-state__title">{{ props.title }}</text>
    <text v-if="props.description" class="mobile-empty-state__description">{{ props.description }}</text>
    <button v-if="props.actionText" class="mobile-empty-state__action" @tap="emit('action')">
      {{ props.actionText }}
    </button>
  </view>
</template>

<style scoped>
.mobile-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 280rpx;
  padding: 48rpx 32rpx;
  flex-direction: column;
  text-align: center;
}

.mobile-empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  margin-bottom: 24rpx;
  border-radius: 32rpx;
  color: var(--fa-color-muted);
  background: var(--fa-color-surface-muted);
}

.mobile-empty-state__title {
  color: var(--fa-color-text);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 42rpx;
}

.mobile-empty-state__description {
  margin-top: 8rpx;
  color: var(--fa-color-muted);
  font-size: 26rpx;
  line-height: 38rpx;
}

.mobile-empty-state__action {
  min-width: 176rpx;
  min-height: var(--fa-size-touch);
  margin: 24rpx 0 0;
  border-radius: var(--fa-radius-pill);
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
  line-height: var(--fa-size-touch);
}
</style>
