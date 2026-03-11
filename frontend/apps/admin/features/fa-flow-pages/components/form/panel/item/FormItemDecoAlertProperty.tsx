import { Form, Input, Select } from 'antd';
import React from 'react';

/**
 * @author xu.pengfei
 * @date 2026-01-26 16:11:00
 */
export default function FormItemDecoAlertProperty() {
  return (
    <div>
      <Form.Item name="content" label="提示内容" rules={[{ required: true }]}>
        <Input.TextArea rows={3} placeholder="请输入提示内容" />
      </Form.Item>

      <Form.Item name="decoAlertType" label="提示类型">
        <Select
          placeholder="选择提示类型"
          options={[
            { label: '成功', value: 'success' },
            { label: '信息', value: 'info' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' },
          ]}
        />
      </Form.Item>

      <Form.Item name="decoAlertShowIcon" label="显示图标" valuePropName="checked">
        <Select
          placeholder="是否显示图标"
          options={[
            { label: '显示', value: true },
            { label: '不显示', value: false },
          ]}
        />
      </Form.Item>

      <Form.Item name="decoAlertClosable" label="可关闭" valuePropName="checked">
        <Select
          placeholder="是否可关闭"
          options={[
            { label: '可关闭', value: true },
            { label: '不可关闭', value: false },
          ]}
        />
      </Form.Item>

      <Form.Item name="decoAlertBanner" label="顶部公告" valuePropName="checked">
        <Select
          placeholder="是否为顶部公告样式"
          options={[
            { label: '是', value: true },
            { label: '否', value: false },
          ]}
        />
      </Form.Item>

      <Form.Item name="decoAlertDescription" label="辅助描述">
        <Input.TextArea rows={2} placeholder="可选的辅助描述文字" />
      </Form.Item>
    </div>
  );
}
