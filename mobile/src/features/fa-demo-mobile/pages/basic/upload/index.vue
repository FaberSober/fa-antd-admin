<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { ApiError } from '@features/fa-base-mobile/common/request';
import { hasToken } from '@features/fa-base-mobile/common/session';
import { uploadBaseFile, type MobileFileSave } from '@features/fa-base-mobile/api/file';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const LOGIN_ROUTE = '/features/fa-base-mobile/pages/login/index';

interface SelectedFile {
  path: string;
  name: string;
}

const selectedFile = ref<SelectedFile | null>(null);
const uploadedFile = ref<MobileFileSave | null>(null);
const errorMessage = ref('');
const uploading = ref(false);

function openPreview(): void {
  if (!uploadedFile.value?.id) return;
  uni.navigateTo({
    url: `/features/fa-base-mobile/pages/file-preview/index?fileId=${encodeURIComponent(uploadedFile.value.id)}`,
  });
}

function ensureAuthenticated(): void {
  if (!hasToken()) {
    uni.reLaunch({ url: LOGIN_ROUTE });
  }
}

function getFileName(path: string): string {
  const normalizedPath = path.split(/[?#]/, 1)[0];
  return normalizedPath.split('/').pop() || 'selected-image';
}

function chooseFile(): void {
  errorMessage.value = '';
  uploadedFile.value = null;

  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (result) => {
      const path = result.tempFilePaths[0];
      if (!path) {
        errorMessage.value = '未选择文件';
        return;
      }

      selectedFile.value = {
        path,
        name: getFileName(path),
      };
    },
    fail: (error) => {
      if (!error.errMsg?.includes('cancel')) {
        errorMessage.value = error.errMsg || '选择文件失败';
      }
    },
  });
}

async function handleUpload(): Promise<void> {
  if (!selectedFile.value || uploading.value) return;

  uploading.value = true;
  errorMessage.value = '';
  uploadedFile.value = null;

  try {
    uploadedFile.value = await uploadBaseFile(selectedFile.value.path);
    telemetry.track('mobile.demo.file.upload', {
      module: 'fa-demo-mobile',
      result: 'SUCCESS',
      properties: {
        name: selectedFile.value.name,
      },
    });
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '文件上传失败，请稍后重试';
    telemetry.track('mobile.demo.file.upload', {
      module: 'fa-demo-mobile',
      result: 'FAIL',
      properties: {
        errorType: error instanceof Error ? error.name : 'UnknownError',
      },
    });
  } finally {
    uploading.value = false;
  }
}

onShow(() => {
  telemetry.page('/features/fa-demo-mobile/pages/basic/upload/index');
  ensureAuthenticated();
});
</script>

<template>
  <view class="upload-page fa-page">
    <view class="page-heading">
      <text class="page-title">文件上传</text>
      <text class="page-subtitle">使用 uni-app 原生 chooseImage 和 uploadFile</text>
    </view>

    <view class="demo-section fa-card">
      <text class="section-title">选择文件</text>
      <button class="demo-button demo-button--plain" @click="chooseFile">选择图片</button>

      <view v-if="selectedFile" class="selected-file">
        <image class="file-preview" :src="selectedFile.path" mode="aspectFill" />
        <view class="file-meta">
          <text class="file-name">{{ selectedFile.name }}</text>
        </view>
      </view>

      <button
        class="demo-button demo-button--primary"
        :disabled="!selectedFile || uploading"
        :loading="uploading"
        @click="handleUpload"
      >上传文件</button>

      <text v-if="errorMessage" class="error-message">{{ errorMessage }}</text>
    </view>

    <view v-if="uploadedFile" class="demo-section fa-card">
      <text class="section-title success-title">上传成功</text>
      <view class="result-row">
        <text class="result-label">文件 ID</text>
        <text class="result-value">{{ uploadedFile.id }}</text>
      </view>
      <view v-if="uploadedFile.originalFilename" class="result-row">
        <text class="result-label">原始文件名</text>
        <text class="result-value">{{ uploadedFile.originalFilename }}</text>
      </view>
      <view v-if="uploadedFile.url" class="result-row">
        <text class="result-label">访问地址</text>
        <text class="result-value result-value--url">{{ uploadedFile.url }}</text>
      </view>
      <button class="demo-button demo-button--primary" @click="openPreview">打开文件预览</button>
    </view>
  </view>
</template>

<style scoped>
.upload-page {
  padding-top: 56rpx;
  padding-bottom: 72rpx;
}

.page-heading {
  margin: 0 8rpx 32rpx;
}

.page-title,
.page-subtitle,
.section-title,
.file-name,
.result-label,
.result-value {
  display: block;
}

.page-title {
  margin-bottom: 12rpx;
  font-size: 48rpx;
  font-weight: 700;
}

.page-subtitle,
.result-label {
  color: var(--fa-color-muted);
  font-size: 24rpx;
}

.demo-section {
  margin-bottom: 24rpx;
  padding: 32rpx;
}

.section-title {
  margin-bottom: 24rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.demo-button {
  margin: 0 0 20rpx;
  font-size: 28rpx;
}

.demo-button:last-child {
  margin-bottom: 0;
}

.demo-button--primary {
  color: #ffffff;
  background: var(--fa-color-primary);
}

.demo-button--plain {
  color: var(--fa-color-primary);
  border: 1rpx solid var(--fa-color-primary);
  background: transparent;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  background: var(--fa-color-page);
}

.file-preview {
  flex: 0 0 auto;
  width: 112rpx;
  height: 112rpx;
  border-radius: 10rpx;
}

.file-meta {
  min-width: 0;
}

.file-name {
  overflow: hidden;
  margin-bottom: 8rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 28rpx;
}

.error-message {
  display: block;
  color: #dc2626;
  font-size: 24rpx;
}

.success-title {
  color: #16a34a;
}

.result-row {
  display: flex;
  gap: 20rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--fa-color-border);
}

.result-row:last-child {
  border-bottom: 0;
}

.result-label {
  flex: 0 0 160rpx;
}

.result-value {
  min-width: 0;
  color: var(--fa-color-text);
  font-size: 24rpx;
  word-break: break-all;
}

.result-value--url {
  user-select: text;
}
</style>
