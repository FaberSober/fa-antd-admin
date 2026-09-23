import { APP_CONFIG } from '@/app.config';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import {
  MobileUpdateError,
  supportsFullPackageInstall,
  updateClient,
} from '@features/fa-core-mobile/update';
import type { UpdateManifest } from '@features/fa-core-mobile/update';
import { checkApkUpdate, checkH5Update, checkWgtUpdate, getUpdatePlatform } from '../api/update';

let promptInFlight = false;
let lastCheckAt = 0;

const UPDATE_CHECK_COOLDOWN = 10 * 60 * 1000;

interface UpdateCheckOptions {
  manual?: boolean;
}

export async function checkAndPromptUpdate(options: UpdateCheckOptions = {}): Promise<void> {
  const now = Date.now();
  const manual = Boolean(options.manual);
  if (promptInFlight) {
    if (manual) uni.showToast({ title: '正在检查更新', icon: 'none' });
    return;
  }
  if (!manual && now - lastCheckAt < UPDATE_CHECK_COOLDOWN) return;
  promptInFlight = true;
  lastCheckAt = now;

  try {
    const platform = getUpdatePlatform();
    if (platform === 'APP_PLUS' && !APP_CONFIG.updateAppCode.trim()) {
      if (manual) {
        await showModal({
          title: '更新服务未配置',
          content: '请在 mobile 环境配置 VITE_APP_UPDATE_APP_CODE 为后台应用短码，并重新构建安装包。',
          showCancel: false,
          confirmText: '知道了',
        });
      }
      return;
    }
    if (platform === 'MP_WEIXIN') {
      startMiniProgramUpdate();
      if (manual) uni.showToast({ title: '小程序更新由平台自动检查', icon: 'none' });
      return;
    }
    if (platform === 'H5') {
      const hasUpdate = await checkAndPromptH5Update();
      if (manual && hasUpdate === false) showLatestVersionToast();
      return;
    }

    let hasUpdate = false;
    const apkManifest = await checkApkUpdate();
    if (apkManifest) {
      hasUpdate = true;
      const apkResult = await promptAndInstallUpdate(apkManifest);
      if (apkResult === 'INSTALLED' || apkResult === 'BLOCKED') return;
    }

    const wgtManifest = await checkWgtUpdate();
    if (wgtManifest) {
      hasUpdate = true;
      await promptAndInstallUpdate(wgtManifest);
    }
    if (manual && !hasUpdate) showLatestVersionToast();
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

type UpdatePromptResult = 'SKIPPED' | 'BLOCKED' | 'INSTALLED';

async function promptAndInstallUpdate(manifest: UpdateManifest): Promise<UpdatePromptResult> {
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
    return 'SKIPPED';
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
    return manifest.forceUpdate ? 'BLOCKED' : 'SKIPPED';
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
      return 'SKIPPED';
    }

    await updateClient.install(manifest, filePath);
    telemetry.track('mobile.update.install', {
        eventType: 'ACTION',
        module: 'fa-base-mobile',
        result: 'SUCCESS',
    });
    if (manifest.updateType === 'WGT' && typeof plus !== 'undefined' && plus.runtime?.restart) {
      plus.runtime.restart();
    }
    return 'INSTALLED';
  } finally {
    uni.hideLoading();
  }
}

async function checkAndPromptH5Update(): Promise<boolean | undefined> {
  try {
    const manifest = await checkH5Update();
    if (!manifest) return false;

    telemetry.track('mobile.update.h5.available', {
      eventType: 'BUSINESS',
      module: 'fa-base-mobile',
      properties: {
        versionCode: manifest.versionCode,
        forceUpdate: Boolean(manifest.forceUpdate),
      },
    });

    const accepted = await showModal({
      title: `发现新版本 ${manifest.versionName}`,
      content: `H5静态资源已发布。\n\n${manifest.releaseNote?.trim() || '暂无更新说明'}`,
      showCancel: !manifest.forceUpdate,
      cancelText: '稍后刷新',
      confirmText: '立即刷新',
    });
    if (!accepted.confirm) {
      telemetry.track('mobile.update.h5.skip', {
        eventType: 'ACTION',
        module: 'fa-base-mobile',
        result: 'CANCEL',
      });
      return true;
    }

    telemetry.track('mobile.update.h5.reload', {
      eventType: 'ACTION',
      module: 'fa-base-mobile',
      result: 'SUCCESS',
    });
    if (typeof window !== 'undefined') window.location.reload();
    return true;
  } catch (error) {
    telemetry.captureException(error, { source: 'fa-base-mobile.h5-update' });
    return undefined;
  }
}

function showLatestVersionToast(): void {
  uni.showToast({ title: '已是最新版本', icon: 'none' });
}

function startMiniProgramUpdate(): void {
  if (miniProgramUpdateStarted || typeof uni.getUpdateManager !== 'function') return;
  miniProgramUpdateStarted = true;

  const manager = uni.getUpdateManager();
  manager.onCheckForUpdate(({ hasUpdate }) => {
    telemetry.track('mobile.update.mp.check', {
      eventType: 'ACTION',
      module: 'fa-base-mobile',
      result: hasUpdate ? 'AVAILABLE' : 'NONE',
    });
  });
  manager.onUpdateReady(() => {
    void promptMiniProgramUpdate(manager);
  });
  manager.onUpdateFailed((error) => {
    telemetry.captureException(error, { source: 'fa-base-mobile.mp-update' });
  });
}

async function promptMiniProgramUpdate(manager: UniNamespace.UpdateManager): Promise<void> {
  try {
    telemetry.track('mobile.update.mp.available', {
      eventType: 'BUSINESS',
      module: 'fa-base-mobile',
    });
    const accepted = await showModal({
      title: '发现小程序新版本',
      content: '新版本已下载完成，确认后将重启小程序。',
      confirmText: '立即更新',
      cancelText: '稍后更新',
    });
    if (!accepted.confirm) {
      telemetry.track('mobile.update.mp.skip', {
        eventType: 'ACTION',
        module: 'fa-base-mobile',
        result: 'CANCEL',
      });
      return;
    }
    telemetry.track('mobile.update.mp.apply', {
      eventType: 'ACTION',
      module: 'fa-base-mobile',
      result: 'SUCCESS',
    });
    manager.applyUpdate();
  } catch (error) {
    telemetry.captureException(error, { source: 'fa-base-mobile.mp-update-prompt' });
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

let miniProgramUpdateStarted = false;
