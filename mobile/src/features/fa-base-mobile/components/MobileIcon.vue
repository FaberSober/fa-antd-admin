<script setup lang="ts">
import { computed } from 'vue';
import type { MobileIconName } from '../types/mobileIcon';

const props = withDefaults(defineProps<{
  name: MobileIconName;
  size?: number;
}>(), {
  size: 48,
});

const glyphs: Record<MobileIconName, string> = {
  search: '',
  bell: '',
  'chevron-right': '',
  'arrow-right': '',
  close: '',
  messages: '',
  home: '',
  contacts: '',
  mine: '',
  grid: '',
  lightning: 'ϟ',
  clock: '',
  file: '▤',
  organization: '⌘',
  question: '?',
};

const glyph = computed(() => glyphs[props.name]);
const iconStyle = computed(() => ({
  width: `${props.size}rpx`,
  height: `${props.size}rpx`,
  fontSize: `${props.size * 0.72}rpx`,
}));
</script>

<template>
  <view class="mobile-icon" :class="`mobile-icon--${props.name}`" :style="iconStyle" aria-hidden="true">
    <view v-if="props.name === 'search'" class="mobile-icon__shape mobile-icon__shape--search" />
    <view v-else-if="props.name === 'bell'" class="mobile-icon__shape mobile-icon__shape--bell" />
    <view v-else-if="props.name === 'chevron-right' || props.name === 'arrow-right'" class="mobile-icon__shape mobile-icon__shape--chevron" />
    <view v-else-if="props.name === 'close'" class="mobile-icon__shape mobile-icon__shape--close" />
    <view v-else-if="props.name === 'messages'" class="mobile-icon__shape mobile-icon__shape--messages" />
    <view v-else-if="props.name === 'home'" class="mobile-icon__shape mobile-icon__shape--home" />
    <view v-else-if="props.name === 'contacts'" class="mobile-icon__shape mobile-icon__shape--contacts" />
    <view v-else-if="props.name === 'mine'" class="mobile-icon__shape mobile-icon__shape--mine" />
    <view v-else-if="props.name === 'grid'" class="mobile-icon__shape mobile-icon__shape--grid" />
    <view v-else-if="props.name === 'clock'" class="mobile-icon__shape mobile-icon__shape--clock" />
    <view v-else-if="props.name === 'question'" class="mobile-icon__shape mobile-icon__shape--question">?</view>
    <text v-else class="mobile-icon__glyph">{{ glyph }}</text>
  </view>
</template>

<style scoped>
.mobile-icon {
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  box-sizing: border-box;
  color: inherit;
  line-height: 1;
}

.mobile-icon__shape,
.mobile-icon__glyph {
  position: absolute;
  display: block;
}

.mobile-icon__glyph {
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  line-height: 1;
  text-align: center;
}

.mobile-icon__shape--search {
  top: 17%;
  left: 15%;
  width: 53%;
  height: 53%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-radius: 50%;
}

.mobile-icon__shape--search::after {
  position: absolute;
  right: -30%;
  bottom: -24%;
  width: 42%;
  height: 3rpx;
  border-radius: 3rpx;
  background: currentColor;
  content: '';
  transform: rotate(45deg);
  transform-origin: left center;
}

.mobile-icon__shape--bell {
  top: 15%;
  left: 21%;
  width: 58%;
  height: 57%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-bottom: 0;
  border-radius: 50% 50% 12% 12%;
}

.mobile-icon__shape--bell::before {
  position: absolute;
  right: -15%;
  bottom: -12%;
  left: -15%;
  height: 3rpx;
  border-radius: 3rpx;
  background: currentColor;
  content: '';
}

.mobile-icon__shape--bell::after {
  position: absolute;
  bottom: -25%;
  left: 43%;
  width: 14%;
  height: 14%;
  border-radius: 50%;
  background: currentColor;
  content: '';
}

.mobile-icon__shape--chevron {
  top: 32%;
  left: 26%;
  width: 31%;
  height: 31%;
  box-sizing: border-box;
  border-top: 3rpx solid currentColor;
  border-right: 3rpx solid currentColor;
  transform: rotate(45deg);
}

.mobile-icon--arrow-right .mobile-icon__shape--chevron {
  left: 17%;
  width: 45%;
  border-top-width: 2rpx;
  border-right-width: 2rpx;
}

