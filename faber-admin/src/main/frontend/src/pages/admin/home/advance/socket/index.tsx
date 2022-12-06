import React, {useEffect, useState} from 'react';
import {Button, Input, Space} from "antd";
import {trim} from 'lodash'
import useSocketIO from "@/utils/hooks/useSocketIO";
import {getCurTime} from "@/utils/utils";
import {FaFlexRestLayout} from "@/components/base-layout";
import {useUpdate} from "ahooks";


interface Msg {
  time: string,
  msg: string,
}

function genMsg(msg?: string): Msg {
  return { time: getCurTime(), msg: trim(msg) }
}

const msgList:Msg[] = [];


/**
 * @author xu.pengfei
 * @date 2022/12/6 13:55
 */
export default function index() {
  const {ready, socketInstance, socketEmit} = useSocketIO({
    onConnect: () => addMsg('Client has connected to the server!'),
    onDisconnect: () => addMsg('The client has disconnected!'),
  })
  const update = useUpdate();

  const [input, setInput] = useState<string>()

  function addMsg(msg:string) {
    msgList.push(genMsg(msg))
    update();
  }

  useEffect(() => {
    if (!ready) return;

    socketInstance.on('connected', (data) => addMsg(data));
    socketInstance.on('chatevent', (data) => addMsg(data.userName + ': ' + data.message));
  }, [ready]);

  function handleSend() {
    socketEmit('chatevent', { userName: '用户1', message: input })
    setInput('')
  }

  return (
    <div className="fa-full-content fa-bg-white fa-p12 fa-flex-column">
      <Space className="fa-mb12">
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <Button onClick={handleSend}>发送</Button>
      </Space>

      <FaFlexRestLayout>
        {msgList.map(m => (
          <div key={m.time} className="fa-flex-row-center">
            <div style={{ color: '#F90', marginRight: 8 }}>{m.time}</div>
            <div>{m.msg}</div>
          </div>
        ))}
      </FaFlexRestLayout>
    </div>
  )
}
