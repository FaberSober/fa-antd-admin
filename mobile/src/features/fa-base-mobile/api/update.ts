import { APP_CONFIG } from '@/app.config';
import {
  getCurrentVersion,
  updateClient,
} from '@features/fa-core-mobile/update';
import type {
  UpdateManifest,
  UpdatePlatform,
} from '@features/fa-core-mobile/update';

export function checkBaseUpdate(): Promise<UpdateManifest | null> {
  const appCode = APP_CONFIG.updateAppCode.trim();
  if (!appCode) return Promise.resolve(null);

  return updateClient.check({
    appCode,
    platform: getUpdatePlatform(),
    currentVersionCode: getCurrentVersion().versionCode,
    channel: APP_CONFIG.updateChannel,
  });
}

function getUpdatePlatform(): UpdatePlatform {
  let platform: UpdatePlatform = 'H5';

  // #ifdef APP-PLUS
  platform = 'APP_PLUS';
  // #endif

  // #ifdef MP-WEIXIN
  platform = 'MP_WEIXIN';
  // #endif

  return platform;
}
