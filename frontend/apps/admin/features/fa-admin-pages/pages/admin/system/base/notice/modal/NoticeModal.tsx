import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { type Admin, BaseBoolRadio, BaseTinyMCE, type CommonModalProps, DragModal, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { noticeApi as api } from '@features/fa-admin-pages/services';
import { Button, Form, Input } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';

const serviceName = '通知与公告';

/**
 * BASE-通知与公告实体新增、编辑弹框
 */
export default function NoticeModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.Notice>) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, `新增${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, `更新${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
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
      title: get(record, 'title'),
      content: get(record, 'content'),
      status: get(record, 'status'),
      forApp: get(record, 'forApp'),
      strongNotice: get(record, 'strongNotice'),
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
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseTinyMCE style={{ height: 500 }} />
          </Form.Item>
          <Form.Item name="status" label="是否有效" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="strongNotice" label="是否强提醒" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
