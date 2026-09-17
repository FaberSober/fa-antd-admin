<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  actionText?: string;
}>(), {
  actionText: '',
});

const emit = defineEmits<{
  (event: 'action'): void;
}>();
</script>

<template>
  <view class="mobile-section-header">
    <text class="mobile-section-header__title">{{ props.title }}</text>
    <text v-if="props.actionText" class="mobile-section-header__action" @click="emit('action')">
      {{ props.actionText }}
    </text>
  </view>
</template>

<style scoped>
.mobile-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--fa-size-touch);
}

.mobile-section-header__title {
  color: var(--fa-color-text);
  font-size: 34rpx;
  font-weight: 600;
  line-height: 44rpx;
}

.mobile-section-header__action {
  display: flex;
  align-items: center;
  min-height: var(--fa-size-touch);
  padding-left: 24rpx;
  color: var(--fa-color-primary);
  font-size: 26rpx;
  line-height: 44rpx;
}
</style>
