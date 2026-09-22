<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { ApiError } from '../../../common/request';
import { createPageRefresh } from '../../../common/page-refresh';
import { updateMyProfile } from '../../../api/account';
import { buildFilePreviewUrl, uploadBaseFile } from '../../../api/file';
import { MOBILE_PAGE_ROUTES } from '../../../feature';
import { useAuthStore } from '../../../stores/auth';
import { useTenantStore } from '../../../stores/tenant';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import MobileThemeRoot from '@features/fa-core-mobile/theme/MobileThemeRoot.vue';

interface ProfileForm {
  name: string;
  tel: string;
  email: string;
  img: string;
}

const authStore = useAuthStore();
const tenantStore = useTenantStore();
const pageRefresh = createPageRefresh();
const {
  errorMessage,
  initialLoading,
  run: runRefresh,
  invalidate,
} = pageRefresh;
const editing = ref(false);
const saving = ref(false);
const avatarUploading = ref(false);
const editError = ref('');
const avatarPreview = ref('');
const avatarLoadError = ref(false);
const form = reactive<ProfileForm>({ name: '', tel: '', email: '', img: '' });

const userName = computed(() => authStore.user?.name?.trim() || authStore.user?.username?.trim() || '当前用户');
const profileAvatarUrl = computed(() => {
  if (avatarPreview.value) return avatarPreview.value;
  const avatar = authStore.user?.avatar?.trim();
  if (!avatar) return '';
  if (/^(?:https?:)?\/\//.test(avatar) || avatar.startsWith('/') || avatar.startsWith('data:')) return avatar;
  return buildFilePreviewUrl(avatar);
});
const profileMark = computed(() => (editing.value ? form.name.trim() : userName.value).slice(0, 1) || '?');
const accountStatus = computed(() => (authStore.user?.status === false ? '已停用' : '正常使用'));
const tenantName = computed(() => tenantStore.currentWorkspace?.tenantName?.trim() || '暂无工作空间');
const tenantRole = computed(() => {
  const workspace = tenantStore.currentWorkspace;
  if (!workspace) return '未选择角色';
  return workspace.isAdmin || authStore.user?.adminEnabled ? '管理员' : '成员';
});

function startEditing(): void {
  const user = authStore.user;
  if (!user) return;

  form.name = user.name?.trim() || user.username?.trim() || '';
  form.tel = user.tel?.trim() || '';
  form.email = user.email?.trim() || '';
  form.img = user.avatar?.trim() || '';
  editError.value = '';
  avatarPreview.value = '';
  avatarLoadError.value = false;
  editing.value = true;
}

function cancelEditing(): void {
  if (saving.value || avatarUploading.value) return;
  editing.value = false;
  editError.value = '';
  avatarPreview.value = '';
  avatarLoadError.value = false;
}

async function uploadAvatar(filePath: string): Promise<void> {
  avatarUploading.value = true;
  editError.value = '';
  try {
    const file = await uploadBaseFile(filePath);
    if (!file.id) throw new Error('头像上传失败');
    form.img = file.id;
  } catch (error) {
    avatarPreview.value = '';
    editError.value = error instanceof ApiError ? error.message : '头像上传失败，请稍后重试';
  } finally {
    avatarUploading.value = false;
  }
}

function chooseAvatar(): void {
  if (saving.value || avatarUploading.value) return;

  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (result) => {
      const path = result.tempFilePaths[0];
      if (!path) {
        editError.value = '未选择头像';
        return;
      }
      avatarPreview.value = path;
      avatarLoadError.value = false;
      void uploadAvatar(path);
    },
    fail: (error) => {
      if (!error.errMsg?.includes('cancel')) editError.value = error.errMsg || '选择头像失败';
    },
  });
}

function validateProfile(): boolean {
  if (!form.name.trim()) {
    editError.value = '姓名不能为空';
    return false;
  }
  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    editError.value = '邮箱格式不正确';
    return false;
  }
  return true;
}

async function saveProfile(): Promise<void> {
  const user = authStore.user;
  if (!user || saving.value || avatarUploading.value || !validateProfile()) return;

  saving.value = true;
  editError.value = '';
  try {
    await updateMyProfile({
      username: user.username,
      name: form.name.trim(),
      tel: form.tel.trim(),
      email: form.email.trim(),
      img: form.img,
    });
    const updatedUser = await authStore.loadCurrentUser();
    if (!updatedUser) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    editing.value = false;
    avatarPreview.value = '';
    avatarLoadError.value = false;
    uni.showToast({ title: '资料已保存', icon: 'success' });
  } catch (error) {
    editError.value = error instanceof ApiError ? error.message : '资料保存失败，请稍后重试';
  } finally {
    saving.value = false;
  }
}

