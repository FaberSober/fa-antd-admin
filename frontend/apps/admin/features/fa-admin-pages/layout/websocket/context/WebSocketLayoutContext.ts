import { createContext } from 'react';
import { ReadyState } from 'ahooks/es/useWebSocket';

export interface WebSocketLayoutContextProps {
  readyState: ReadyState;
  latestMessage?: WebSocketEventMap['message'];
  latestMessageObj?: any;
  sendMessage: (msg: { type: string; data: Record<any, any> | string }) => void; // 发送websocket信息的方法
  messageHistory: any[];
}

const WebSocketLayoutContext = createContext<WebSocketLayoutContextProps>({
  readyState: ReadyState.Closed,
  sendMessage: () => {},
  messageHistory: [],
});

export default WebSocketLayoutContext;
