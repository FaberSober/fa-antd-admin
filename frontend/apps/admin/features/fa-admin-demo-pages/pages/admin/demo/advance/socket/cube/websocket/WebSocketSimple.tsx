import { FaUtils } from "@fa/ui";
import { sendMessage } from '@features/fa-admin-pages/layout/websocket';
import { Button, Input, Space } from "antd";
import { useState } from 'react';
import useBus from "use-bus";


/**
 * @author xu.pengfei
 * @date 2024/11/16 20:00
 */
export default function WebSocketSimple() {
  const [msgList, setMsgList] = useState<any[]>([]);
  const [input, setInput] = useState<string>();

  useBus(
    ['@@ws/RECEIVE/test'],
    ({ type, payload }) => {
      console.log('@@ws/RECEIVE/test', type, payload)
      setMsgList(prev => [...prev, { type: 'system', msg: payload, time: FaUtils.getCurDateTime() }]);
    },
    [],
  )

  function handleSend() {
    const msg = input || ''
    setMsgList(prev => [...prev, { type: 'user', msg, time: FaUtils.getCurDateTime() }]);
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
        {msgList.map((m, i) => (
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
