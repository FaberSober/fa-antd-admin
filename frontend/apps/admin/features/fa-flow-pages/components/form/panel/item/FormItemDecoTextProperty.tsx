import { Checkbox, ColorPicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import React from 'react';

/**
 * @author xu.pengfei
 * @date 2026-01-26 14:55:00
 */
export default function FormItemDecoTextProperty() {
  return (
    <div>
      <Form.Item name="content" label="文本内容" rules={[{ required: true }]}>
        <Input.TextArea rows={3} placeholder="请输入文本内容" />
      </Form.Item>

      <Form.Item name="decoLineHeight" label="行高">
        <InputNumber min={1} max={10} step={0.1} placeholder="1.5" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="decoFontSize" label="字体大小">
        <InputNumber min={12} max={72} placeholder="14" addonAfter="px" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="decoTextAlign" label="对齐方式">
        <Radio.Group optionType="button" buttonStyle="solid">
          <Radio value="left">左对齐</Radio>
          <Radio value="center">居中</Radio>
          <Radio value="right">右对齐</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="decoColor" label="字体颜色" getValueFromEvent={(color) => color.toHexString()}>
        <ColorPicker showText format="hex" />
      </Form.Item>

      <Form.Item name="decoFontWeight" label="是否加粗" valuePropName="checked">
        <Checkbox>加粗</Checkbox>
      </Form.Item>

      <Form.Item name="decoFontStyle" label="是否斜体" valuePropName="checked">
        <Checkbox>斜体</Checkbox>
      </Form.Item>

      <Form.Item name="decoTextDecoration" label="下划线样式">
        <Select
          placeholder="选择下划线样式"
          allowClear
          options={[
            { label: '无', value: 'none' },
            { label: '下划线', value: 'underline' },
            { label: '删除线', value: 'line-through' },
            { label: '上划线', value: 'overline' },
          ]}
        />
      </Form.Item>
    </div>
  );
}
