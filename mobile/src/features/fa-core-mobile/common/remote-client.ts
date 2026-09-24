import { APP_CONFIG } from '@/app.config';
import { getToken } from '@features/fa-base-mobile/common/session';
import { getMobileTelemetryContext } from '@features/fa-core-mobile/telemetry/context';
import { appendClientDebugLog } from './debug-mode';

const HEARTBEAT_INTERVAL = 20_000;
const REGISTER_TYPE = 'RemoteClientRegister';
const REMOTE_LOG_TYPE = 'RemoteLog';
const REMOTE_LOG_CONTROL_TYPE = 'RemoteLogControl';
const CONSOLE_LEVELS = ['debug', 'log', 'info', 'warn', 'error'] as const;
const MAX_LOGS_PER_SECOND = 30;
const MAX_LOG_LENGTH = 4_000;

type ConsoleLevel = typeof CONSOLE_LEVELS[number];

type SocketTask = UniNamespace.SocketTask;

class RemoteClientConnection {
  private task?: SocketTask;
  private token?: string;
  private active = false;
  private socketConnected = false;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private heartbeatTimer?: ReturnType<typeof setInterval>;
  private retryCount = 0;
  private remoteLogSessionId?: string;
  private originalConsole = new Map<ConsoleLevel, Console[ConsoleLevel]>();
  private wrappedConsole = new Map<ConsoleLevel, Console[ConsoleLevel]>();
  private logWindowStartedAt = 0;
  private logWindowCount = 0;

  connect(): void {
    const token = getToken();
    if (!token) return;
    this.active = true;

    if (this.task && this.token === token) return;
    if (this.task) this.closeTask();
    this.token = token;
    if (this.reconnectTimer) return;
    this.open(token);
  }

  disconnect(): void {
    this.active = false;
    this.retryCount = 0;
    this.clearReconnect();
    this.stopRemoteLog();
    this.closeTask();
    this.token = undefined;
  }

  private open(token: string): void {
    const url = getWebSocketUrl(token);
    if (!url) return;

    try {
      const task = uni.connectSocket({ url, complete() {} });
      this.task = task;
      task.onOpen(() => {
        if (this.task !== task) return;
        this.socketConnected = true;
        this.retryCount = 0;
        this.send(task, {
          type: REGISTER_TYPE,
          data: buildRegistration(),
        });
        this.heartbeatTimer = setInterval(() => {
          if (this.task === task) this.send(task, 'ping');
        }, HEARTBEAT_INTERVAL);
      });
      task.onClose(() => this.handleClose(task));
      task.onError(() => this.handleClose(task));
      task.onMessage(({ data }) => this.handleServerMessage(task, data));
    } catch {
      this.scheduleReconnect();
    }
  }

  private send(task: SocketTask, message: unknown): void {
    try {
      task.send({ data: typeof message === 'string' ? message : JSON.stringify(message) });
    } catch {
      task.close({});
    }
  }

  private handleClose(task: SocketTask): void {
    if (this.task !== task) return;
    this.socketConnected = false;
    this.task = undefined;
    this.clearHeartbeat();
    this.stopRemoteLog();
    this.scheduleReconnect();
  }

  private closeTask(): void {
    const task = this.task;
    this.socketConnected = false;
    this.task = undefined;
    this.clearHeartbeat();
    this.stopRemoteLog();
    if (task) task.close({});
  }

  reportRuntimeError(source: string, error: unknown): void {
    const args = [source, error];
    this.sendRemoteLog('ERROR', args, 'runtime');
    appendClientDebugLog(`[ERROR] ${serializeRemoteLog(args)}`);
  }

  logConsole(level: ConsoleLevel, args: unknown[], mirrorToDebugConsole = false): void {
    const capturing = Boolean(this.remoteLogSessionId);
    const original = capturing ? this.originalConsole.get(level) : console[level];
    if (typeof original === 'function') {
      try {
        (original as (...values: unknown[]) => void).apply(console, args);
      } catch {
        // Logging must not interrupt application behavior.
      }
    }
    if (capturing) this.sendRemoteLog(level.toUpperCase(), args, 'console');
    if (mirrorToDebugConsole) appendClientDebugLog(`[${level.toUpperCase()}] ${serializeRemoteLog(args)}`);
  }

  getStatus() {
    return {
      connectionState: this.socketConnected
        ? 'connected'
        : this.reconnectTimer
          ? 'reconnecting'
          : this.task
            ? 'connecting'
            : 'disconnected',
      captureActive: Boolean(this.remoteLogSessionId),
      consoleHooks: this.remoteLogSessionId
        ? CONSOLE_LEVELS.filter(level => console[level] === this.wrappedConsole.get(level)).length
        : 0,
    } as const;
  }

  private handleServerMessage(task: SocketTask, raw: unknown): void {
    if (this.task !== task || typeof raw !== 'string') return;
    try {
      const message = JSON.parse(raw) as { type?: string; data?: { action?: string; sessionId?: string } };
      const { action, sessionId } = message.data ?? {};
      if (message.type !== REMOTE_LOG_CONTROL_TYPE || !sessionId || sessionId.length > 40) return;
      if (action === 'start') this.startRemoteLog(sessionId);
      if (action === 'stop' && this.remoteLogSessionId === sessionId) this.stopRemoteLog();
    } catch {
      // Ignore non-JSON or malformed server messages; the business socket stays available.
    }
  }