function loadProfile(): Promise<void> {
  return runRefresh(async (isCurrent) => {
    const user = await authStore.loadCurrentUser();
    if (!isCurrent()) return;
    if (!user) {
      uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
      return;
    }
    await tenantStore.loadForUser(user.id);
    if (!isCurrent()) return;
  }, () => Boolean(authStore.user), (error) => (
    error instanceof ApiError ? error.message : '个人资料加载失败'
  ));
}

onBeforeUnmount(() => {
  invalidate();
});

onShow(() => {
  telemetry.page(MOBILE_PAGE_ROUTES.mineAccount);
  void loadProfile();
});
</script>

<template>
  <MobileThemeRoot>
    <view class="account-page fa-page">
      <view v-if="initialLoading" class="account-state fa-card">
        <text class="fa-muted">正在加载个人资料...</text>
      </view>

      <view v-else-if="errorMessage" class="account-state fa-card">
        <text class="account-state__error">{{ errorMessage }}</text>
        <button class="account-state__retry" @tap="loadProfile">重新加载</button>
      </view>

      <template v-else-if="authStore.user">
        <view class="account-profile fa-card">
        <image
          v-if="profileAvatarUrl && !avatarLoadError"
          class="account-profile__avatar account-profile__avatar--image"
          :src="profileAvatarUrl"
          mode="aspectFill"
          @error="avatarLoadError = true"
        />
        <view v-else class="account-profile__avatar">{{ profileMark }}</view>
        <view class="account-profile__main">
          <text class="account-profile__name">{{ editing ? (form.name || '编辑个人资料') : userName }}</text>
          <text
            class="account-profile__status"
            :class="{ 'account-profile__status--disabled': authStore.user.status === false }"
          >{{ accountStatus }}</text>
        </view>
        <button v-if="!editing" class="account-profile__edit" @tap="startEditing">编辑</button>
        </view>

        <view v-if="editing" class="account-edit fa-card">
        <button
          class="account-edit__avatar"
          :disabled="saving || avatarUploading"
          @tap="chooseAvatar"
        >
          <text>{{ avatarUploading ? '头像上传中...' : '更换头像' }}</text>
        </button>
        <view class="account-edit__row">
          <text class="account-edit__label">姓名</text>
          <input v-model="form.name" class="account-edit__input" maxlength="50" placeholder="请输入姓名" />
        </view>
        <view class="account-edit__row">
          <text class="account-edit__label">手机号</text>
          <input v-model="form.tel" class="account-edit__input" type="text" maxlength="30" placeholder="请输入手机号" />
        </view>
        <view class="account-edit__row">
          <text class="account-edit__label">邮箱</text>
          <input v-model="form.email" class="account-edit__input" type="text" maxlength="100" placeholder="请输入邮箱" />
        </view>
        <text v-if="editError" class="account-edit__error">{{ editError }}</text>
        <view class="account-edit__actions">
          <button class="account-edit__cancel" :disabled="saving || avatarUploading" @tap="cancelEditing">取消</button>
          <button
            class="account-edit__save"
            :disabled="saving || avatarUploading"
            :loading="saving"
            @tap="saveProfile"
          >保存</button>
        </view>
        </view>

        <view v-else class="account-info fa-card">
        <view class="account-info__row">
          <text class="account-info__label">账号</text>
          <text class="account-info__value">{{ authStore.user.username || '-' }}</text>
        </view>
        <view class="account-info__row">
          <text class="account-info__label">手机号</text>
          <text class="account-info__value">{{ authStore.user.tel || '-' }}</text>
        </view>
        <view class="account-info__row">
          <text class="account-info__label">邮箱</text>
          <text class="account-info__value">{{ authStore.user.email || '-' }}</text>
        </view>
        </view>

        <view class="account-workspace fa-card">
          <text class="account-workspace__title">当前工作空间</text>
          <text class="account-workspace__name">{{ tenantName }}</text>
          <text class="account-workspace__role">{{ tenantRole }}</text>
          <text v-if="tenantStore.errorMessage" class="account-workspace__error">
            {{ tenantStore.errorMessage }}
          </text>
        </view>
      </template>
    </view>
  </MobileThemeRoot>
