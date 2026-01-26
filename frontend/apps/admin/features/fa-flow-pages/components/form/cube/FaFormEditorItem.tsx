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
import { get } from 'lodash';
import { FaFormItemsDecoratorTypes } from '../config';
import FaFormItemDecoText from './item/FaFormItemDecoText';

export interface FaFormEditorItemProps {
  formItem: Flow.FlowFormItem;
  onClickRowItem?: (item: Flow.FlowFormItem) => void;
  flowNode?: Flw.Node;
  disabled?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 09:49:58
 */
export default function FaFormEditorItem({ formItem, flowNode, onClickRowItem, disabled }: FaFormEditorItemProps) {

  const formItemConfig: Flw.NodeExtendConfigFormAuth = useMemo(() => {
    const defaultConfig = { view: true, edit: disabled ? false : true, required: disabled ? false : false };
    if (!flowNode) return defaultConfig;
    const formAuth = flowNode.extendConfig?.formAuth || {};
    const formItemAuth = formAuth[formItem.id || ''];
    if (!formItemAuth) return defaultConfig;
    return {
      view: get(formItemAuth, 'view', true),
      edit: disabled ? false : get(formItemAuth, 'edit', true),
      required: disabled ? false : get(formItemAuth, 'required', false),
    };
  }, [formItem, flowNode, disabled]);
  console.log('formItemConfig', formItem.name, flowNode, formItemConfig);

  const isShowComponent = FaFormItemsDecoratorTypes.includes(formItem.type);

  const viewable = isShowComponent || formItemConfig.view;
  const editable = !isShowComponent && formItemConfig.edit;
  const required = !isShowComponent && formItemConfig.required;

  if (!viewable) {
    return null;
  }

  if (formItem.type === 'row') {
    return (<RowContainer row={formItem} onClickRowItem={onClickRowItem} />);
  }

  if (isShowComponent) {
    return (
      <div>
        {/* ------------------------------ 展示组件 ------------------------------ */}
        <FaFormItemDecoText formItem={formItem} />
      </div>
    )
  }

  return (
    <div>
      <Form.Item label={formItem.label || '标签'} name={formItem.name} rules={[{ required }]}>
        {formItem.type === 'input' && (
          <Input disabled={!editable} placeholder={formItem.placeholder} />
        )}
        {/* 基础输入类组件 */}
        {formItem.type === 'inputnumber' && (
          <InputNumber disabled={!editable} style={{ width: '100%' }} placeholder={formItem.placeholder} />
        )}
        {formItem.type === 'textarea' && (
          <Input.TextArea disabled={!editable} rows={4} placeholder={formItem.placeholder} style={{ height: '100%', resize: 'none' }} />
        )}
        {/* 选择类组件 */}
        {formItem.type === 'select' && (
          <Select disabled={!editable} placeholder={formItem.placeholder} />
        )}
        {formItem.type === 'cascader' && (
          <Cascader disabled={!editable} placeholder={formItem.placeholder} />
        )}
        {formItem.type === 'checkbox' && (
          <Checkbox disabled={!editable}>{formItem.placeholder || '勾选'}</Checkbox>
        )}
        {formItem.type === 'radio' && (
          <Radio.Group disabled={!editable} />
        )}
        {/* 日期时间类组件 */}
        {formItem.type === 'datepicker' && (
          <DatePicker disabled={!editable} style={{ width: '100%' }} />
        )}
        {formItem.type === 'timepicker' && (
          <TimePicker disabled={!editable} style={{ width: '100%' }} />
        )}
        {/* 开关和评分 */}
        {formItem.type === 'switch' && (
          <Switch disabled={!editable} />
        )}
        {formItem.type === 'rating' && (
          <Rate disabled={!editable} />
        )}
        {/* 滑块 */}
        {formItem.type === 'slider' && (
          <Slider disabled={!editable} style={{ width: '100%' }} />
        )}
        {/* 颜色选择 */}
        {formItem.type === 'colorpicker' && (
          <ColorPicker disabled={!editable} showText />
        )}
        {/* 文件上传 */}
        {formItem.type === 'fileupload' && (
          <UploadFileLocal disabled={!editable} />
        )}
        {formItem.type === 'imageupload' && (
          <UploadImgLocal disabled={!editable} />
        )}
        {/* 富文本和链接 */}
        {formItem.type === 'richtext' && (
          <Input.TextArea disabled={!editable} rows={6} placeholder={formItem.placeholder || '请输入富文本内容'} />
        )}
        {formItem.type === 'link' && (
          <Input disabled={!editable} placeholder={formItem.placeholder || '请输入链接地址'} type="url" />
        )}

        {/* ------------------------------ 业务组件 ------------------------------ */}
        {formItem.type === 'biz_user_select' && (
          <UserSearchSelect disabled={!editable} placeholder={formItem.placeholder || '请选择用户'} />
        )}
        {formItem.type === 'biz_dept_select' && (
          <DepartmentCascade disabled={!editable} placeholder={formItem.placeholder || '请选择部门'} />
        )}
      </Form.Item>
    </div>
  );
}
