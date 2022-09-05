import React, {useEffect, useState} from 'react';
import {get} from 'lodash';
import {Form, Input} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {showResponse} from '@/utils/utils';
import {RES_CODE} from '@/configs/server.config';
import modelService from '@/services/admin/menuBlock';
import Admin from '@/props/admin';

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '菜单模块';

interface IProps extends DragModalProps {
  title?: string;
  record?: Admin.MenuBlock;
  fetchFinish?: () => void;
}

/**
 * 权限实体新增、编辑弹框
 */
export default function MenuBlockModal({ children, title, record, fetchFinish, ...props }: IProps, ref: any) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    setLoading(true);
    modelService.add(params).then((res) => {
        showResponse(res, `新增${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
          if (fetchFinish) fetchFinish();
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
          setModalVisible(false);
          if (fetchFinish) fetchFinish();
        }
        setLoading(false);
      }).catch(() => setLoading(false));
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

  const initialValues = {
    name: get(record, 'name'),
    no: get(record, 'no'),
    sort: get(record, 'sort'),
  };

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue(initialValues);
    }
  }, [props.visible])

  function showModal() {
    setModalVisible(true);
    form.setFieldsValue(initialValues);
  }

  return (
    <span>
      <span onClick={() => showModal()}>{children}</span>
      <DragModal
        title={title}
        open={modalVisible}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <>
          {(modalVisible || props.visible) && (
            <Form form={form} onFinish={onFinish} initialValues={initialValues}>
              <Form.Item name="name" label="名称" rules={[{ required: true, max: 6 }]} {...formItemFullLayout}>
                <Input />
              </Form.Item>
              <Form.Item name="no" label="编码" rules={[{ required: false, max: 10 }]} {...formItemFullLayout}>
                <Input />
              </Form.Item>
              <Form.Item name="sort" label="排序" rules={[{ required: true }]} {...formItemFullLayout}>
                <Input type="number" />
              </Form.Item>
            </Form>
          )}
        </>
      </DragModal>
    </span>
  );
}
