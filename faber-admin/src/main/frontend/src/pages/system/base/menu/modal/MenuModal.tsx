import React, {useContext, useEffect, useState} from 'react';
import {get} from 'lodash';
import {Form, Input, Radio} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {showResponse} from '@/utils/utils';
import {RES_CODE} from '@/configs/server.config';
import modelService from '@/services/admin/menu';
import Admin from '@/props/admin';
import MenuCascade from "@/pages/system/base/menu/helper/MenuCascade";
import MenuManageContext from "@/pages/system/base/menu/context/MenuManageContext";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '菜单';

interface IProps extends DragModalProps {
  parentId?: number;
  record?: Admin.Menu;
}

/**
 * 菜单实体新增、编辑弹框
 */
export default function MenuModal({ parentId, record, onCancel, ...props }: IProps) {
  const [form] = Form.useForm();
  const { viewBlock } = useContext(MenuManageContext)
  const [loading, setLoading] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    setLoading(true);
    modelService.add(params).then((res) => {
      showResponse(res, `新增${serviceName}`);
      if (res && res.status === RES_CODE.OK) {
        if (onCancel) {
          // @ts-ignore
          onCancel();
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    setLoading(true);
    modelService.update(params.id, params).then((res) => {
      showResponse(res, `更新${serviceName}`);
      if (res && res.status === RES_CODE.OK) {
        if (onCancel) {
          // @ts-ignore
          onCancel();
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      blockId: viewBlock?.id,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      parentId: get(record, 'parentId', parentId),
      title: get(record, 'title'),
      code: get(record, 'code'),
      type: get(record, 'type', 'menu'),
      description: get(record, 'description'),
    }
  }

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue(getInitialValues())
    }
  }, [props.visible])

  return (
    <DragModal onOk={() => form.submit()} confirmLoading={loading} width={700} onCancel={onCancel} {...props}>
      <Form form={form} onFinish={onFinish} initialValues={getInitialValues()}>
        <Form.Item name="parentId" label="上级菜单" rules={[{ required: true }]} {...formItemFullLayout}>
          <MenuCascade blockId={viewBlock!.id} />
        </Form.Item>
        <Form.Item name="title" label="菜单名称" rules={[{ required: true }]} {...formItemFullLayout}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="权限编码" rules={[{ required: true }]} {...formItemFullLayout}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="类型" rules={[{ required: true }]} {...formItemFullLayout}>
          <Radio.Group optionType="button" buttonStyle="solid" options={[{ label: '菜单', value: 'menu' }]} />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ required: false }]} {...formItemFullLayout}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </DragModal>
  );
}
