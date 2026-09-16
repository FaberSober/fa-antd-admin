import { MobileTelemetryClient } from './client';

export const telemetry = new MobileTelemetryClient();

export type {
  TelemetryBasePayload,
  TelemetryBreadcrumb,
  TelemetryBreadcrumbType,
  TelemetryContext,
  TelemetryErrorPayload,
  TelemetryEventPayload,
  TelemetryEventType,
  TelemetryEnvironment,
  TelemetryHttpInfo,
  TelemetryUser,
} from './types';
