<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { ApiError } from '../../common/request';
import { hasToken } from '../../common/session';
import { buildH5PreviewUrl, createFilePreviewTicket } from '../../api/file';
import { telemetry } from '@features/fa-core-mobile/telemetry';

const LOGIN_ROUTE = '/features/fa-base-mobile/pages/login/index';

const previewUrl = ref('');
const errorMessage = ref('');
const loading = ref(false);

function ensureAuthenticated(): boolean {
  if (hasToken()) return true;
  uni.reLaunch({ url: LOGIN_ROUTE });
  return false;
}

async function preparePreview(fileId: string): Promise<void> {
  if (!ensureAuthenticated() || loading.value) return;

  loading.value = true;
  errorMessage.value = '';
  previewUrl.value = '';

  try {
    const result = await createFilePreviewTicket(fileId);
    const url = buildH5PreviewUrl(result.ticket);
    // #ifdef H5
    window.location.assign(url);
    // #endif
    // #ifndef H5
    previewUrl.value = url;
    // #endif
    telemetry.track('mobile.file.preview.open', {
      module: 'fa-base-mobile',
      result: 'SUCCESS',
      properties: { fileType: 'unknown' },
    });
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '文件预览准备失败，请稍后重试';
    telemetry.track('mobile.file.preview.open', {
      module: 'fa-base-mobile',
      result: 'FAIL',
      properties: {
        errorType: error instanceof Error ? error.name : 'UnknownError',
      },
    });
  } finally {
    loading.value = false;
  }
}

onLoad((options) => {
  const fileId = typeof options?.fileId === 'string' ? options.fileId.trim() : '';
  if (!fileId) {
    errorMessage.value = '缺少文件 ID，无法打开预览';
    return;
  }
  void preparePreview(fileId);
});

onShow(() => {
  telemetry.page('/features/fa-base-mobile/pages/file-preview/index');
  ensureAuthenticated();
});
</script>

<template>
  <view class="file-preview-page">
    <view v-if="loading" class="state-card">
      <text class="state-text">正在准备文件预览...</text>
    </view>
    <view v-else-if="errorMessage" class="state-card">
      <text class="state-error">{{ errorMessage }}</text>
    </view>
    <!-- #ifdef H5 -->
    <view v-else-if="previewUrl" class="state-card">
      <text class="state-text">正在打开文件预览...</text>
    </view>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <web-view v-else-if="previewUrl" class="preview-webview" :src="previewUrl" />
    <!-- #endif -->
  </view>
</template>

<style scoped>
.file-preview-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: #111827;
}

.preview-webview {
  flex: 1;
  width: 100%;
  height: 100%;
}

.state-card {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  text-align: center;
}

.state-text,
.state-error {
  font-size: 28rpx;
}

.state-text {
  color: #d1d5db;
}

.state-error {
  color: #fca5a5;
}
</style>
