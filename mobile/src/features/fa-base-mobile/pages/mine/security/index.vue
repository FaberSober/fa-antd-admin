<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { updateMyPassword } from '../../../api/account';
import { ApiError } from '../../../common/request';
import { MOBILE_PAGE_ROUTES } from '../../../feature';
import { useAuthStore } from '../../../stores/auth';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';

interface PasswordForm {
  oldPwd: string;
  newPwd: string;
  confirmPwd: string;
}

const authStore = useAuthStore();
const submitting = ref(false);
const errorMessage = ref('');
const form = reactive<PasswordForm>({ oldPwd: '', newPwd: '', confirmPwd: '' });

function validateForm(): boolean {
  if (!form.oldPwd) {
    errorMessage.value = '请输入原密码';
    return false;
  }
  if (!form.newPwd) {
    errorMessage.value = '请输入新密码';
    return false;
  }
  if (form.oldPwd === form.newPwd) {
    errorMessage.value = '新旧密码不能一样';
    return false;
  }
  if (form.newPwd !== form.confirmPwd) {
    errorMessage.value = '两次输入的新密码不一致';
    return false;
  }
  return true;
}

async function submitPassword(): Promise<void> {
  if (submitting.value || !validateForm()) return;

  submitting.value = true;
  errorMessage.value = '';
  try {
    await updateMyPassword({ oldPwd: form.oldPwd, newPwd: form.newPwd });
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '密码修改失败，请稍后重试';
    submitting.value = false;
    return;
  }

  try {
    await authStore.signOut();
  } catch {
    // signOut always clears the local session in its finally block.
  }
  submitting.value = false;
  uni.showToast({ title: '密码已修改，请重新登录', icon: 'none', duration: 1200 });
  setTimeout(() => {
    uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
  }, 300);
}

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.mineSecurity);
  if (!authStore.isAuthenticated) uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
});
</script>

<template>
  <MobileThemeRoot>
    <view class="security-page fa-page">
      <view class="security-card fa-card">
        <view class="security-heading">
          <text class="security-title">修改密码</text>
          <text class="security-description">修改成功后需要重新登录</text>
        </view>

        <view class="security-form">
          <view class="security-field">
            <text class="security-field__label">原密码</text>
            <input
              v-model="form.oldPwd"
              class="security-field__input"
              type="password"
              placeholder="请输入原密码"
              confirm-type="next"
            />
          </view>
          <view class="security-field">
            <text class="security-field__label">新密码</text>
            <input
              v-model="form.newPwd"
              class="security-field__input"
              type="password"
              placeholder="请输入新密码"
              confirm-type="next"
            />
          </view>
          <view class="security-field">
            <text class="security-field__label">确认密码</text>
            <input
              v-model="form.confirmPwd"
              class="security-field__input"
              type="password"
              placeholder="请再次输入新密码"
              confirm-type="done"
              @confirm="submitPassword"
            />
          </view>
        </view>

        <text v-if="errorMessage" class="security-error">{{ errorMessage }}</text>
        <button
          class="security-submit"
          :disabled="submitting"
          :loading="submitting"
          @click="submitPassword"
        >确认修改</button>
      </view>
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.security-page {
  min-height: 100vh;
}

.security-card {
  padding: 40rpx 32rpx;
}

.security-heading {
  margin-bottom: 36rpx;
}

.security-title,
.security-description {
  display: block;
}

.security-title {
  color: var(--fa-color-text);
  font-size: 40rpx;
  font-weight: 700;
  line-height: 52rpx;
}

.security-description {
  margin-top: 10rpx;
  color: var(--fa-color-muted);
  font-size: 25rpx;
  line-height: 36rpx;
}

.security-field {
  display: flex;
  align-items: center;
  min-height: 96rpx;
  gap: 24rpx;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.security-field__label {
  flex: 0 0 128rpx;
  color: var(--fa-color-muted);
}

.security-field__input {
  min-width: 0;
  flex: 1;
  color: var(--fa-color-text);
  font-size: 28rpx;
  text-align: right;
}

.security-error {
  display: block;
  margin-top: 24rpx;
  color: var(--fa-color-danger);
  font-size: 24rpx;
  line-height: 34rpx;
}

.security-submit {
  width: 100%;
  margin: 36rpx 0 0;
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-primary);
  font-size: 28rpx;
  line-height: 80rpx;
}
</style>
