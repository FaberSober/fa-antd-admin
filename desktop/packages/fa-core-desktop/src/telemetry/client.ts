import { getDesktopTelemetryContext } from "./context";
import { createTelemetrySessionId } from "./session";
import type {
  TelemetryBasePayload,
  TelemetryBreadcrumb,
  TelemetryErrorPayload,
  TelemetryEventPayload,
  TelemetryInitOptions,
  TelemetryTrackOptions,
  TelemetryUser,
} from "./types";

const MAX_CONTEXT_BYTES = 16 * 1024;
const MAX_ERROR_MESSAGE_LENGTH = 2_000;
const MAX_STACK_LENGTH = 32_768;
const MAX_BREADCRUMBS = 30;
const ERROR_COOLDOWN_MS = 30_000;
const ERROR_WINDOW_MS = 60_000;
const MAX_ERRORS_PER_WINDOW = 30;
const SENSITIVE_KEY_PATTERN = /password|token|authorization|cookie|secret|credential|api[-_]?key|prompt|file(content|contents)?/i;

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function sanitizeValue(value: unknown, seen = new WeakSet<object>(), depth = 0): unknown {
  if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number") {
    return typeof value === "string" ? truncate(value, 4_096) : value;
  }
  if (typeof value === "bigint") return String(value);
  if (typeof value !== "object" || depth > 6) return undefined;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitizeValue(item, seen, depth + 1));

  const record: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) continue;
    const sanitized = sanitizeValue(item, seen, depth + 1);
    if (sanitized !== undefined) record[key] = sanitized;
  }
  return record;
}

function sanitizeRecord(value: Record<string, unknown> | undefined): Record<string, unknown> {
  const sanitized = sanitizeValue(value);
  return sanitized && typeof sanitized === "object" && !Array.isArray(sanitized)
    ? (sanitized as Record<string, unknown>)
    : {};
}

function fitsLimit(value: unknown, maxBytes: number): boolean {
  try {
    return JSON.stringify(value).length <= maxBytes;
  } catch {
    return false;
  }
}

function normalizeError(error: unknown): { errorType: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      errorType: truncate(error.name || "Error", 128),
      message: truncate(error.message || error.name || "Unknown error", MAX_ERROR_MESSAGE_LENGTH),
      stack: error.stack ? truncate(error.stack, MAX_STACK_LENGTH) : undefined,
    };
  }

  return {
    errorType: "UnhandledRejection",
    message: truncate(typeof error === "string" ? error : String(error), MAX_ERROR_MESSAGE_LENGTH),
  };
}

function getErrorFingerprint(errorType: string, message: string, stack?: string): string {
  return `${errorType}:${message.replace(/\d+/g, "#")}:${(stack || "").split("\n").slice(0, 2).join("\n")}`;
}

function resolveTelemetryUrl(baseUrl: string | undefined, endpoint: "error" | "event"): string {
  const base = (baseUrl?.trim() || "/api").replace(/\/+$/, "");
  return `${base}/base/telemetry/open/${endpoint}`;
}

export class TelemetryClient {
  private options?: TelemetryInitOptions;
  private sessionId?: string;
  private user: TelemetryUser = {};
  private breadcrumbs: TelemetryBreadcrumb[] = [];
  private readonly errorTimes: number[] = [];
  private readonly errorFingerprints = new Map<string, number>();
  private globalHandlersInstalled = false;

  init(options: TelemetryInitOptions): void {
    if (!options.appKey.trim()) return;

    this.options = {
      ...options,
      appKey: options.appKey.trim(),
      release: options.release.trim() || "unknown",
    };
    this.sessionId = createTelemetrySessionId();
    this.user = {};
    this.breadcrumbs = [];
    this.addBreadcrumb("PAGE", { route: this.getCurrentRoute() });
    this.installGlobalErrorHandlers();
  }

  isInitialized(): boolean {
    return Boolean(this.options && this.sessionId);
  }

  getBasePayload(): TelemetryBasePayload {
    if (!this.options || !this.sessionId) {
      throw new Error("Telemetry 尚未初始化，请先调用 telemetry.init()");
    }

    const context = { ...getDesktopTelemetryContext(), ...this.options.context };
    return {
      appKey: this.options.appKey,
      clientType: this.options.clientType,
      environment: this.options.environment,
      release: this.options.release,
      sessionId: this.sessionId,
      ...this.user,
      occurTime: new Date().toISOString(),
      context: fitsLimit(context, MAX_CONTEXT_BYTES) ? sanitizeRecord(context) : { runtime: "desktop" },
    };
  }

