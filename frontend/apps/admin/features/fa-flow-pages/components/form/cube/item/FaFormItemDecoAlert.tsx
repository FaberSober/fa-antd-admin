import { Flow } from '@features/fa-flow-pages/types';
import { Alert } from 'antd';
import React from 'react';

export interface FaFormItemDecoAlertProps {
  formItem: Flow.FlowFormItem
}

/**
 * deco_alert提示信息展示
 * @author xu.pengfei
 * @date 2026-01-26 16:11:00
 */
export default function FaFormItemDecoAlert({ formItem }: FaFormItemDecoAlertProps) {
  // 如果没有内容，显示占位文本
  const message = formItem.content || '请输入提示内容';
  const type = formItem.decoAlertType || 'info';
  const showIcon = formItem.decoAlertShowIcon !== false; // 默认显示图标
  const closable = formItem.decoAlertClosable || false;
  const banner = formItem.decoAlertBanner || false;
  const description = formItem.decoAlertDescription;

  return (
    <Alert
      title={message}
      description={description}
      type={type}
      showIcon={showIcon}
      closable={closable}
      banner={banner}
    />
  );
}
