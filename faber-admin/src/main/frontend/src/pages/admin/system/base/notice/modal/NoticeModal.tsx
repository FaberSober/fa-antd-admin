import React, {useState} from 'react';
import {get} from 'lodash';
import {Form, Input} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {showResponse} from '@/utils/utils';
import {RES_CODE} from '@/configs/server.config';
import modelService from '@/services/admin/notice';
import Admin from '@/props/admin';
import {BaseBoolIntRadio} from '@/components/base-dict';
import {UploadImgLocal} from "@/components/base-uploader";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '通知与公告';

interface IProps extends DragModalProps {
  title?: string;
  record?: Admin.Notice;
  fetchFinish?: () => void;
}

/**
 * BASE-通知与公告实体新增、编辑弹框
 */
export default function NoticeModal({ children, title, record, fetchFinish, ...props }: IProps) {
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

  return (
    <span>
      <span onClick={() => setModalVisible(true)}>{children}</span>
      <DragModal
        title={title}
        open={modalVisible}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            title: get(record, 'title'),
            content: get(record, 'content'),
            url: get(record, 'url'),
            status: get(record, 'status'),
            forApp: get(record, 'forApp'),
            strongNotice: get(record, 'strongNotice'),
          }}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input.TextArea maxLength={255} />
          </Form.Item>
          <Form.Item name="url" label="图片" {...formItemFullLayout}>
            <UploadImgLocal prefix="notice/img" />
          </Form.Item>
          <Form.Item name="status" label="是否有效" rules={[{ required: true }]} {...formItemFullLayout}>
            <BaseBoolIntRadio />
          </Form.Item>
          <Form.Item name="strongNotice" label="是否强提醒" rules={[{ required: true }]} {...formItemFullLayout}>
            <BaseBoolIntRadio />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
