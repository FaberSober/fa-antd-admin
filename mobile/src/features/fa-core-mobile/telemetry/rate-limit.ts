const ERROR_COOLDOWN_MS = 30_000;
const ERROR_WINDOW_MS = 60_000;
const ERROR_MAX_PER_WINDOW = 30;

export function getErrorFingerprint(errorType: string, message: string, stack?: string): string {
  const normalizedMessage = message.trim().replace(/\b\d+\b/g, '#').replace(/\s+/g, ' ');
  const firstFrame = stack?.split(/\r?\n/).find((line) => line.trim())?.trim() || '';
  return `${errorType}|${normalizedMessage}|${firstFrame}`;
}

export class TelemetryErrorRateLimiter {
  private readonly lastSentAt = new Map<string, number>();
  private readonly sentTimes: number[] = [];

  shouldSend(fingerprint: string, now = Date.now()): boolean {
    const lastSentAt = this.lastSentAt.get(fingerprint);
    if (lastSentAt !== undefined && now - lastSentAt < ERROR_COOLDOWN_MS) {
      return false;
    }

    while (this.sentTimes.length > 0 && now - this.sentTimes[0] >= ERROR_WINDOW_MS) {
      this.sentTimes.shift();
    }

    if (this.sentTimes.length >= ERROR_MAX_PER_WINDOW) {
      return false;
    }

    this.sentTimes.push(now);
    this.lastSentAt.set(fingerprint, now);
    return true;
  }
}
