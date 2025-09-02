import React from 'react';
import useBus from "use-bus";
import { Button, notification, Space } from 'antd';
import { Flow } from '@features/fa-flow-pages/types';


/**
 * 处理Websocket接收的流程数据，包含以下业务逻辑：
 * 1. 接收type=FLOW_TASK_INFO的websocket消息，弹出Notification通知提醒框
 * @author xu.pengfei
 * @date 2025-09-02 20:15:15
 */
export default function FlowTaskCube() {

  useBus(
    ['@@ws/RECEIVE/FLOW_TASK_INFO'],
    ({ type, payload }) => {
      console.log('FlowTaskCube.received', type, payload)
      const data = payload as Flow.FaFlowTaskMsgVo;
      openNotification(data)
    },
    [],
  )

  const [api, contextHolder] = notification.useNotification();

  function openNotification(data: Flow.FaFlowTaskMsgVo) {
    api.open({
      message: data.title,
      description: data.title,
      showProgress: true,
      pauseOnHover: true,
    });
  };

  return (
    <>
      {contextHolder}
    </>
  );
}
