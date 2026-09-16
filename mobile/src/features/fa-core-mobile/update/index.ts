import { APP_CONFIG } from '@/app.config';
import { request } from '../common/request';
import type {
  AppVersion,
  UpdateCheckRequest,
  UpdateManifest,
  UpdateState,
  UpdateStateListener,
} from './types';

const INSTALL_LOCK_KEY = 'fa.mobile.update.install-lock';
const INSTALL_LOCK_TTL = 5 * 60 * 1000;

export type UpdateErrorCode =
  | 'INVALID_VERSION'
  | 'INVALID_MANIFEST'
  | 'DOWNLOAD_FAILED'
  | 'CHECKSUM_FAILED'
  | 'INSTALL_LOCKED'
  | 'INSTALL_UNSUPPORTED'
  | 'INSTALL_FAILED';

export class MobileUpdateError extends Error {
  readonly code: UpdateErrorCode;

  constructor(code: UpdateErrorCode, message: string) {
    super(message);
    this.name = 'MobileUpdateError';
    this.code = code;
  }
}

export function getCurrentVersion(): AppVersion {
  const versionCode = Number(APP_CONFIG.versionCode);
  if (!Number.isSafeInteger(versionCode) || versionCode < 0 || !APP_CONFIG.versionName.trim()) {
    throw new MobileUpdateError('INVALID_VERSION', '当前应用版本配置异常');
  }

  return {
    versionName: APP_CONFIG.versionName,
    versionCode,
  };
}

export async function checkUpdate(options: UpdateCheckRequest): Promise<UpdateManifest | null> {
  const result = await request<UpdateManifest>({
    url: '/app/app/release/check',
    method: 'POST',
    data: {
      appCode: options.appCode,
      platform: options.platform,
      currentVersionCode: options.currentVersionCode,
      channel: options.channel || 'stable',
    },
  });

  if (!result || !result.hasUpdate || result.updateType === 'NONE') return null;
  validateManifest(result);
  return result;
}

export function downloadUpdate(
  downloadUrl: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  if (!downloadUrl || !downloadUrl.trim()) {
    return Promise.reject(new MobileUpdateError('DOWNLOAD_FAILED', '更新文件地址不能为空'));
  }

  return new Promise((resolve, reject) => {
    try {
      const task = uni.downloadFile({
        url: resolveDownloadUrl(downloadUrl),
        timeout: 60_000,
        success: (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300 || !response.tempFilePath) {
            reject(new MobileUpdateError('DOWNLOAD_FAILED', '更新文件下载失败'));
            return;
          }
          resolve(response.tempFilePath);
        },
        fail: (error) => {
          reject(new MobileUpdateError('DOWNLOAD_FAILED', getErrorMessage(error, '更新文件下载失败')));
        },
      });
      task.onProgressUpdate((result) => onProgress?.(Math.max(0, Math.min(100, result.progress))));
    } catch (error) {
      reject(new MobileUpdateError('DOWNLOAD_FAILED', getErrorMessage(error, '更新文件下载失败')));
    }
  });
}

export function verifyFileSha256(filePath: string, expectedSha256: string): Promise<void> {
  const expected = expectedSha256?.trim().toLowerCase();
  if (!filePath || !/^[a-f0-9]{64}$/.test(expected)) {
    return Promise.reject(new MobileUpdateError('CHECKSUM_FAILED', '更新文件SHA-256摘要格式异常'));
  }

  return new Promise((resolve, reject) => {
    try {
      uni.getFileInfo({
        filePath,
        digestAlgorithm: 'sha256',
        success: (result) => {
          const actual = result.digest?.trim().toLowerCase();
          if (!actual || actual !== expected) {
            reject(new MobileUpdateError('CHECKSUM_FAILED', '更新文件SHA-256校验失败'));
            return;
          }
          resolve();
        },
        fail: (error) => {
          reject(new MobileUpdateError('CHECKSUM_FAILED', getErrorMessage(error, '更新文件校验失败')));
        },
      });
    } catch (error) {
      reject(new MobileUpdateError('CHECKSUM_FAILED', getErrorMessage(error, '更新文件校验失败')));
    }
  });
}

export class MobileUpdateClient {
  private state: UpdateState = { status: 'IDLE', progress: 0 };
  private readonly listeners = new Set<UpdateStateListener>();

  getState(): UpdateState {
    return {
      ...this.state,
      manifest: this.state.manifest ? { ...this.state.manifest } : undefined,
    };
  }