  private startRemoteLog(sessionId: string): void {
    if (this.remoteLogSessionId === sessionId) return;
    this.stopRemoteLog();
    this.remoteLogSessionId = sessionId;
    this.logWindowStartedAt = 0;
    this.logWindowCount = 0;
    for (const level of CONSOLE_LEVELS) {
      const original = console[level];
      if (typeof original !== 'function') {
        appendClientDebugLog(`[RemoteLog] console.${level} 不可用`);
        continue;
      }
      const wrapper = (...args: unknown[]) => {
        try {
          (original as (...values: unknown[]) => void).apply(console, args);
        } catch {
          // A failing Console implementation must not break application behavior.
        }
        this.sendRemoteLog(level.toUpperCase(), args, 'console');
      };
      this.originalConsole.set(level, console[level]);
      this.wrappedConsole.set(level, wrapper as Console[ConsoleLevel]);
      try {
        console[level] = wrapper as Console[typeof level];
        if (console[level] !== wrapper) appendClientDebugLog(`[RemoteLog] console.${level} 接管失败`);
      } catch {
        appendClientDebugLog(`[RemoteLog] console.${level} 接管失败`);
      }
    }
  }

  private stopRemoteLog(): void {
    this.remoteLogSessionId = undefined;
    for (const level of CONSOLE_LEVELS) {
      const original = this.originalConsole.get(level);
      const wrapper = this.wrappedConsole.get(level);
      if (original && console[level] === wrapper) console[level] = original as Console[typeof level];
    }
    this.originalConsole.clear();
    this.wrappedConsole.clear();
  }

  private sendRemoteLog(level: string, args: unknown[], source: 'console' | 'runtime'): void {
    const task = this.task;
    const sessionId = this.remoteLogSessionId;
    if (!task || !sessionId) return;

    const now = Date.now();
    if (now - this.logWindowStartedAt >= 1_000) {
      this.logWindowStartedAt = now;
      this.logWindowCount = 0;
    }
    if (++this.logWindowCount > MAX_LOGS_PER_SECOND) return;
    this.send(task, {
      type: REMOTE_LOG_TYPE,
      data: {
        action: 'entry',
        sessionId,
        level,
        source,
        message: serializeRemoteLog(args),
      },
    });
  }

  private scheduleReconnect(): void {
    if (!this.active || this.reconnectTimer) return;
    const delay = Math.min(30_000, 1_000 * (2 ** Math.min(this.retryCount, 5)));
    this.retryCount += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      if (this.active && this.token) this.open(this.token);
    }, delay);
  }

  private clearReconnect(): void {
    if (!this.reconnectTimer) return;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;
  }

  private clearHeartbeat(): void {
    if (!this.heartbeatTimer) return;
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = undefined;
  }
}

function serializeRemoteLog(args: unknown[]): string {
  const seen = new WeakSet<object>();
  let remaining = 100;
  const clean = (value: unknown, key = '', depth = 0): unknown => {
    if (/password|passwd|pwd|access_token|refresh_token|token|authorization|cookie|secret|credential|session|signature/i.test(key)) {
      return '[REDACTED]';
    }
    if (remaining-- <= 0) return '[truncated]';
    if (value == null || typeof value === 'boolean' || typeof value === 'number') return value;
    if (typeof value === 'string') return redactInlineSecrets(value).slice(0, 1_000);
    if (typeof value === 'bigint') return value.toString();
    if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
    if (typeof value === 'symbol') return value.toString();
    if (value instanceof Error) {
      return clean({ name: value.name, message: value.message, stack: value.stack }, '', depth + 1);
    }
    if (typeof value !== 'object') return String(value);
    if (seen.has(value)) return '[Circular]';
    if (depth >= 4) return '[MaxDepth]';
    seen.add(value);
    if (Array.isArray(value)) {
      return value.slice(0, 20).map((item) => clean(item, '', depth + 1));
    }
    try {
      return Object.fromEntries(Object.keys(value).slice(0, 20).map((childKey) => [
        childKey,
        clean((value as Record<string, unknown>)[childKey], childKey, depth + 1),
      ]));
    } catch {
      return '[unserializable]';
    }
  };

  try {
    const serialized = JSON.stringify(args.map((value) => clean(value))) ?? 'undefined';
    const truncation = '…[truncated]';
    return serialized.length <= MAX_LOG_LENGTH
      ? serialized
      : `${serialized.slice(0, MAX_LOG_LENGTH - truncation.length)}${truncation}`;
  } catch {
    return '[unserializable]';
  }
}

function redactInlineSecrets(value: string): string {
  return value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED]')
    .replace(/([?&](?:access_token|refresh_token|token|authorization|password|secret|signature)=)[^&#\s]*/gi, '$1[REDACTED]')
    .replace(/(["']?(?:password|passwd|pwd|access_token|refresh_token|token|authorization|cookie|secret|credential)["']?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^,;&}\]]+)/gi, '$1"[REDACTED]"');
}

function getWebSocketUrl(token: string): string | undefined {
  const apiUrl = APP_CONFIG.apiBaseUrl.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(apiUrl)) return undefined;

  const baseUrl = apiUrl.replace(/\/api$/i, '').replace(/^https:/i, 'wss:').replace(/^http:/i, 'ws:');
  return `${baseUrl}/api/websocket/base/${encodeURIComponent(token)}`;
}

function buildRegistration(): Record<string, unknown> {
  const context = getMobileTelemetryContext();
  return {
    clientType: 'MOBILE',
    runtime: 'APP-PLUS',
    appCode: APP_CONFIG.updateAppCode || undefined,
    appName: APP_CONFIG.name,
    release: APP_CONFIG.versionName,
    environment: APP_CONFIG.telemetryEnvironment,
    platform: context.platform,
    osName: context.osName,
    osVersion: context.osVersion,
    deviceModel: context.deviceModel,
  };
}

export const remoteClientConnection = new RemoteClientConnection();
