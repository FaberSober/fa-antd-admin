import { Flow } from '@features/fa-flow-pages/types';
import { Col, Row } from 'antd';
import React from 'react';
import FaFormEditorItem from './cube/FaFormEditorItem';

export interface FaFormDragLayoutProps {
  /** 表单布局 */
  items: Flow.FlowFormItem[];
  onChange?: (items: Flow.FlowFormItem[]) => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-27 20:47:30
 */
export default function FaFormDragLayout({ items, onChange }: FaFormDragLayoutProps) {
  return (
    <Row gutter={0} style={{ padding: 12, minHeight: 40 }}>
      {items.map((item) => {
        return (
          <Col key={item.id} span={item.md || 12} style={{ padding: 6 }}>
            <div style={{ border: '1px dashed #ccc', padding: 6 }}>
              <FaFormEditorItem formItem={item} />
            </div>
          </Col>
        )
      })}
    </Row>
  );
}