import { APP_CONFIG } from '@/app.config';
import type { TelemetryContext } from './types';

function readString(info: Record<string, unknown>, key: string): string | undefined {
  const value = info[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function getMobileTelemetryContext(): TelemetryContext {
  const context: TelemetryContext = {
    appName: APP_CONFIG.name,
    appVersion: APP_CONFIG.versionName,
    faFrom: APP_CONFIG.faFrom,
  };

  try {
    const info = uni.getSystemInfoSync() as unknown as Record<string, unknown>;
    for (const key of ['platform', 'uniPlatform', 'osName', 'osVersion', 'deviceModel']) {
      const value = readString(info, key);
      if (value) context[key] = value;
    }
  } catch {
    // 获取设备信息失败时仍保留应用和版本上下文。
  }

  return context;
}
