import React, { useRef, useState } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/admin/group';
import Admin from '@/props/admin';
import GroupCascade from "@/pages/system/human_manage/role_auth/helper/GroupCascade";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '角色';

interface IProps extends DragModalProps {
  parentId?: number;
  record?: Admin.Group;
  extraParams: {
    groupType: number;
  };
}

/**
 * 角色实体新增、编辑弹框
 */
export default function GroupModal({ parentId, record, extraParams, onCancel, ...props }: IProps) {
  const formRef = useRef<any | null>(null);

  const [loading, setLoading] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    setLoading(true);
    modelService
      .add({ ...params, groupType: 1 })
      .then((res) => {
        showResponse(res, `新增${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          if (onCancel) {
            // @ts-ignore
            onCancel();
          }
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
          if (onCancel) {
            // @ts-ignore
            onCancel();
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      ...extraParams,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  return (
    <DragModal onOk={() => formRef.current.submit()} confirmLoading={loading} width={700} onCancel={onCancel} {...props}>
      <Form
        ref={formRef}
        onFinish={onFinish}
        initialValues={{
          parentId: get(record, 'parentId', parentId),
          name: get(record, 'name'),
          code: get(record, 'code'),
          description: get(record, 'description'),
        }}
      >
        <Form.Item name="parentId" label="上级角色" rules={[{ required: true }]} {...formItemFullLayout}>
          <GroupCascade extraParams={extraParams} />
        </Form.Item>
        <Form.Item name="name" label="角色名称" rules={[{ required: true }]} {...formItemFullLayout}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="权限编码" rules={[{ required: true }]} {...formItemFullLayout}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ required: false }]} {...formItemFullLayout}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </DragModal>
  );
}
