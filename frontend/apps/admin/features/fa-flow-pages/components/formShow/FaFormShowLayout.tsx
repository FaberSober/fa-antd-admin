import { Flow, Flw } from '@/types';
import { Col, Row } from 'antd';
import React from 'react';
import FaFormEditorItem from '../form/cube/FaFormEditorItem';

export interface FaFormShowLayoutProps {
  /** 表单项列表 */
  items: Flow.FlowFormItem[];
  /** 流程节点 */
  flowNode?: Flw.Node;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 表单展示布局组件 - 纯渲染,无拖拽功能
 * @author xu.pengfei
 * @date 2026-01-28
 */
export default function FaFormShowLayout({ items, flowNode, disabled }: FaFormShowLayoutProps) {
  
  // 递归渲染表单项
  const renderFormItem = (item: Flow.FlowFormItem) => {
    return (
      <Col key={item.id} span={item.md || 12}>
        <div>
          <FaFormEditorItem formItem={item} flowNode={flowNode} disabled={disabled} showMode={true} />
        </div>
      </Col>
    );
  };

  return (
    <Row gutter={0}>
      {items.length === 0 ? (
        <div
          style={{
            width: '100%',
            minHeight: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
          }}
        >
          暂无表单项
        </div>
      ) : (
        items.map((item) => renderFormItem(item))
      )}
    </Row>
  );
}
