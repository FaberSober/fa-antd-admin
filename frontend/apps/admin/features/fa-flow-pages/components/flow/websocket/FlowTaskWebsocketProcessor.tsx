import React from 'react';
import useBus, {dispatch} from "use-bus";
import { Button, notification, Space } from 'antd';
import { Flow } from '@features/fa-flow-pages/types';


/**
 * 处理Websocket接收的流程数据，接收type=FLOW_TASK_INFO的websocket消息，包含以下业务逻辑：
 * 1. 弹出Notification通知提醒框；
 * 2. 使用bus通知刷新任务数量；
 * @author xu.pengfei
 * @date 2025-09-02 20:15:15
 */
export default function FlowTaskWebsocketProcessor() {

  useBus(
    ['@@ws/RECEIVE/FLOW_TASK_INFO'],
    ({ type, payload }) => {
      console.log('FlowTaskCube.received', type, payload)
      const data = payload as Flow.FaFlowTaskMsgVo;
      // 弹出Notification通知提醒框
      openNotification(data)
      // 使用bus通知刷新任务数量；
      dispatch({ type: '@@api/FLOW/REFRESH_TASK_COUNT', payload })
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
