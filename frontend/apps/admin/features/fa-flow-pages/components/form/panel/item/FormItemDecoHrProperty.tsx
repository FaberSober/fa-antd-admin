import { ColorPicker, Form, InputNumber, Select } from 'antd';
import React from 'react';

/**
 * @author xu.pengfei
 * @date 2026-01-26 16:07:00
 */
export default function FormItemDecoHrProperty() {
  return (
    <div>
      <Form.Item name="decoHrColor" label="分割线颜色" getValueFromEvent={(color) => color.toHexString()}>
        <ColorPicker showText format="hex" />
      </Form.Item>

      <Form.Item name="decoHrThickness" label="分割线粗细">
        <InputNumber min={1} max={10} placeholder="1" addonAfter="px" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="decoHrStyle" label="分割线样式">
        <Select
          placeholder="选择分割线样式"
          options={[
            { label: '实线', value: 'solid' },
            { label: '虚线', value: 'dashed' },
            { label: '点线', value: 'dotted' },
          ]}
        />
      </Form.Item>

      <Form.Item name="decoHrMarginTop" label="上边距">
        <InputNumber min={0} max={100} placeholder="16" addonAfter="px" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="decoHrMarginBottom" label="下边距">
        <InputNumber min={0} max={100} placeholder="16" addonAfter="px" style={{ width: '100%' }} />
      </Form.Item>
    </div>
  );
}
