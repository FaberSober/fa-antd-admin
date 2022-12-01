import React, {useContext, useEffect, useRef, useState} from 'react';
import {get} from 'lodash';
import {Form, Input} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {showResponse, formItemFullLayout} from '@/utils/utils';
import modelService from '@/services/admin/dictType';
import Admin from '@/props/admin';
import DictTypeCascade from "../helper/DictTypeCascade";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";

const serviceName = '字典分类';

interface IProps extends DragModalProps {
  parentId?: number;
  title?: string;
  record?: Admin.DictType;
}

/**
 * 字典分类实体新增、编辑弹框
 */
export default function DictTypeModal({ children, parentId, title, record, ...props }: IProps) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    modelService.save(params).then((res) => {
      showResponse(res, `新增${serviceName}`);
      setModalVisible(false);
      // @ts-ignore
      if (props.onCancel) props.onCancel();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    modelService.update(params.id, params).then((res) => {
      showResponse(res, `更新${serviceName}`);
      setModalVisible(false);
      // @ts-ignore
      if (props.onCancel) props.onCancel();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      code: get(record, 'code'),
      name: get(record, 'name'),
      parentId: get(record, 'parentId', parentId),
      description: get(record, 'description'),
    }
  }

  function showModal() {
    setModalVisible(true)
    form.setFieldsValue(getInitialValues())
  }

  useEffect(() => {
    form.setFieldsValue(getInitialValues())
  }, [props.open])

  const loading = loadingEffect[modelService.getUrl('add')] || loadingEffect[modelService.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal
        title={title}
        open={modalVisible}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="parentId" label="上级节点" rules={[{ required: true }]} {...formItemFullLayout}>
            <DictTypeCascade />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="编码" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
