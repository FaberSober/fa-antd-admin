import React, { useRef, useState } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/admin/department';
import Admin from '@/props/admin';
import DepartmentCascade from "../helper/DepartmentCascade";
import UserSearchSelect from "../helper/UserSearchSelect";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '部门';

interface IProps extends DragModalProps {
  parentId?: number;
  title?: string;
  record?: Admin.Department;
  fetchFinish?: () => void;
}

/**
 * 部门实体新增、编辑弹框
 */
export default function DepartmentModal({ children, parentId, title, record, fetchFinish, ...props }: IProps) {
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
          if (fetchFinish) fetchFinish();
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
          if (fetchFinish) fetchFinish();
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
            name: get(record, 'name'),
            parentId: get(record, 'parentId', parentId),
            type: get(record, 'type'),
            managerId: get(record, 'managerId'),
            description: get(record, 'description'),
          }}
        >
          <Form.Item name="parentId" label="上级部门" rules={[{ required: true }]} {...formItemFullLayout}>
            <DepartmentCascade showRoot />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="managerId" label="负责人" {...formItemFullLayout}>
            <UserSearchSelect placeholder="请输入负责人姓名进行搜索" />
          </Form.Item>
          <Form.Item name="description" label="描述" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