</template>

<style scoped>
.account-page {
  min-height: 100vh;
  padding-top: 24rpx;
  padding-bottom: 48rpx;
}

.account-state {
  text-align: center;
}

.account-state__error,
.account-workspace__error {
  color: var(--fa-color-danger);
}

.account-state__error {
  display: block;
  margin-bottom: 24rpx;
}

.account-state__retry {
  width: 240rpx;
  margin: 0 auto;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
}

.account-profile {
  display: flex;
  align-items: center;
}

.account-profile__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 112rpx;
  height: 112rpx;
  margin-right: 24rpx;
  border-radius: 50%;
  color: var(--fa-color-text-inverse);
  background: linear-gradient(135deg, var(--fa-color-primary), var(--fa-color-primary-gradient-end));
  font-size: 52rpx;
  font-weight: 700;
}

.account-profile__avatar--image {
  object-fit: cover;
}

.account-profile__main {
  min-width: 0;
  flex: 1;
}

.account-profile__edit {
  flex: 0 0 auto;
  width: 96rpx;
  margin: 0;
  padding: 0;
  border: 1rpx solid var(--fa-color-primary);
  border-radius: var(--fa-radius-pill);
  color: var(--fa-color-primary);
  background: transparent;
  font-size: 24rpx;
  line-height: 56rpx;
}

.account-profile__name,
.account-profile__status,
.account-workspace__title,
.account-workspace__name,
.account-workspace__role,
.account-workspace__error {
  display: block;
}

.account-profile__name {
  color: var(--fa-color-text);
  font-size: 40rpx;
  font-weight: 700;
  line-height: 52rpx;
}

.account-profile__status {
  width: fit-content;
  margin-top: 10rpx;
  padding: 6rpx 14rpx;
  border-radius: var(--fa-radius-pill);
  color: var(--fa-color-green-strong);
  background: var(--fa-color-green-soft);
  font-size: 22rpx;
  line-height: 30rpx;
}

.account-profile__status--disabled {
  color: var(--fa-color-danger);
  background: var(--fa-color-danger-soft);
}

.account-info,
.account-workspace,
.account-edit {
  margin-top: 24rpx;
}

.account-edit__avatar {
  width: 100%;
  margin: 0;
  padding: 0;
  color: var(--fa-color-primary);
  background: var(--fa-color-primary-soft);
  font-size: 26rpx;
  line-height: 76rpx;
}

.account-edit__row {
  display: flex;
  align-items: center;
  min-height: 96rpx;
  gap: 24rpx;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.account-edit__label {
  flex: 0 0 120rpx;
  color: var(--fa-color-muted);
}

.account-edit__input {
  min-width: 0;
  flex: 1;
  color: var(--fa-color-text);
  text-align: right;
  font-size: 28rpx;
}

.account-edit__error {
  display: block;
  margin-top: 20rpx;
  color: var(--fa-color-danger);
  font-size: 24rpx;
  line-height: 34rpx;
}

.account-edit__actions {
  display: flex;
  gap: 20rpx;
  margin-top: 28rpx;
}

.account-edit__cancel,
.account-edit__save {
  flex: 1;
  margin: 0;
  font-size: 28rpx;
  line-height: 76rpx;
}

.account-edit__cancel {
  color: var(--fa-color-text-secondary);
  background: var(--fa-color-page);
}

.account-edit__save {
  color: var(--fa-color-text-inverse);
  background: var(--fa-color-primary);
}

.account-info {
  padding: 0 32rpx;
}

.account-info__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88rpx;
  gap: 24rpx;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.account-info__row:last-child {
  border-bottom: 0;
}

.account-info__label {
  flex: 0 0 auto;
  color: var(--fa-color-muted);
}

.account-info__value {
  min-width: 0;
  overflow: hidden;
  color: var(--fa-color-text);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-workspace__title {
  color: var(--fa-color-muted);
  font-size: 24rpx;
  line-height: 36rpx;
}

.account-workspace__name {
  margin-top: 8rpx;
  color: var(--fa-color-text);
  font-size: 34rpx;
  font-weight: 700;
  line-height: 46rpx;
}

.account-workspace__role {
  margin-top: 4rpx;
  color: var(--fa-color-text-secondary);
  font-size: 26rpx;
  line-height: 38rpx;
}

.account-workspace__error {
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 34rpx;
}
</style>
