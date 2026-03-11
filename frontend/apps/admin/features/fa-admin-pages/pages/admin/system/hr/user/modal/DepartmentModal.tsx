import type { Admin } from '@/types';
import { type CommonModalProps, DragModal, FaUtils, useApiLoading, UserSearchSelect } from '@fa/ui';
import DepartmentCascade from '@features/fa-admin-pages/components/helper/DepartmentCascade';
import { departmentApi as api } from '@features/fa-admin-pages/services';
import { Form, Input } from 'antd';
import { get } from 'lodash';
import { useEffect, useState } from 'react';

const serviceName = '部门';

interface DepartmentModalProps extends CommonModalProps<Admin.Department> {
  parentId?: number;
}

/**
 * 部门实体新增、编辑弹框
 */
export default function DepartmentModal({ children, parentId, title, record, fetchFinish, ...props }: DepartmentModalProps) {
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
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      name: get(record, 'name'),
      parentId: get(record, 'parentId', parentId),
      type: get(record, 'type'),
      managerId: get(record, 'managerId'),
      description: get(record, 'description'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  useEffect(() => {
    form.setFieldsValue(getInitialValues());
  }, [props.open]);

  const loading = useApiLoading([ api.getUrl('save'), api.getUrl('update')]);
  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal title={title} open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="parentId" label="上级部门" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <DepartmentCascade showRoot />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="managerId" label="负责人" {...FaUtils.formItemFullLayout}>
            <UserSearchSelect placeholder="请输入负责人姓名进行搜索" />
          </Form.Item>
          <Form.Item name="description" label="描述" {...FaUtils.formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
