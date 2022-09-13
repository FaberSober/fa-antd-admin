import React, { useState } from 'react';
import { get } from 'lodash';
import {Form, Input, DatePicker, Descriptions, Drawer} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import { getDateStr000, getInitialKeyTimeValue, showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import Ajax from "@/props/base/Ajax";
import modelService from '@/services/admin/gateLog';
import Admin from '@/props/admin';



export interface GateLogDrawerProps extends DragModalProps {
  record: Admin.GateLog;
}

/**
 * BASE-URL请求日志
 实体新增、编辑弹框
 */
export default function GateLogDrawer({ children, record, ...props }: GateLogDrawerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <span>
      <span onClick={() => setModalVisible(true)}>{children}</span>
      <Drawer
        title="查看请求详情"
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <Descriptions bordered column={1} labelStyle={{ width: 120 }}>
          <Descriptions.Item label="URL">{record.url}</Descriptions.Item>
          <Descriptions.Item label="Method">{record.method}</Descriptions.Item>
          <Descriptions.Item label="User-Agent">{record.agent}</Descriptions.Item>
          <Descriptions.Item label="请求花费时间">{record.duration}ms</Descriptions.Item>
          <Descriptions.Item label="省">{record.pro}</Descriptions.Item>
          <Descriptions.Item label="市">{record.city}</Descriptions.Item>
          <Descriptions.Item label="地址">{record.addr}</Descriptions.Item>
          <Descriptions.Item label="返回码">{record.retStatus}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </span>
  )
}
