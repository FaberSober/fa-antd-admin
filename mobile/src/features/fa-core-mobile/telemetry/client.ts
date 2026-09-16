import { APP_CONFIG } from '@/app.config';
import { TelemetryBreadcrumbBuffer } from './breadcrumb';
import { getMobileTelemetryContext } from './context';
import { getErrorFingerprint, TelemetryErrorRateLimiter } from './rate-limit';
import { createTelemetrySessionId } from './session';
import type {
  TelemetryBasePayload,
  TelemetryContext,
  TelemetryErrorPayload,
  TelemetryEventPayload,
  TelemetryEventType,
  TelemetryHttpInfo,
  TelemetryUser,
} from './types';

const EVENT_CODE_PATTERN = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/;

export class MobileTelemetryClient {
  private sessionId?: string;
  private context: TelemetryContext = {};
  private user: TelemetryUser = {};
  private currentRoute?: string;
  private globalHandlersInstalled = false;
  private readonly breadcrumbs = new TelemetryBreadcrumbBuffer();
  private readonly errorRateLimiter = new TelemetryErrorRateLimiter();

  init(): void {
    if (this.sessionId || !APP_CONFIG.telemetryAppKey) return;

    this.sessionId = createTelemetrySessionId();
    this.context = getMobileTelemetryContext();
    this.breadcrumbs.add('APP', { action: 'init' });
    this.installGlobalErrorHandlers();
  }

  isInitialized(): boolean {
    return Boolean(this.sessionId && APP_CONFIG.telemetryAppKey);
  }

  getBasePayload(): TelemetryBasePayload {
    if (!this.isInitialized() || !this.sessionId) {
      throw new Error('Mobile Telemetry 尚未初始化');
    }

    return {
      appKey: APP_CONFIG.telemetryAppKey,
      clientType: 'MOBILE',
      environment: APP_CONFIG.telemetryEnvironment,
      release: APP_CONFIG.versionName,
      sessionId: this.sessionId,
      ...this.user,
      occurTime: new Date().toISOString(),
      context: { ...this.context, ...(this.currentRoute ? { route: this.currentRoute } : {}) },
    };
  }

  getRequestHeaders(): Record<string, string> {
    if (!this.isInitialized() || !this.sessionId) return {};

    return {
      'X-Telemetry-App-Key': APP_CONFIG.telemetryAppKey,
      'X-Telemetry-Client-Type': 'MOBILE',
      'X-Telemetry-Environment': APP_CONFIG.telemetryEnvironment,
      'X-Telemetry-Release': APP_CONFIG.versionName,
      'X-Telemetry-Session-Id': this.sessionId,
    };
  }

  identify(user: TelemetryUser): void {
    if (this.isInitialized()) this.user = { ...user };
  }

  clearUser(): void {
    this.user = {};
  }

  page(route: string, properties: Record<string, unknown> = {}): void {
    if (!this.isInitialized()) return;

    const safeRoute = sanitizePath(route);
    this.currentRoute = safeRoute;
    this.breadcrumbs.add('PAGE', { route: safeRoute });
    this.track('mobile.page.view', {
      eventType: 'PAGE_VIEW',
      module: getRouteModule(safeRoute),
      properties: { ...properties, route: safeRoute },
    });
  }

  track(
    eventCode: string,
    options: Omit<Partial<TelemetryEventPayload>, keyof TelemetryBasePayload | 'eventCode'> & { eventType?: TelemetryEventType } = {},
  ): void {
    if (!this.isInitialized() || !EVENT_CODE_PATTERN.test(eventCode)) return;

    this.breadcrumbs.add('BUSINESS', { eventCode, eventType: options.eventType || 'ACTION' });
    const payload: TelemetryEventPayload = {
      ...this.getBasePayload(),
      ...options,
      eventCode,
      eventType: options.eventType || 'ACTION',
    };
    this.post('/base/telemetry/open/event', payload);
  }

  captureException(error: unknown, extraContext: Record<string, unknown> = {}): void {
    if (!this.isInitialized()) return;

    const normalized = normalizeError(error);
    const fingerprint = getErrorFingerprint(normalized.errorType, normalized.message, normalized.stack);
    if (!this.errorRateLimiter.shouldSend(fingerprint)) return;

    this.breadcrumbs.add('ERROR', {
      errorType: normalized.errorType,
      message: normalized.message,
    });

    const basePayload = this.getBasePayload();
    const payload: TelemetryErrorPayload = {
      ...basePayload,
      errorType: normalized.errorType.slice(0, 128),
      message: normalized.message.slice(0, 2_000),
      stack: normalized.stack?.slice(0, 32_768),
      breadcrumbs: this.breadcrumbs.snapshot(),
      context: { ...basePayload.context, ...extraContext },
    };
    this.post('/base/telemetry/open/error', payload);
  }

  recordHttp(info: TelemetryHttpInfo, error?: unknown): void {
    if (!this.isInitialized()) return;

    const data = {
      method: info.method,
      path: sanitizePath(info.path),
      status: info.status,
      code: info.code,
      duration: info.duration,
    };
    this.breadcrumbs.add('HTTP', data);

    if (error && (info.status === 0 || info.status === undefined || info.status >= 500)) {
      this.captureException(error, { source: 'http', ...data });
    }
  }

  private installGlobalErrorHandlers(): void {
    if (this.globalHandlersInstalled || typeof window === 'undefined') return;
    this.globalHandlersInstalled = true;

    window.addEventListener('error', (event: ErrorEvent) => {
      if (event.error) this.captureException(event.error, { source: 'window.error' });
    });
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.captureException(event.reason, { source: 'window.unhandledrejection' });
    });
  }

  private post(path: string, payload: TelemetryEventPayload | TelemetryErrorPayload): void {
    const baseUrl = APP_CONFIG.apiBaseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    try {
      uni.request({
        url: `${baseUrl}${normalizedPath}`,
        method: 'POST',
        data: payload,
        header: { 'Content-Type': 'application/json' },
        timeout: 5_000,
        fail: () => {
          // Telemetry 链路失败不能反向影响业务页面。
        },
      });
    } catch {
      // Telemetry 链路失败不能反向影响业务页面。
    }
  }
}

function sanitizePath(path: string): string {
  return path.split(/[?#]/, 1)[0] || '/';
}

function getRouteModule(route: string): string | undefined {
  const parts = route.split('/').filter(Boolean);
  const featureIndex = parts.indexOf('features');
  return featureIndex >= 0 ? parts[featureIndex + 1] : undefined;
}

function normalizeError(error: unknown): { errorType: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return { errorType: error.name || 'Error', message: error.message || error.name, stack: error.stack };
  }

  if (typeof error === 'string') {
    return { errorType: 'UnhandledError', message: error };
  }

  if (error && typeof error === 'object') {
    const value = error as Record<string, unknown>;
    if (value.reason && value.reason !== error) return normalizeError(value.reason);
    const message = typeof value.message === 'string'
      ? value.message
      : typeof value.errMsg === 'string'
        ? value.errMsg
        : safeString(error);
    return {
      errorType: typeof value.name === 'string' ? value.name : 'UniError',
      message,
      stack: typeof value.stack === 'string' ? value.stack : undefined,
    };
  }

  return { errorType: 'UnhandledError', message: String(error) };
}

function safeString(value: unknown): string {
  try {
    return JSON.stringify(value) || String(value);
  } catch {
    return String(value);
  }
}
