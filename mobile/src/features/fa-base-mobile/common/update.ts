import { telemetry } from '@features/fa-core-mobile/telemetry';
import {
  MobileUpdateError,
  supportsFullPackageInstall,
  updateClient,
} from '@features/fa-core-mobile/update';
import type { UpdateManifest } from '@features/fa-core-mobile/update';
import { checkBaseUpdate } from '../api/update';

let promptInFlight = false;

export async function checkAndPromptUpdate(): Promise<void> {
  if (promptInFlight) return;
  promptInFlight = true;

  try {
    const manifest = await checkBaseUpdate();
    if (!manifest) return;

    telemetry.track('mobile.update.available', {
      eventType: 'BUSINESS',
      module: 'fa-base-mobile',
      properties: {
        updateType: manifest.updateType,
        versionCode: manifest.versionCode,
        forceUpdate: Boolean(manifest.forceUpdate),
      },
    });

    const accepted = await showModal({
      title: `发现新版本 ${manifest.versionName}`,
      content: buildUpdateContent(manifest),
      showCancel: !manifest.forceUpdate,
      cancelText: '稍后更新',
      confirmText: '立即更新',
    });
    if (!accepted.confirm) {
      telemetry.track('mobile.update.skip', {
        eventType: 'ACTION',
        module: 'fa-base-mobile',
        result: 'CANCEL',
      });
      return;
    }

    if (manifest.updateType === 'FULL' && !supportsFullPackageInstall()) {
      telemetry.track('mobile.update.full.pending', {
        eventType: 'ACTION',
        module: 'fa-base-mobile',
        result: 'UNSUPPORTED',
      });
      await showModal({
        title: '需要完整包更新',
        content: '当前平台不能在应用内安装完整包，请通过 App Store 或企业分发渠道更新。',
        showCancel: false,
        confirmText: '知道了',
      });
      return;
    }

    uni.showLoading({ title: '准备下载...', mask: true });
    try {
      const filePath = await updateClient.download(manifest, (progress) => {
        uni.showLoading({ title: `下载中 ${progress}%`, mask: true });
      });
      uni.hideLoading();

      const installAccepted = await showModal({
        title: '下载完成',
        content: `${manifest.updateType === 'WGT' ? '增量资源包' : '完整包'}已下载并完成校验，是否立即安装更新？`,
        showCancel: !manifest.forceUpdate,
        cancelText: '稍后安装',
        confirmText: '立即安装',
      });
      if (!installAccepted.confirm) {
        telemetry.track('mobile.update.install.skip', {
          eventType: 'ACTION',
          module: 'fa-base-mobile',
          result: 'CANCEL',
        });
        return;
      }

      await updateClient.install(manifest, filePath);
      telemetry.track('mobile.update.install', {
        eventType: 'ACTION',
        module: 'fa-base-mobile',
        result: 'SUCCESS',
      });
    } finally {
      uni.hideLoading();
    }
  } catch (error) {
    telemetry.captureException(error, { source: 'fa-base-mobile.update' });
    uni.hideLoading();
    await showModal({
      title: '更新失败',
      content: error instanceof MobileUpdateError ? error.message : '更新失败，请稍后重试。',
      showCancel: false,
      confirmText: '知道了',
    }).catch(() => undefined);
  } finally {
    promptInFlight = false;
  }
}

function buildUpdateContent(manifest: UpdateManifest): string {
  const packageName = manifest.updateType === 'WGT' ? '增量资源包' : '完整包';
  const note = manifest.releaseNote?.trim() || '暂无更新说明';
  return `更新类型：${packageName}\n\n${note}`;
}

function showModal(options: UniNamespace.ShowModalOptions): Promise<UniNamespace.ShowModalRes> {
  return new Promise((resolve, reject) => {
    uni.showModal({
      ...options,
      success: resolve,
      fail: reject,
    });
  });
}
