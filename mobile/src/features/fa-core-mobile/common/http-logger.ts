import { APP_CONFIG } from '@/app.config';

const SENSITIVE_KEY_PATTERN = /password|passwd|pwd|token|authorization|secret|credential|captcha|verification|phone|mobile|email|idcard|signature/i;
const MAX_FIELD_LENGTH = 2_000;
const MAX_RECORD_LENGTH = 20_000;
const LOG_CHUNK_LENGTH = 2_500;

let requestSequence = 0;

export function logHttpRequestStart(method: string, url: string, body: unknown): number | undefined {
  if (!APP_CONFIG.httpLogEnabled) return undefined;
  const requestId = ++requestSequence;
  writeLog(requestId, 'request', { method, url: sanitizeUrl(url), body });
  return requestId;
}

export function logHttpResponse(
  requestId: number | undefined,
  statusCode: number,
  duration: number,
  body: unknown,
): void {
  if (requestId === undefined) return;
  writeLog(requestId, 'response', { statusCode, durationMs: duration, body });
}

export function logHttpFailure(
  requestId: number | undefined,
  duration: number,
  error: unknown,
): void {
  if (requestId === undefined) return;
  writeLog(requestId, 'failure', { durationMs: duration, error });
}

export function logUpdateEvent(stage: string, value: unknown): void {
  if (!APP_CONFIG.httpLogEnabled) return;
  const serialized = serializeLogValue(value);
  const limited = serialized.length > MAX_RECORD_LENGTH
    ? `${serialized.slice(0, MAX_RECORD_LENGTH)}...[truncated]`
    : serialized;
  console.log(`[FaMobile Update] ${stage} ${limited}`);
}

function writeLog(requestId: number, stage: string, value: unknown): void {
  const serialized = serializeLogValue(value);
  const limited = serialized.length > MAX_RECORD_LENGTH
    ? `${serialized.slice(0, MAX_RECORD_LENGTH)}...[truncated]`
    : serialized;
  const chunks = Math.ceil(limited.length / LOG_CHUNK_LENGTH);

  for (let index = 0; index < chunks; index += 1) {
    const part = limited.slice(index * LOG_CHUNK_LENGTH, (index + 1) * LOG_CHUNK_LENGTH);
    console.log(`[FaMobile HTTP #${requestId}] ${stage} ${index + 1}/${chunks} ${part}`);
  }
}

function serializeLogValue(value: unknown): string {
  try {
    return JSON.stringify(value, (key, item: unknown) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) return '[REDACTED]';
      if (typeof item === 'string' && /url$/i.test(key)) return sanitizeUrl(item);
      if (typeof item === 'string' && item.length > MAX_FIELD_LENGTH) {
        return `${item.slice(0, MAX_FIELD_LENGTH)}...[truncated]`;
      }
      return item;
    }) ?? 'undefined';
  } catch {
    return '[unserializable]';
  }
}

function sanitizeUrl(url: string): string {
  return url.replace(
    /([?&](?:access_token|token|authorization|password|secret|signature|sign)=)[^&#]*/gi,
    '$1[REDACTED]',
  );
}
