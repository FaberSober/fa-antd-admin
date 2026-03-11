import { DepartmentCascade, UserSearchSelect } from '@/components';
import { Flow, Flw } from '@/types';
import { UploadFileLocal, UploadImgLocal } from '@fa/ui';
import {
  Cascader,
  Checkbox,
  Col,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker
} from 'antd';
import { get } from 'lodash';
import { useMemo } from 'react';
import { FaFormItemsDecoratorTypes } from '../config';
import FaFormDragLayout from '../FaFormDragLayout';
import { useFaFormStore } from '../stores/useFaFormStore';
import FaFormItemDecoAlert from './item/FaFormItemDecoAlert';
import FaFormItemDecoHr from './item/FaFormItemDecoHr';
import FaFormItemDecoHref from './item/FaFormItemDecoHref';
import FaFormItemDecoText from './item/FaFormItemDecoText';
import FaFormShowLayout from '../../formShow/FaFormShowLayout';
import FaFormSubTable from './item/FaFormSubTable';

export interface FaFormEditorItemProps {
  formItem: Flow.FlowFormItem;
  flowNode?: Flw.Node;
  disabled?: boolean;
  /** 是否为展示模式 */
  showMode?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 09:49:58
 */
export default function FaFormEditorItem({ formItem, flowNode, disabled, showMode }: FaFormEditorItemProps) {

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
  // console.log('formItemConfig', formItem.name, flowNode, formItemConfig);

  const isShowComponent = FaFormItemsDecoratorTypes.includes(formItem.type);

  const viewable = isShowComponent || formItemConfig.view;
  const editable = !isShowComponent && formItemConfig.edit;
  const required = !isShowComponent && formItemConfig.required;

  if (!viewable) {
    return null;
  }

  if (formItem.type === 'high_subtable') {
    const updateFormItemChildren = useFaFormStore((state) => state.updateFormItemChildren);
    
    // 展示模式:使用 FaFormShowLayout
    if (showMode) {
      return (
        <Form.Item name={formItem.name}>
          <FaFormSubTable formItem={formItem} />
        </Form.Item>
      );
    }
    
    // 编辑模式:使用 FaFormDragLayout
    return (
      <Form.Item name={formItem.name}>
        <FaFormDragLayout
          parentId={formItem.id}
          items={formItem.children || []}
          onChange={(items) => {
            updateFormItemChildren(formItem.id, items);
          }}
          header={
            <Col md={24} style={{ padding: '0 6px' }}>
              <div className="text-sm font-medium">{formItem.label || '标签'}</div>
            </Col>
          }
          root={false}
          allowIn={false}
          allowOut={false}
        />
      </Form.Item>
    );
  }

  if (formItem.type === 'container_row') {
    const updateFormItemChildren = useFaFormStore((state) => state.updateFormItemChildren);
    
    // 展示模式:使用 FaFormShowLayout
    if (showMode) {
      return (
        <FaFormShowLayout
          items={formItem.children || []}
          flowNode={flowNode}
          disabled={disabled}
        />
      );
    }
    
    // 编辑模式:使用 FaFormDragLayout
    return (
      <FaFormDragLayout
        parentId={formItem.id}
        items={formItem.children || []}
        onChange={(items) => {
          updateFormItemChildren(formItem.id, items);
        }}
        header={
          <Col md={24} style={{ padding: '0 6px' }}>
            <div className="text-sm font-medium">{formItem.label || '标签'}</div>
          </Col>
        }
        root={false}
        allowIn={true}
        allowOut={true}
      />
    );
  }

  if (isShowComponent) {
    return (
      <div>
        {/* ------------------------------ 展示组件 ------------------------------ */}
        {formItem.type === 'deco_text' && (<FaFormItemDecoText formItem={formItem} />)}
        {formItem.type === 'deco_href' && (<FaFormItemDecoHref formItem={formItem} />)}
        {formItem.type === 'deco_hr' && (<FaFormItemDecoHr formItem={formItem} />)}
        {formItem.type === 'deco_alert' && (<FaFormItemDecoAlert formItem={formItem} />)}
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
