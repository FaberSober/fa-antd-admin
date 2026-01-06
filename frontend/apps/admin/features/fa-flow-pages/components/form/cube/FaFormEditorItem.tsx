import { Flow, Flw } from '@/types';
import React, { useMemo } from 'react';
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
import { DepartmentCascade, UserSearchSelect } from '@/components';

export interface FaFormEditorItemProps {
  formItem: Flow.FlowFormItem;
  onClickRowItem?: (item: Flow.FlowFormItem) => void;
  flowNode?: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 09:49:58
 */
export default function FaFormEditorItem({ formItem, flowNode, onClickRowItem }: FaFormEditorItemProps) {

  // get if viewable
  const viewable = useMemo(() => {
    if (!flowNode) return true;
    return true;
  }, [formItem, flowNode]);

  // get if editable
  const editable = useMemo(() => {
    if (!flowNode) return true;
    return true;
  }, [formItem, flowNode]);

  if (!viewable) {
    return null;
  }

  if (formItem.type === 'row') {
    return (<RowContainer row={formItem} onClickRowItem={onClickRowItem} />);
  }

  return (
    <div>
      <Form.Item label={formItem.label || '标签'} name={formItem.name}>
        {formItem.type === 'input' && <Input placeholder={formItem.placeholder} />}
        {/* 基础输入类组件 */}
        {formItem.type === 'inputnumber' && (
          <InputNumber style={{ width: '100%' }} placeholder={formItem.placeholder} />
        )}
        {formItem.type === 'textarea' && (
          <Input.TextArea rows={4} placeholder={formItem.placeholder} style={{ height: '100%', resize: 'none' }} />
        )}
        {/* 选择类组件 */}
        {formItem.type === 'select' && (
          <Select placeholder={formItem.placeholder} />
        )}
        {formItem.type === 'cascader' && (
          <Cascader placeholder={formItem.placeholder} />
        )}
        {formItem.type === 'checkbox' && (
          <Checkbox>{formItem.placeholder || '勾选'}</Checkbox>
        )}
        {formItem.type === 'radio' && (
          <Radio.Group />
        )}
        {/* 日期时间类组件 */}
        {formItem.type === 'datepicker' && (
          <DatePicker style={{ width: '100%' }} />
        )}
        {formItem.type === 'timepicker' && (
          <TimePicker style={{ width: '100%' }} />
        )}
        {/* 开关和评分 */}
        {formItem.type === 'switch' && (
          <Switch />
        )}
        {formItem.type === 'rating' && (
          <Rate />
        )}
        {/* 滑块 */}
        {formItem.type === 'slider' && (
          <Slider style={{ width: '100%' }} />
        )}
        {/* 颜色选择 */}
        {formItem.type === 'colorpicker' && (
          <ColorPicker showText />
        )}
        {/* 文件上传 */}
        {formItem.type === 'fileupload' && (
          <UploadFileLocal />
        )}
        {formItem.type === 'imageupload' && (
          <UploadImgLocal />
        )}
        {/* 富文本和链接 */}
        {formItem.type === 'richtext' && (
          <Input.TextArea rows={6} placeholder={formItem.placeholder || '请输入富文本内容'} />
        )}
        {formItem.type === 'link' && (
          <Input placeholder={formItem.placeholder || '请输入链接地址'} type="url" />
        )}

        {/* ------------------------------ 业务组件 ------------------------------ */}
        {formItem.type === 'biz_user_select' && (
          <UserSearchSelect placeholder={formItem.placeholder || '请选择用户'} />
        )}
        {formItem.type === 'biz_dept_select' && (
          <DepartmentCascade placeholder={formItem.placeholder || '请选择部门'} />
        )}
      </Form.Item>
    </div>
  );
}
