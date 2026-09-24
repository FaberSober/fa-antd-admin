import { APP_CONFIG } from '@/app.config';
import { getToken } from '@features/fa-base-mobile/common/session';
import { getMobileTelemetryContext } from '@features/fa-core-mobile/telemetry/context';

const HEARTBEAT_INTERVAL = 20_000;
const REGISTER_TYPE = 'RemoteClientRegister';

type SocketTask = UniNamespace.SocketTask;

class RemoteClientConnection {
  private task?: SocketTask;
  private token?: string;
  private active = false;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private heartbeatTimer?: ReturnType<typeof setInterval>;
  private retryCount = 0;

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
    this.task = undefined;
    this.clearHeartbeat();
    this.scheduleReconnect();
  }

  private closeTask(): void {
    const task = this.task;
    this.task = undefined;
    this.clearHeartbeat();
    if (task) task.close({});
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
