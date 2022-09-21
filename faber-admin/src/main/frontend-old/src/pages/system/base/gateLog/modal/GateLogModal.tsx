import React, { useState } from 'react';
import { get } from 'lodash';
import { Form, Input, DatePicker } from 'antd';
import DragModal from '@/components/modal/DragModal';
import { getDateStr000, getInitialKeyTimeValue, showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import Ajax from "@/props/base/Ajax";
import modelService from '@/services/admin/gateLog';
import Admin from '@/props/admin';

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = 'BASE-URL请求日志';

/**
 * BASE-URL请求日志
 实体新增、编辑弹框
 */
export default function GateLogModal({ children, title, record, fetchFinish, ...props }: Ajax.CommonModalProps<Admin.GateLog>) {
  const [form] = Form.useForm();

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

  function getInitialValues() {
    return {
      url: get(record, 'url'),
      method: get(record, 'method'),
      agent: get(record, 'agent'),
      duration: get(record, 'duration'),
      pro: get(record, 'pro'),
      city: get(record, 'city'),
      addr: get(record, 'addr'),
      retStatus: get(record, 'retStatus'),
    }
  }

  function showModal() {
    setModalVisible(true)
    form.setFieldsValue(getInitialValues())
  }

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
          <Form.Item name="url" label="请求URL" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="method" label="请求类型" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="agent" label="访问客户端" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="duration" label="请求花费时间" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="pro" label="省" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="市" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="addr" label="地址" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="retStatus" label="返回码" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
