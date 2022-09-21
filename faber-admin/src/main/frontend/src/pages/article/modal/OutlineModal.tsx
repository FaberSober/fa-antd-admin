import React, { useContext, useRef, useState } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/article/outline';
import Article from '@/props/article';
import OutlineCascade from '@/pages/article/helper/OutlineCascade';
import { UploadImgQiniu } from '@/components/base-uploader';
import { BookEditContext } from '@/pages/article/BookEdit';

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '文章-大纲';

interface IProps extends DragModalProps {
  title?: string;
  record?: Article.Outline;
  fetchFinish?: () => void;
}

/**
 * 文章-大纲实体新增、编辑弹框
 */
export default function OutlineModal({ children, title, record, fetchFinish, ...props }: IProps) {
  const { bookId } = useContext(BookEditContext);

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
      bookId,
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
            parentId: get(record, 'parentId'),
            title: get(record, 'title'),
            icon: get(record, 'icon'),
          }}
        >
          <Form.Item name="parentId" label="父级节点" rules={[{ required: true }]} {...formItemFullLayout}>
            <OutlineCascade bookId={bookId} />
          </Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="图标" {...formItemFullLayout}>
            <UploadImgQiniu prefix="book/icon" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