  subscribe(listener: UpdateStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  async check(options: UpdateCheckRequest): Promise<UpdateManifest | null> {
    this.setState({ status: 'CHECKING', progress: 0, error: undefined, filePath: undefined });
    try {
      const manifest = await checkUpdate(options);
      if (!manifest) {
        this.setState({ status: 'NO_UPDATE', progress: 0, manifest: undefined });
        return null;
      }
      this.setState({ status: 'AVAILABLE', progress: 0, manifest });
      return manifest;
    } catch (error) {
      this.fail(error);
      throw error;
    }
  }

  async download(manifest: UpdateManifest, onProgress?: (progress: number) => void): Promise<string> {
    try {
      validateManifest(manifest);
      this.setState({ status: 'DOWNLOADING', progress: 0, manifest, error: undefined, filePath: undefined });
      const filePath = await downloadUpdate(manifest.downloadUrl!, (progress) => {
        this.setState({ progress });
        onProgress?.(progress);
      });
      this.setState({ status: 'VERIFYING', progress: 100, filePath });
      await verifyFileSha256(filePath, manifest.sha256!);
      this.setState({ status: 'READY', progress: 100, filePath });
      return filePath;
    } catch (error) {
      this.fail(error);
      throw error;
    }
  }

  async install(manifest: UpdateManifest, filePath = this.state.filePath): Promise<void> {
    let lockAcquired = false;
    try {
      validateManifest(manifest);
      if (!filePath) throw new MobileUpdateError('INSTALL_FAILED', '更新文件尚未下载');
      if (!acquireInstallLock()) throw new MobileUpdateError('INSTALL_LOCKED', '更新正在安装，请勿重复操作');
      lockAcquired = true;

      this.setState({ status: 'INSTALLING', manifest, filePath, error: undefined });
      await verifyFileSha256(filePath, manifest.sha256!);
      if (manifest.updateType !== 'WGT') {
        throw new MobileUpdateError('INSTALL_UNSUPPORTED', '当前版本仅支持APP-PLUS WGT安装');
      }
      await installWgt(filePath);
      this.setState({ status: 'INSTALLED', progress: 100 });
    } catch (error) {
      this.fail(error);
      throw error;
    } finally {
      if (lockAcquired) releaseInstallLock();
    }
  }

  reset(): void {
    this.setState({ status: 'IDLE', progress: 0, manifest: undefined, filePath: undefined, error: undefined });
  }

  private setState(changes: Partial<UpdateState>): void {
    this.state = { ...this.state, ...changes };
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  private fail(error: unknown): void {
    this.setState({ status: 'FAILED', error: getErrorMessage(error, '更新失败') });
  }
}

function validateManifest(manifest: UpdateManifest): void {
  if (!manifest || !manifest.hasUpdate || !['WGT', 'FULL'].includes(manifest.updateType)
      || !Number.isSafeInteger(manifest.versionCode) || !manifest.versionName?.trim()
      || !manifest.downloadUrl?.trim() || !/^[a-fA-F0-9]{64}$/.test(manifest.sha256 || '')) {
    throw new MobileUpdateError('INVALID_MANIFEST', '更新信息不完整或格式异常');
  }
  const baseVersionCode = manifest.baseVersionCode;
  if (manifest.updateType === 'WGT'
      && (typeof baseVersionCode !== 'number' || !Number.isSafeInteger(baseVersionCode) || baseVersionCode < 1)) {
    throw new MobileUpdateError('INVALID_MANIFEST', 'WGT基础版本信息异常');
  }
}

function installWgt(filePath: string): Promise<void> {
  if (typeof plus === 'undefined' || !plus.runtime) {
    return Promise.reject(new MobileUpdateError('INSTALL_UNSUPPORTED', '当前平台不支持WGT安装'));
  }

  return new Promise((resolve, reject) => {
    try {
      plus.runtime.install(
        filePath,
        { force: false },
        () => resolve(),
        (error) => reject(new MobileUpdateError('INSTALL_FAILED', getErrorMessage(error, 'WGT安装失败'))),
      );
    } catch (error) {
      reject(new MobileUpdateError('INSTALL_FAILED', getErrorMessage(error, 'WGT安装失败')));
    }
  });
}

function acquireInstallLock(): boolean {
  const now = Date.now();
  if (memoryInstallLock) return false;

  try {
    const stored = uni.getStorageSync(INSTALL_LOCK_KEY) as { createdAt?: number } | undefined;
    if (stored?.createdAt && now - stored.createdAt < INSTALL_LOCK_TTL) return false;
    uni.setStorageSync(INSTALL_LOCK_KEY, { createdAt: now });
  } catch {
    // 本地存储不可用时仍使用进程内锁，避免同一进程重复安装。
  }

  memoryInstallLock = true;
  return true;
}

function releaseInstallLock(): void {
  memoryInstallLock = false;
  try {
    uni.removeStorageSync(INSTALL_LOCK_KEY);
  } catch {
    // 清理锁失败时由TTL兜底恢复。
  }
}

function resolveDownloadUrl(url: string): string {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(url)) return url;
  const baseUrl = APP_CONFIG.apiBaseUrl.replace(/\/$/, '');
  if (url.startsWith('/')) {
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(baseUrl)) {
      return new URL(url, `${baseUrl}/`).toString();
    }
    return url;
  }
  return `${baseUrl}/${url.replace(/^\/+/, '')}`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object' && 'errMsg' in error) {
    const message = (error as { errMsg?: unknown }).errMsg;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}

let memoryInstallLock = false;

export const updateClient = new MobileUpdateClient();

export type {
  AppVersion,
  UpdateCheckRequest,
  UpdateManifest,
  UpdatePlatform,
  UpdateState,
  UpdateStateListener,
  UpdateStatus,
  UpdateType,
} from './types';
