import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { CommonModalProps, DragModal, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { storeBucketApi } from '@features/fa-disk-pages/services';
import { Disk } from '@features/fa-disk-pages/types';
import { Button, Form, Input } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';

/**
 * STORE-库实体新增、编辑弹框
 */
export default function StoreBucketModal({
  children,
  title,
  record,
  fetchFinish,
  addBtn,
  editBtn,
  onOpen,
  ...props
}: CommonModalProps<Disk.StoreBucket>) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...record,
      ...fieldsValue,
      // birthday: getDateStr000(fieldsValue.birthday),
    };
    storeBucketApi.saveOrUpdate(values).then((res) => {
      FaUtils.showResponse(res, '保存文件仓库信息');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  function getInitialValues() {
    return {
      name: get(record, 'name'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
    if (onOpen) onOpen();
  }

  const loading = useApiLoading([storeBucketApi.getUrl('saveOrUpdate')]);
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && (
          <Button icon={<PlusOutlined />} type="primary">
            新建
          </Button>
        )}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" label="库名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
