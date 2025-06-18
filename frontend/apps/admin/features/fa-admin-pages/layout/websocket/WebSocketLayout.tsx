import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type Fa, FaUtils, getToken } from '@fa/ui';
import WebSocketLayoutContext, { type WebSocketLayoutContextProps } from './context/WebSocketLayoutContext';
import { useInterval, useWebSocket } from 'ahooks';
import { ReadyState } from 'ahooks/lib/useWebSocket';
import { dispatch } from 'use-bus';

/**
 * websocket layout
 * @author xu.pengfei
 * @date 2024/11/14 16:49
 */
export default function WebSocketLayout({ children }: Fa.BaseChildProps) {
  const messageHistory = useRef<any[]>([]);

  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const { readyState, sendMessage, latestMessage, disconnect, connect } = useWebSocket(
    wsProtocol + '://' + window.location.host + `/api/websocket/base/${getToken()}`,
  );
  const [latestMessageObj, setLatestMessageObj] = useState<any>();

  messageHistory.current = useMemo(() => {
    // parse message
    try {
      const ret = FaUtils.tryParseJson(latestMessage?.data, {});
      setLatestMessageObj(ret);
      const { type, code, msg, data, timestamp } = ret;
      // send msg throw bus event
      dispatch({ type: `@@ws/RECEIVE/${type}`, payload: data, code, msg, timestamp });
    } catch (e) {
      console.error(e);
    }
    return messageHistory.current.concat(latestMessage);
  }, [latestMessage]);

  useEffect(() => {
    return () => disconnect();
  }, []);

  useInterval(() => {
    if (readyState === ReadyState.Closed) {
      connect();
    }
    // send heartbeat
    sendMsg('ping');
  }, 10000);

  function sendMsg(msg: string) {
    try {
      sendMessage(msg);
    } catch (e) {
      console.log('sendMessage error', e)
    }
  }

  const contextValue: WebSocketLayoutContextProps = {
    readyState,
    sendMessage: (msg: Record<any, any>) => sendMsg(JSON.stringify(msg)),
    latestMessage,
    latestMessageObj,
    messageHistory: messageHistory.current,
  };

  return <WebSocketLayoutContext.Provider value={contextValue}>{children}</WebSocketLayoutContext.Provider>;
}
