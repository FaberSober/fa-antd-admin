import React, { useRef, useMemo } from 'react';
import { useWebSocket } from 'ahooks';
import { ReadyState } from "ahooks/es/useWebSocket";
import { Button } from "antd";


/**
 * @author xu.pengfei
 * @date 2024/11/14 14:49
 */
export default function WebSocketBase({ token }: any) {
  const messageHistory = useRef<any[]>([]);

  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const { readyState, sendMessage, latestMessage, disconnect, connect } = useWebSocket(
    wsProtocol + '://' + window.location.host + `/api/websocket/test/${token}`,
  );

  messageHistory.current = useMemo(
    () => messageHistory.current.concat(latestMessage),
    [latestMessage],
  );

  return (
    <div>
      {/* send message */}
      <Button
        onClick={() => sendMessage && sendMessage(`${Date.now()}`)}
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ✉️ send
      </Button>
      {/* disconnect */}
      <Button
        onClick={() => disconnect && disconnect()}
        disabled={readyState !== ReadyState.Open}
        style={{ marginRight: 8 }}
      >
        ❌ disconnect
      </Button>
      {/* connect */}
      <Button onClick={() => connect && connect()} disabled={readyState === ReadyState.Open}>
        {readyState === ReadyState.Connecting ? 'connecting' : '📞 connect'}
      </Button>

      <div style={{ marginTop: 8 }}>readyState: {readyState}</div>

      <div style={{ marginTop: 8, height: 200, overflowY: 'auto' }}>
        <p>received message: </p>
        {messageHistory.current.map((message, index) => (
          <p key={index} style={{ wordWrap: 'break-word' }}>
            {message?.data}
          </p>
        ))}
      </div>
    </div>
  );
}
