import { Flow } from '@/types';
import React from 'react';
import RowContainer from '../components/RowContainer';
import {
  DatePicker,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Radio,
  Checkbox,
  Cascader,
  TimePicker,
  Upload,
  ColorPicker,
  Rate,
  Slider,
  Button,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFileLocal, UploadImgLocal } from '@fa/ui';

export interface FaFormEditorItemProps {
  formItem: Flow.FlowFormItem;
  onClickRowItem?: (item: Flow.FlowFormItem) => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 09:49:58
 */
export default function FaFormEditorItem({ formItem, onClickRowItem }: FaFormEditorItemProps) {

  if (formItem.type === 'row') {
    return (<RowContainer row={formItem} onClickRowItem={onClickRowItem} />);
  }

  // 基础输入类组件
  if (formItem.type === 'input') {
    return (
      <Form.Item label={formItem.label || '输入框'} name={formItem.name}>
        <Input placeholder={formItem.placeholder} />
      </Form.Item>
    );
  }

  if (formItem.type === 'inputnumber') {
    return (
      <Form.Item label={formItem.label || '数字输入'} name={formItem.name}>
        <InputNumber style={{ width: '100%' }} placeholder={formItem.placeholder} />
      </Form.Item>
    );
  }

  if (formItem.type === 'textarea') {
    return (
      <Form.Item label={formItem.label || '文本域'} name={formItem.name}>
        <Input.TextArea rows={4} placeholder={formItem.placeholder} style={{ height: '100%', resize: 'none' }} />
      </Form.Item>
    );
  }

  // 选择类组件
  if (formItem.type === 'select') {
    return (
      <Form.Item label={formItem.label || '下拉选择'} name={formItem.name}>
        <Select placeholder={formItem.placeholder} />
      </Form.Item>
    );
  }

  if (formItem.type === 'cascader') {
    return (
      <Form.Item label={formItem.label || '级联选择'} name={formItem.name}>
        <Cascader placeholder={formItem.placeholder} />
      </Form.Item>
    );
  }

  if (formItem.type === 'checkbox') {
    return (
      <Form.Item label={formItem.label || '复选框'} name={formItem.name} valuePropName="checked">
        <Checkbox>{formItem.placeholder || '勾选'}</Checkbox>
      </Form.Item>
    );
  }

  if (formItem.type === 'radio') {
    return (
      <Form.Item label={formItem.label || '单选框'} name={formItem.name}>
        <Radio.Group />
      </Form.Item>
    );
  }

  // 日期时间类组件
  if (formItem.type === 'datepicker') {
    return (
      <Form.Item label={formItem.label || '日期选择'} name={formItem.name}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
    );
  }

  if (formItem.type === 'timepicker') {
    return (
      <Form.Item label={formItem.label || '时间选择'} name={formItem.name}>
        <TimePicker style={{ width: '100%' }} />
      </Form.Item>
    );
  }

  // 开关和评分
  if (formItem.type === 'switch') {
    return (
      <Form.Item label={formItem.label || '开关'} name={formItem.name} valuePropName="checked">
        <Switch />
      </Form.Item>
    );
  }

  if (formItem.type === 'rating') {
    return (
      <Form.Item label={formItem.label || '评分'} name={formItem.name}>
        <Rate />
      </Form.Item>
    );
  }

  // 滑块
  if (formItem.type === 'slider') {
    return (
      <Form.Item label={formItem.label || '滑块'} name={formItem.name}>
        <Slider style={{ width: '100%' }} />
      </Form.Item>
    );
  }

  // 颜色选择
  if (formItem.type === 'colorpicker') {
    return (
      <Form.Item label={formItem.label || '颜色选择'} name={formItem.name}>
        <ColorPicker showText />
      </Form.Item>
    );
  }

  // 文件上传
  if (formItem.type === 'fileupload') {
    return (
      <Form.Item label={formItem.label || '文件上传'} name={formItem.name}>
        <UploadFileLocal />
      </Form.Item>
    );
  }

  if (formItem.type === 'imageupload') {
    return (
      <Form.Item label={formItem.label || '图片上传'} name={formItem.name}>
        <UploadImgLocal />
      </Form.Item>
    );
  }

  // 富文本和链接 (placeholder，实际需要额外库)
  if (formItem.type === 'richtext') {
    return (
      <Form.Item label={formItem.label || '富文本'} name={formItem.name}>
        <Input.TextArea rows={6} placeholder={formItem.placeholder || '请输入富文本内容'} />
      </Form.Item>
    );
  }

  if (formItem.type === 'link') {
    return (
      <Form.Item label={formItem.label || '链接'} name={formItem.name}>
        <Input placeholder={formItem.placeholder || '请输入链接地址'} type="url" />
      </Form.Item>
    );
  }

  // 默认容器
  return (
    <div className='fa-flex-1'>

    </div>
  );
}
