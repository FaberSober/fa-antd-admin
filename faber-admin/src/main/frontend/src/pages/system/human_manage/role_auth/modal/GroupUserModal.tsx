import React, { useImperativeHandle, useRef, useState } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/admin/groupUser';
import Admin from '@/props/admin';
import UserSearchSelect from "@/pages/system/human_manage/user/helper/UserSearchSelect";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '字典值';

interface IProps extends DragModalProps {
  groupId: number;
  title?: string;
  record?: Admin.GroupUserVo;
  fetchFinish?: () => void;
}

/**
 * 角色用户实体新增、编辑弹框
 */
function GroupUserModal({ children, title, groupId, record, fetchFinish, ...props }: IProps, ref: any) {
  const formRef = useRef<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setModalVisible(true);
    },
  }));

  /** 新增Item */
  function invokeInsertTask(params: any) {
    setLoading(true);
    modelService
      .addUsers(groupId, params)
      .then((res) => {
        showResponse(res, `新增${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
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
      .update(params.groupId, params)
      .then((res) => {
        showResponse(res, `更新${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
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
        visible={modalVisible}
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
            description: get(record, 'description'),
          }}
        >
          {record === undefined && (
            <Form.Item name="userIds" label="选择用户" rules={[{ required: true }]} {...formItemFullLayout}>
              <UserSearchSelect mode="multiple" />
            </Form.Item>
          )}
          {record && (
            <Form.Item name="name" label="用户" rules={[{ required: true }]} {...formItemFullLayout}>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item name="description" label="描述" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}

export default React.forwardRef(GroupUserModal);
