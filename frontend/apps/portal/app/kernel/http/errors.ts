export class PortalHttpError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'PortalHttpError';
    this.status = status;
    this.body = body;
  }
}

export class PortalRequestTimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`请求超过 ${timeoutMs}ms 未完成`);
    this.name = 'PortalRequestTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}
