import React, { useRef, useState } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/article/book';
import Article from '@/props/article';
import { UploadImgQiniu } from '@/components/biz/base-uploader';

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '文章-书本';

interface IProps extends DragModalProps {
  title?: string;
  record?: Article.Book;
  fetchFinish?: () => void;
  bizType: Article.BookBizType;
}

/**
 * 文章-书本实体新增、编辑弹框
 */
export default function BookModal({ children, title, record, fetchFinish, bizType, ...props }: IProps) {
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
      bizType,
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
            cover: get(record, 'cover'),
            description: get(record, 'description'),
          }}
        >
          <Form.Item name="name" label="书名" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="cover" label="封面图" rules={[{ required: true }]} {...formItemFullLayout}>
            <UploadImgQiniu prefix="book/cover" />
          </Form.Item>
          <Form.Item name="description" label="描述" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
