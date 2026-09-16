export type TelemetryClientType = "WEB" | "DESKTOP" | "MOBILE" | "OTHER";

export type TelemetryEnvironment = "development" | "test" | "staging" | "production";

export interface TelemetryUser {
  userId?: string;
  tenantId?: string;
}

export interface TelemetryContext {
  [key: string]: unknown;
}

export interface TelemetryDesktopContext extends TelemetryContext {
  platform?: string;
  osVersion?: string;
  arch?: string;
  appVersion?: string;
  tauriVersion?: string;
  runtime?: "desktop";
}

export interface TelemetryInitOptions {
  appKey: string;
  clientType: TelemetryClientType;
  environment: TelemetryEnvironment;
  release: string;
  /** API 根地址，例如 /api 或 https://example.com/api。 */
  collectorBaseUrl?: string;
  context?: TelemetryContext;
}

export interface TelemetryBasePayload {
  appKey: string;
  clientType: TelemetryClientType;
  environment: TelemetryEnvironment;
  release: string;
  sessionId: string;
  userId?: string;
  tenantId?: string;
  occurTime: string;
  context: TelemetryContext;
}

export type TelemetryBreadcrumbType = "PAGE" | "BUSINESS" | "CLICK" | "NAVIGATION" | "HTTP" | "CUSTOM" | "ERROR";

export interface TelemetryBreadcrumb {
  type: TelemetryBreadcrumbType;
  time: string;
  data?: Record<string, unknown>;
}

export interface TelemetryErrorPayload extends TelemetryBasePayload {
  errorType: string;
  message: string;
  stack?: string;
  breadcrumbs: TelemetryBreadcrumb[];
}

export type TelemetryEventType = "LOGIN" | "PAGE_VIEW" | "ACTION" | "BUSINESS";

export interface TelemetryEventPayload extends TelemetryBasePayload {
  eventType: TelemetryEventType;
  eventCode: string;
  module?: string;
  bizType?: string;
  bizId?: string;
  result?: string;
  duration?: number;
  properties?: Record<string, unknown>;
}

export interface TelemetryTrackOptions {
  eventType?: TelemetryEventType;
  module?: string;
  bizType?: string;
  bizId?: string;
  result?: string;
  duration?: number;
  properties?: Record<string, unknown>;
}
