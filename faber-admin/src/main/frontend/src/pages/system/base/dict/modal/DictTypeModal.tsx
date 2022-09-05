import React, { useRef, useState } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/admin/dictType';
import Admin from '@/props/admin';
import DictTypeCascade from "@/pages/system/base/dict/helper/DictTypeCascade";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

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
  const formRef = useRef<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    setLoading(true);
    modelService
      .add(params)
      .then((res) => {
        showResponse(res, `新增${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
          // @ts-ignore
          if (props.onCancel) props.onCancel();
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    setLoading(true);
    modelService
      .update(params.id, params)
      .then((res) => {
        showResponse(res, `更新${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
          // @ts-ignore
          if (props.onCancel) props.onCancel();
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  return (
    <span>
      <span onClick={() => setModalVisible(true)}>{children}</span>
      <DragModal
        title={title}
        open={modalVisible}
        onOk={() => formRef.current.submit()}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <Form
          ref={formRef}
          onFinish={onFinish}
          initialValues={{
            code: get(record, 'code'),
            name: get(record, 'name'),
            parentId: get(record, 'parentId', parentId),
            description: get(record, 'description'),
          }}
        >
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
