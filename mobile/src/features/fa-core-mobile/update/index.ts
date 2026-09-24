import { APP_CONFIG } from '@/app.config';
import { logUpdateEvent } from '../common/http-logger';
import { request } from '../common/request';
import type {
  AppVersion,
  UpdateCheckRequest,
  UpdateManifest,
  UpdateState,
  UpdateStateListener,
} from './types';

export { getUpdateDeviceId } from './device';

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

interface UpdateManifestResponse extends Omit<UpdateManifest, 'versionCode' | 'minSupportedVersionCode'> {
  versionCode?: number | string;
  minSupportedVersionCode?: number | string | null;
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

export function getCurrentAppVersionCode(): number {
  return getCurrentAppVersion().versionCode;
}

export function getCurrentAppVersion(): AppVersion {
  const fallbackVersion = getCurrentVersion();
  const runtimeVersionCode = typeof plus === 'undefined' ? NaN : Number(plus.runtime?.versionCode);
  const runtimeVersionName = typeof plus === 'undefined' ? '' : plus.runtime?.version?.trim();
  return {
    versionName: runtimeVersionName || fallbackVersion.versionName,
    versionCode: Number.isSafeInteger(runtimeVersionCode) && runtimeVersionCode >= 0
      ? runtimeVersionCode
      : fallbackVersion.versionCode,
  };
}

export async function getCurrentWgtVersionCode(): Promise<number> {
  return (await getCurrentWgtVersion()).versionCode;
}

export function getCurrentWgtVersion(): Promise<AppVersion> {
  const fallbackVersion = getCurrentVersion();
  if (typeof plus === 'undefined' || !plus.runtime?.getProperty) return Promise.resolve(fallbackVersion);
  const appid = plus.runtime.appid;
  if (!appid) return Promise.resolve(fallbackVersion);

  return new Promise((resolve) => {
    try {
      plus.runtime.getProperty(appid, (wgtInfo) => {
        const info = wgtInfo as { version?: unknown; versionCode?: unknown };
        const versionCode = Number(info.versionCode);
        resolve({
          versionName: typeof info.version === 'string' && info.version.trim()
            ? info.version.trim()
            : fallbackVersion.versionName,
          versionCode: Number.isSafeInteger(versionCode) && versionCode >= 0
            ? versionCode
            : fallbackVersion.versionCode,
        });
      });
    } catch {
      resolve(fallbackVersion);
    }
  });
}

async function requestUpdate(endpoint: 'checkApk' | 'checkWgt', options: UpdateCheckRequest): Promise<UpdateManifest | null> {
  const result = await request<UpdateManifestResponse>({
    url: `/app/app/release/${endpoint}`,
    method: 'POST',
    data: {
      appCode: options.appCode,
      platform: options.platform,
      currentVersionCode: options.currentVersionCode,
      ...(options.currentWgtVersionCode !== undefined
        ? { currentWgtVersionCode: options.currentWgtVersionCode }
        : {}),
      channel: options.channel || 'stable',
      ...(options.deviceId ? { deviceId: options.deviceId } : {}),
    },
  });

  if (!result || !result.hasUpdate || result.updateType === 'NONE') return null;
  const manifest = normalizeUpdateManifest(result);
  validateManifest(manifest);
  return manifest;
}

function normalizeUpdateManifest(manifest: UpdateManifestResponse): UpdateManifest {
  const versionCode = parseVersionCode(manifest.versionCode);
  const minimumVersion = manifest.minSupportedVersionCode;
  const minSupportedVersionCode = minimumVersion == null ? undefined : parseVersionCode(minimumVersion);

  if (minimumVersion != null && (minSupportedVersionCode === undefined || minSupportedVersionCode < 1)) {
    throw new MobileUpdateError('INVALID_MANIFEST', '最低兼容APK版本信息异常');
  }

  return {
    ...manifest,
    versionCode,
    minSupportedVersionCode,
  };
}

function parseVersionCode(value: number | string | undefined): number | undefined {
  if (typeof value === 'string' && !/^\d+$/.test(value.trim())) return undefined;
  const versionCode = typeof value === 'string' ? Number(value.trim()) : value;
  return typeof versionCode === 'number' && Number.isSafeInteger(versionCode) && versionCode >= 0
    ? versionCode
    : undefined;
}

export function checkApkUpdate(options: UpdateCheckRequest): Promise<UpdateManifest | null> {
  return requestUpdate('checkApk', options);
}

export async function checkWgtUpdate(options: UpdateCheckRequest): Promise<UpdateManifest | null> {
  const result = await requestUpdate('checkWgt', options);
  if (result?.minSupportedVersionCode !== undefined
      && options.currentVersionCode < result.minSupportedVersionCode) {
    return null;
  }
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
    let url: string | undefined;
    try {
      url = resolveDownloadUrl(downloadUrl);
      logUpdateEvent('download-start', { url });
      const task = uni.downloadFile({
        url,
        timeout: 60_000,
        success: (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300 || !response.tempFilePath) {
            logUpdateEvent('download-failure', {
              url,
              statusCode: response.statusCode,
              tempFilePath: response.tempFilePath,
            });
            reject(new MobileUpdateError('DOWNLOAD_FAILED', '更新文件下载失败'));
            return;
          }
          logUpdateEvent('download-success', {
            url,
            statusCode: response.statusCode,
            tempFilePath: response.tempFilePath,
          });
          resolve(response.tempFilePath);
        },
        fail: (error) => {
          logUpdateEvent('download-failure', { url, error: describeUpdateError(error) });
          reject(new MobileUpdateError('DOWNLOAD_FAILED', getErrorMessage(error, '更新文件下载失败')));
        },
      });
      task.onProgressUpdate((result) => onProgress?.(Math.max(0, Math.min(100, result.progress))));
    } catch (error) {
      logUpdateEvent('download-failure', { url, error: describeUpdateError(error) });
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

export function supportsFullPackageInstall(): boolean {
  if (typeof plus === 'undefined' || !plus.runtime) return false;
  try {
    const info = uni.getSystemInfoSync() as unknown as { osName?: unknown };
    return typeof info.osName === 'string' && info.osName.toLowerCase() === 'android';
  } catch {
    return false;
  }
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

  async checkApk(options: UpdateCheckRequest): Promise<UpdateManifest | null> {
    return this.checkWith(() => checkApkUpdate(options));
  }

  async checkWgt(options: UpdateCheckRequest): Promise<UpdateManifest | null> {
    return this.checkWith(() => checkWgtUpdate(options));
  }

  private async checkWith(checker: () => Promise<UpdateManifest | null>): Promise<UpdateManifest | null> {
    this.setState({ status: 'CHECKING', progress: 0, error: undefined, filePath: undefined });
    try {
      const manifest = await checker();
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
      logUpdateEvent('checksum-start', { filePath, phase: 'download' });
      await verifyFileSha256(filePath, manifest.sha256!);
      logUpdateEvent('checksum-success', { filePath, phase: 'download' });
      this.setState({ status: 'READY', progress: 100, filePath });
      return filePath;
    } catch (error) {
      logUpdateEvent('download-flow-failure', { error: describeUpdateError(error) });
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
      logUpdateEvent('install-flow-start', {
        updateType: manifest.updateType,
        versionCode: manifest.versionCode,
        versionName: manifest.versionName,
        filePath,
      });
      await verifyFileSha256(filePath, manifest.sha256!);
      logUpdateEvent('checksum-success', { filePath, phase: 'install' });
      if (manifest.updateType === 'WGT') await installWgt(filePath);
      else await installFullPackage(filePath);
      logUpdateEvent('install-flow-success', {
        updateType: manifest.updateType,
        versionCode: manifest.versionCode,
        versionName: manifest.versionName,
      });
      this.setState({ status: 'INSTALLED', progress: 100 });
    } catch (error) {
      logUpdateEvent('install-flow-failure', {
        updateType: manifest.updateType,
        versionCode: manifest.versionCode,
        versionName: manifest.versionName,
        filePath,
        error: describeUpdateError(error),
      });
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
      || !isValidDownloadUrl(manifest.downloadUrl) || !/^[a-fA-F0-9]{64}$/.test(manifest.sha256 || '')) {
    throw new MobileUpdateError('INVALID_MANIFEST', '更新信息不完整或格式异常');
  }
  const minSupportedVersionCode = manifest.minSupportedVersionCode;
  if (minSupportedVersionCode !== undefined
      && (!Number.isSafeInteger(minSupportedVersionCode) || minSupportedVersionCode < 1)) {
    throw new MobileUpdateError('INVALID_MANIFEST', '最低兼容APK版本信息异常');
  }
}

function isValidDownloadUrl(value?: string): boolean {
  const url = value?.trim();
  if (!url) return false;
  if (url.startsWith('/')) return !url.startsWith('//');
  return /^https?:\/\/[^/\s?#]+(?:[/?#][^\s]*)?$/i.test(url);
}

function installWgt(filePath: string): Promise<void> {
  if (typeof plus === 'undefined' || !plus.runtime) {
    return Promise.reject(new MobileUpdateError('INSTALL_UNSUPPORTED', '当前平台不支持WGT安装'));
  }

  return new Promise((resolve, reject) => {
    try {
      logUpdateEvent('wgt-install-start', { filePath });
      plus.runtime.install(
        filePath,
        { force: false },
        () => {
          logUpdateEvent('wgt-install-success', { filePath });
          resolve();
        },
        (error) => {
          logUpdateEvent('wgt-install-failure', { filePath, error: describeUpdateError(error) });
          reject(new MobileUpdateError('INSTALL_FAILED', getErrorMessage(error, 'WGT安装失败')));
        },
      );
    } catch (error) {
      logUpdateEvent('wgt-install-failure', { filePath, error: describeUpdateError(error) });
      reject(new MobileUpdateError('INSTALL_FAILED', getErrorMessage(error, 'WGT安装失败')));
    }
  });
}

function installFullPackage(filePath: string): Promise<void> {
  if (!supportsFullPackageInstall()) {
    return Promise.reject(new MobileUpdateError(
      'INSTALL_UNSUPPORTED',
      '当前平台不能在应用内安装完整包，请通过App Store或企业分发渠道更新',
    ));
  }

  return new Promise((resolve, reject) => {
    try {
      logUpdateEvent('full-install-start', { filePath });
      plus.runtime.install(
        filePath,
        { force: false },
        () => {
          logUpdateEvent('full-install-success', { filePath });
          resolve();
        },
        (error) => {
          logUpdateEvent('full-install-failure', { filePath, error: describeUpdateError(error) });
          reject(new MobileUpdateError('INSTALL_FAILED', getErrorMessage(error, '完整包安装失败')));
        },
      );
    } catch (error) {
      logUpdateEvent('full-install-failure', { filePath, error: describeUpdateError(error) });
      reject(new MobileUpdateError('INSTALL_FAILED', getErrorMessage(error, '完整包安装失败')));
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
    const origin = baseUrl.match(/^([a-z][a-z\d+.-]*:\/\/[^/?#]+)/i)?.[1];
    if (origin) return `${origin}${url}`;
    return url;
  }
  return `${baseUrl}/${url.replace(/^\/+/, '')}`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object') {
    const nativeError = error as { message?: unknown; errMsg?: unknown; code?: unknown };
    const message = nativeError.message ?? nativeError.errMsg;
    if (typeof message === 'string' && message) return message;
    if (typeof nativeError.code === 'string' || typeof nativeError.code === 'number') {
      return `${fallback}（错误码 ${nativeError.code}）`;
    }
  }
  return fallback;
}

function describeUpdateError(error: unknown): unknown {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  if (error && typeof error === 'object') {
    const nativeError = error as { code?: unknown; message?: unknown; errMsg?: unknown; stack?: unknown };
    return {
      code: nativeError.code,
      message: nativeError.message,
      errMsg: nativeError.errMsg,
      stack: nativeError.stack,
    };
  }
  return { value: error };
}

let memoryInstallLock = false;

export const updateClient = new MobileUpdateClient();

export {
  askUpdatePrompt,
  closeUpdatePrompt,
  finishUpdatePrompt,
  showUpdateProgress,
  updateProgress,
  updatePromptState,
} from './prompt';

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