  getRequestHeaders(): Record<string, string> {
    if (!this.options || !this.sessionId) return {};
    return {
      "X-Telemetry-App-Key": this.options.appKey,
      "X-Telemetry-Client-Type": this.options.clientType,
      "X-Telemetry-Environment": this.options.environment,
      "X-Telemetry-Release": this.options.release,
      "X-Telemetry-Session-Id": this.sessionId,
    };
  }

  identify(user: TelemetryUser): void {
    if (!this.isInitialized()) return;
    this.user = {
      userId: user.userId ? String(user.userId) : undefined,
      tenantId: user.tenantId ? String(user.tenantId) : undefined,
    };
  }

  clearUser(): void {
    this.user = {};
  }

  addBreadcrumb(type: TelemetryBreadcrumb["type"], data?: Record<string, unknown>): void {
    this.breadcrumbs = [
      ...this.breadcrumbs,
      { type, time: new Date().toISOString(), data: data ? sanitizeRecord(data) : undefined },
    ].slice(-MAX_BREADCRUMBS);
  }

  page(properties?: Record<string, unknown>): void {
    const route = properties?.route || this.getCurrentRoute();
    this.track("page.view", {
      eventType: "PAGE_VIEW",
      module: "desktop",
      properties: { route, ...properties },
    });
  }

  track(eventCode: string, options: TelemetryTrackOptions = {}): void {
    if (!this.isInitialized() || !/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(eventCode)) return;

    this.addBreadcrumb("BUSINESS", { eventCode, eventType: options.eventType || "ACTION" });
    const properties = options.properties ? sanitizeRecord(options.properties) : undefined;
    const payload: TelemetryEventPayload = {
      ...this.getBasePayload(),
      ...options,
      eventCode,
      eventType: options.eventType || "ACTION",
      properties: properties && fitsLimit(properties, MAX_CONTEXT_BYTES) ? properties : undefined,
    };
    void this.post("event", payload);
  }

  captureException(error: unknown, extraContext?: Record<string, unknown>): void {
    if (!this.isInitialized()) return;

    const normalized = normalizeError(error);
    const fingerprint = getErrorFingerprint(normalized.errorType, normalized.message, normalized.stack);
    const now = Date.now();
    const lastSent = this.errorFingerprints.get(fingerprint);
    while (this.errorTimes[0] !== undefined && this.errorTimes[0] <= now - ERROR_WINDOW_MS) this.errorTimes.shift();
    if ((lastSent !== undefined && now - lastSent < ERROR_COOLDOWN_MS) || this.errorTimes.length >= MAX_ERRORS_PER_WINDOW) return;

    this.errorFingerprints.set(fingerprint, now);
    this.errorTimes.push(now);
    this.addBreadcrumb("ERROR", { errorType: normalized.errorType, message: normalized.message });

    const payload: TelemetryErrorPayload = {
      ...this.getBasePayload(),
      errorType: normalized.errorType,
      message: normalized.message,
      stack: normalized.stack,
      breadcrumbs: fitsLimit(this.breadcrumbs, MAX_CONTEXT_BYTES)
        ? this.breadcrumbs
        : this.breadcrumbs.map(({ type, time }) => ({ type, time })),
    };
    if (extraContext) {
      const context = { ...payload.context, ...sanitizeRecord(extraContext) };
      payload.context = fitsLimit(context, MAX_CONTEXT_BYTES) ? context : payload.context;
    }
    void this.post("error", payload);
  }

  private getCurrentRoute(): string {
    return typeof window === "undefined" ? "desktop" : window.location.pathname || "desktop";
  }

  private installGlobalErrorHandlers(): void {
    if (this.globalHandlersInstalled || typeof window === "undefined") return;
    this.globalHandlersInstalled = true;
    window.addEventListener("error", (event: ErrorEvent) => {
      if (event.error) this.captureException(event.error);
    });
    window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
      this.captureException(event.reason);
    });
    window.addEventListener("popstate", () => {
      this.addBreadcrumb("NAVIGATION", { route: this.getCurrentRoute() });
    });
  }

  private async post(endpoint: "error" | "event", payload: TelemetryErrorPayload | TelemetryEventPayload): Promise<void> {
    if (typeof fetch === "undefined" || !this.options) return;
    try {
      await fetch(resolveTelemetryUrl(this.options.collectorBaseUrl, endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "omit",
        keepalive: true,
      });
    } catch {
      // 监控链路失败不能反向影响桌面客户端业务。
    }
  }
}
