<script setup lang="ts">
import MobileIcon from './MobileIcon.vue';

interface MobileInputEvent extends Event {
  detail?: {
    value?: string;
  };
}

const props = withDefaults(defineProps<{
  modelValue?: string;
  placeholder?: string;
  shortcut?: string;
  disabled?: boolean;
}>(), {
  modelValue: '',
  placeholder: '搜索',
  shortcut: '',
  disabled: false,
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'clear'): void;
  (event: 'confirm'): void;
}>();

function handleInput(event: Event): void {
  const inputEvent = event as MobileInputEvent;
  const target = event.target as { value?: string } | null;
  emit('update:modelValue', inputEvent.detail?.value ?? target?.value ?? '');
}

function clear(): void {
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<template>
  <view class="mobile-search-field" :class="{ 'is-disabled': props.disabled }">
    <MobileIcon name="search" :size="40" class="mobile-search-field__icon" />
    <input
      class="mobile-search-field__input"
      type="text"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      confirm-type="search"
      @input="handleInput"
      @confirm="emit('confirm')"
    />
    <text v-if="props.shortcut" class="mobile-search-field__shortcut">{{ props.shortcut }}</text>
    <view v-if="props.modelValue" class="mobile-search-field__clear" @tap.stop="clear">
      <MobileIcon name="close" :size="28" />
    </view>
  </view>
</template>

<style scoped>
.mobile-search-field {
  display: flex;
  align-items: center;
  min-height: var(--fa-size-touch);
  box-sizing: border-box;
  padding: 0 20rpx;
  border: 1rpx solid var(--fa-color-border);
  border-radius: var(--fa-radius-card);
  background: var(--fa-color-card);
}

.mobile-search-field:focus-within {
  border-color: var(--fa-color-primary);
}

.mobile-search-field.is-disabled {
  opacity: 0.6;
}

.mobile-search-field__icon {
  flex: 0 0 auto;
  color: var(--fa-color-muted);
}

.mobile-search-field__input {
  min-width: 0;
  flex: 1;
  height: 72rpx;
  margin-left: 12rpx;
  color: var(--fa-color-text);
  font-size: 30rpx;
}

.mobile-search-field__shortcut {
  flex: 0 0 auto;
  padding: 6rpx 12rpx;
  border-radius: var(--fa-radius-sm);
  color: var(--fa-color-muted);
  background: var(--fa-color-surface-muted);
  font-size: 20rpx;
  line-height: 28rpx;
}

.mobile-search-field__input::placeholder {
  color: var(--fa-color-placeholder);
}

.mobile-search-field__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 56rpx;
  height: 56rpx;
  color: var(--fa-color-muted);
}
</style>
