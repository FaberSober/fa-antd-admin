import React, { useContext, useRef, useState } from 'react';
import { WebSocketLayoutContext } from "@features/fa-admin-pages/layout/websocket";
import useBus from "use-bus";
import { Button, Input, Space } from "antd";
import { FaUtils } from "@fa/ui";


/**
 * @author xu.pengfei
 * @date 2024/11/16 20:00
 */
export default function WebSocketSimple() {
  const msgList = useRef<any[]>([]);

  const { sendMessage } = useContext(WebSocketLayoutContext);
  const [input, setInput] = useState<string>();

  useBus(
    ['@@ws/RECEIVE/test'],
    ({ type, payload }) => {
      console.log('@@ws/RECEIVE/test', type, payload)
      msgList.current.push({ type: 'system', msg: payload, time: FaUtils.getCurDateTime() });
    },
    [],
  )

  function handleSend() {
    const msg = input || ''
    msgList.current.push({ type: 'user', msg, time: FaUtils.getCurDateTime() });
    sendMessage({ type: 'test', data: { msg } });
    setInput('');
  }

  return (
    <div>
      <Space className="fa-mb12">
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={handleSend}>发送</Button>
      </Space>

      <div style={{height: 200}}>
        {msgList.current.map((m, i) => (
          <div key={`${m}-${i}`} className="fa-flex-row-center">
            <div style={{ color: '#F90', width: 150 }}>{m.time}</div>
            <div style={{ color: '#F90', width: 80 }}>{m.type} : </div>
            <div>{m.msg}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