.mobile-icon--arrow-right .mobile-icon__shape--chevron::before {
  position: absolute;
  top: 50%;
  right: -20%;
  width: 130%;
  height: 2rpx;
  background: currentColor;
  content: '';
  transform: translateY(-50%) rotate(-45deg);
  transform-origin: right center;
}

.mobile-icon__shape--close::before,
.mobile-icon__shape--close::after {
  position: absolute;
  top: 50%;
  left: 15%;
  width: 70%;
  height: 3rpx;
  border-radius: 3rpx;
  background: currentColor;
  content: '';
}

.mobile-icon__shape--close::before {
  transform: rotate(45deg);
}

.mobile-icon__shape--close::after {
  transform: rotate(-45deg);
}

.mobile-icon__shape--messages {
  top: 17%;
  left: 12%;
  width: 70%;
  height: 58%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-radius: 30% 30% 30% 18%;
}

.mobile-icon__shape--messages::after {
  position: absolute;
  bottom: -17%;
  left: 14%;
  width: 24%;
  height: 24%;
  box-sizing: border-box;
  border-bottom: 3rpx solid currentColor;
  border-left: 3rpx solid currentColor;
  background: var(--fa-color-card);
  content: '';
  transform: skewY(-35deg);
}

.mobile-icon__shape--home::before {
  position: absolute;
  top: 35%;
  left: 22%;
  width: 56%;
  height: 43%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-radius: 8rpx;
  content: '';
}

.mobile-icon__shape--home::after {
  position: absolute;
  top: 15%;
  left: 26%;
  width: 48%;
  height: 48%;
  box-sizing: border-box;
  border-top: 3rpx solid currentColor;
  border-left: 3rpx solid currentColor;
  content: '';
  transform: rotate(45deg);
}

.mobile-icon__shape--home,
.mobile-icon__shape--contacts,
.mobile-icon__shape--mine {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mobile-icon__shape--contacts::before {
  position: absolute;
  top: 17%;
  left: 18%;
  width: 27%;
  height: 27%;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  box-shadow: 25rpx 5rpx 0 -1rpx var(--fa-color-page), 25rpx 5rpx 0 2rpx currentColor;
  content: '';
}

.mobile-icon__shape--contacts::after {
  position: absolute;
  bottom: 14%;
  left: 7%;
  width: 58%;
  height: 32%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-bottom: 0;
  border-radius: 50% 50% 0 0;
  content: '';
}

.mobile-icon__shape--mine::before {
  position: absolute;
  top: 13%;
  left: 35%;
  width: 30%;
  height: 30%;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  content: '';
}

.mobile-icon__shape--mine::after {
  position: absolute;
  bottom: 12%;
  left: 17%;
  width: 66%;
  height: 37%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-bottom: 0;
  border-radius: 50% 50% 0 0;
  content: '';
}

.mobile-icon__shape--grid {
  top: 17%;
  left: 17%;
  width: 66%;
  height: 66%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-radius: 10rpx;
  background: linear-gradient(90deg, transparent 46%, currentColor 46%, currentColor 54%, transparent 54%),
    linear-gradient(0deg, transparent 46%, currentColor 46%, currentColor 54%, transparent 54%);
}

.mobile-icon__shape--clock {
  top: 14%;
  left: 14%;
  width: 72%;
  height: 72%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-radius: 50%;
}

.mobile-icon__shape--clock::before,
.mobile-icon__shape--clock::after {
  position: absolute;
  top: 20%;
  left: 50%;
  width: 3rpx;
  height: 32%;
  border-radius: 3rpx;
  background: currentColor;
  content: '';
  transform-origin: bottom center;
}

.mobile-icon__shape--clock::before {
  transform: translateX(-50%);
}

.mobile-icon__shape--clock::after {
  top: 50%;
  width: 29%;
  height: 3rpx;
  transform: translateY(-50%) rotate(35deg);
  transform-origin: left center;
}

.mobile-icon__shape--question {
  top: 12%;
  left: 12%;
  width: 76%;
  height: 76%;
  box-sizing: border-box;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  font-size: 60%;
  font-weight: 600;
  line-height: 70%;
  text-align: center;
}
</style>
