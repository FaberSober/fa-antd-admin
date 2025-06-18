import React from 'react';
import {Card} from 'antd';
import SocketSimple from "./cube/socketIO/SocketSimple";
import SocketTask from "./cube/socketIO/SocketTask";
import SocketTaskCube from "./cube/socketIO/SocketTaskCube";


/**
 * @author xu.pengfei
 * @date 2022/12/6 13:55
 */
export default function SocketIOExample() {

  return (
    <div className="fa-full-content fa-bg-white fa-p12 fa-flex-column">
      <Card title="socket连接简单示例" className="fa-mb12">
        <SocketSimple/>
      </Card>

      <Card title="socket后端更新进度" className="fa-mb12">
        <SocketTask/>
      </Card>

      <Card title="socket后端更新进度-封装代码" className="fa-mb12">
        <SocketTaskCube />
      </Card>
    </div>
  );
}
