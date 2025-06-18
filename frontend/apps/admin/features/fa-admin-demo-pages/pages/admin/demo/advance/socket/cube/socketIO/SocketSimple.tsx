import React, {useEffect, useState} from 'react';
import {useSocketIO} from "@features/fa-admin-pages/hooks";
import {useUpdate} from "ahooks";
import {Button, Input, Space} from "antd";
import {FaUtils} from "@fa/ui";
import {trim} from "lodash";



interface Msg {
  time: string;
  msg: string;
}

function genMsg(msg?: string): Msg {
  return { time: FaUtils.getCurTime(), msg: trim(msg) };
}

const msgList: Msg[] = [];

/**
 * @author xu.pengfei
 * @date 2023/5/29 11:31
 */
export default function SocketSimple() {
  const { ready, socketInstance, socketEmit } = useSocketIO({
    onConnect: () => addMsg('Client has connected to the server!'),
    onDisconnect: () => addMsg('The client has disconnected!'),
  });
  const update = useUpdate();

  const [input, setInput] = useState<string>();

  function addMsg(msg: string) {
    msgList.push(genMsg(msg));
    update();
  }

  useEffect(() => {
    if (!ready) return;

    socketInstance.on('connected', (data: any) => addMsg(data));
    socketInstance.on('chatevent', (data: any) => addMsg(data.userName + ': ' + data.message));
  }, [ready]);

  function handleSend() {
    addMsg(input || '');
    socketEmit('chatevent', { userName: '用户1', message: input });
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
            <div style={{ color: '#F90', width: 90 }}>{m.time}</div>
            <div>{m.msg}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
