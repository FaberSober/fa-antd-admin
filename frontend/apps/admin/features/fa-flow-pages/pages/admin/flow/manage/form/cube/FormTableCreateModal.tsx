import { flowFormApi as api } from '@/services';
import { Flow } from '@/types';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonModalProps, DragModal, DragModalProps, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { Button, Form, Input } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';


export interface FormTableCreateModalProps extends DragModalProps {
  fetchFinish?: (v: {tableName: string, comment: string}) => void;
  addBtn?: boolean;
  editBtn?: boolean;
}

/**
 * FLOW-流程表单实体新增、编辑弹框
 */
export default function FormTableCreateModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Flow.FlowForm>) {
  const loading = useApiLoading([ api.getUrl('createFormTable')]);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.createFormTable(params).then((res) => {
      FaUtils.showResponse(res, '新增数据表');
      setOpen(false);
      if (fetchFinish) fetchFinish(res.data);
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新数据表');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      config: {},
      // birthday: FaUtils.getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      tableName: get(record, 'tableName'),
      comment: get(record, 'comment'),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && <Button icon={<PlusOutlined />} type="primary">新建主表</Button>}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={800}
        {...props}
      >
        <Form form={form} onFinish={onFinish} {...FaUtils.formItemFullLayout}>
          <Form.Item name="tableName" label="表名" rules={[{ required: true }]} help="表名必须以ff_开头">
            <Input placeholder="请输入表名" />
          </Form.Item>
          <Form.Item name="comment" label="备注" rules={[{ required: true }]}>
            <Input placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
