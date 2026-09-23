import { APP_CONFIG } from '@/app.config';
import {
  getCurrentAppVersionCode,
  getCurrentVersion,
  getCurrentWgtVersionCode,
  getUpdateDeviceId,
  supportsFullPackageInstall,
  updateClient,
} from '@features/fa-core-mobile/update';
import { MobileUpdateError } from '@features/fa-core-mobile/update';
import type {
  UpdateManifest,
  UpdatePlatform,
} from '@features/fa-core-mobile/update';

export interface H5UpdateManifest {
  versionCode: number;
  versionName: string;
  releaseNote?: string;
  forceUpdate?: boolean;
}

async function getAppUpdateOptions() {
  const appCode = APP_CONFIG.updateAppCode.trim();
  if (!appCode) return null;
  const platform = getUpdatePlatform();
  if (platform !== 'APP_PLUS') return null;
  const currentWgtVersionCode = await getCurrentWgtVersionCode();

  return {
    appCode,
    platform,
    currentVersionCode: getCurrentAppVersionCode(),
    currentWgtVersionCode,
    channel: APP_CONFIG.updateChannel,
    deviceId: getUpdateDeviceId(),
  };
}

export async function checkApkUpdate(): Promise<UpdateManifest | null> {
  if (!supportsFullPackageInstall()) return null;
  const options = await getAppUpdateOptions();
  return options ? updateClient.checkApk(options) : null;
}

export async function checkWgtUpdate(): Promise<UpdateManifest | null> {
  const options = await getAppUpdateOptions();
  return options ? updateClient.checkWgt(options) : null;
}

export function checkH5Update(): Promise<H5UpdateManifest | null> {
  const manifestUrl = APP_CONFIG.h5UpdateManifestUrl.trim();
  if (!manifestUrl) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    uni.request({
      url: appendCacheBuster(manifestUrl),
      method: 'GET',
      timeout: 5_000,
      success: (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new MobileUpdateError('INVALID_MANIFEST', 'H5版本清单获取失败'));
          return;
        }

        if (!response.data || typeof response.data !== 'object') {
          reject(new MobileUpdateError('INVALID_MANIFEST', 'H5版本清单格式异常'));
          return;
        }

        const manifest = response.data as Partial<H5UpdateManifest>;
        const versionCode = manifest.versionCode;
        const versionName = typeof manifest.versionName === 'string' ? manifest.versionName.trim() : '';
        if (typeof versionCode !== 'number' || !Number.isSafeInteger(versionCode) || !versionName) {
          reject(new MobileUpdateError('INVALID_MANIFEST', 'H5版本清单格式异常'));
          return;
        }

        if (versionCode <= getCurrentVersion().versionCode) {
          resolve(null);
          return;
        }
        resolve({
          versionCode,
          versionName,
          releaseNote: typeof manifest.releaseNote === 'string' ? manifest.releaseNote : undefined,
          forceUpdate: Boolean(manifest.forceUpdate),
        });
      },
      fail: (error) => reject(new MobileUpdateError(
        'DOWNLOAD_FAILED',
        typeof error?.errMsg === 'string' ? error.errMsg : 'H5版本清单获取失败',
      )),
    });
  });
}

export function getUpdatePlatform(): UpdatePlatform {
  let platform: UpdatePlatform = 'H5';

  // #ifdef APP-PLUS
  platform = 'APP_PLUS';
  // #endif

  // #ifdef MP-WEIXIN
  platform = 'MP_WEIXIN';
  // #endif

  return platform;
}

function appendCacheBuster(url: string): string {
  return `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
}
