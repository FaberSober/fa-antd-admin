import type { Admin } from '@/types';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseTinyMCE, type CommonModalProps, DragModal, FaHref, FaUtils, UploadImgLocal, useApiLoading } from '@fa/ui';
import { sysNewsApi as api } from '@features/fa-admin-pages/services';
import { Button, DatePicker, Form, Input } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';

/**
 * BASE-系统-新闻实体新增、编辑弹框
 */
export default function SysNewsModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.SysNews>) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增系统新闻');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新系统新闻');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      pubTime: FaUtils.getDateFullStr(fieldsValue.pubTime),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      title: get(record, 'title'),
      content: get(record, 'content'),
      cover: get(record, 'cover'),
      author: get(record, 'author'),
      pubTime: FaUtils.getInitialKeyTimeValue(record, 'pubTime'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  const loading = useApiLoading([ api.getUrl('save'), api.getUrl('update')]);
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && (
          <Button icon={<PlusOutlined />} type="primary">
            新增
          </Button>
        )}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal title={title} open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={1000} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="title" label="标题" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item name="cover" label="封面" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <UploadImgLocal />
          </Form.Item>
          <Form.Item name="author" label="作者" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入作者" />
          </Form.Item>
          <Form.Item name="pubTime" label="发布时间" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <DatePicker showTime placeholder="请输入发布时间" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <BaseTinyMCE style={{ width: 812, height: 300 }} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
