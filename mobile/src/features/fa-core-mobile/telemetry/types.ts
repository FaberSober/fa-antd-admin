export type TelemetryEnvironment = 'development' | 'test' | 'staging' | 'production';

export type TelemetryEventType = 'LOGIN' | 'PAGE_VIEW' | 'ACTION' | 'BUSINESS';

export type TelemetryBreadcrumbType = 'APP' | 'PAGE' | 'HTTP' | 'BUSINESS' | 'ERROR' | 'CUSTOM';

export interface TelemetryContext {
  [key: string]: unknown;
  appName?: string;
  appVersion?: string;
  faFrom?: string;
  platform?: string;
  uniPlatform?: string;
  osName?: string;
  osVersion?: string;
  deviceModel?: string;
  route?: string;
}

export interface TelemetryUser {
  userId?: string;
  tenantId?: string;
}

export interface TelemetryBasePayload {
  appKey: string;
  clientType: 'MOBILE';
  environment: TelemetryEnvironment;
  release: string;
  sessionId: string;
  userId?: string;
  tenantId?: string;
  occurTime: string;
  context: TelemetryContext;
}

export interface TelemetryBreadcrumb {
  type: TelemetryBreadcrumbType;
  time: string;
  data?: Record<string, unknown>;
}

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

export interface TelemetryErrorPayload extends TelemetryBasePayload {
  errorType: string;
  message: string;
  stack?: string;
  breadcrumbs: TelemetryBreadcrumb[];
}

export interface TelemetryHttpInfo {
  method: string;
  path: string;
  status?: number;
  code?: number;
  duration?: number;
}
