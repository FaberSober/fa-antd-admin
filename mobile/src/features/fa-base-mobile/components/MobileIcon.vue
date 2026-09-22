<script setup lang="ts">
import { computed } from 'vue';
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import type { MobileIconName } from '../types/mobileIcon';

const props = withDefaults(defineProps<{
  name: MobileIconName;
  size?: number;
}>(), {
  size: 48,
});

const iconTypes: Record<MobileIconName, string> = {
  search: 'search',
  bell: 'notification',
  'chevron-right': 'right',
  'arrow-right': 'arrow-right',
  close: 'close',
  messages: 'chat',
  home: 'home',
  contacts: 'staff',
  mine: 'person',
  grid: 'bars',
  lightning: 'fire',
  clock: 'checkbox',
  file: 'list',
  organization: 'staff',
  question: 'help',
};

const iconType = computed(() => iconTypes[props.name]);
const iconSize = computed(() => Math.max(12, Math.round(props.size * 0.5)));
const iconStyle = computed(() => ({
  width: `${props.size}rpx`,
  height: `${props.size}rpx`,
}));
</script>

<template>
  <view class="mobile-icon" :class="`mobile-icon--${props.name}`" :style="iconStyle" aria-hidden="true">
    <UniIcons :type="iconType" :size="iconSize" color="currentColor" />
  </view>
</template>

<style scoped>
.mobile-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: inherit;
  line-height: 1;
}
</style>
