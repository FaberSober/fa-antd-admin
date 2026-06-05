import type { Rbac } from '@/types';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseBoolRadio, type CommonModalProps, DragModal, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { rbacRoleApi as api } from '@features/fa-admin-pages/services';
import { Button, Form, Input, Select } from 'antd';
import { get } from 'lodash';
import { useContext, useState } from 'react';
import UserLayoutContext from '@features/fa-admin-pages/layout/user/context/UserLayoutContext';

const serviceName = '';

const ROLE_TYPE_OPTIONS = [
  { value: 1, label: '全局超管' },
  { value: 2, label: '全局' },
  { value: 3, label: '租户' },
];

/**
 * BASE-角色表实体新增、编辑弹框
 */
export default function RbacRoleModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Rbac.RbacRole>) {
  const [form] = Form.useForm();
  const { user, selectedTenant } = useContext(UserLayoutContext);

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
    const type = user.superAdmin ? fieldsValue.type : fieldsValue.type || 3;
    const values = {
      ...fieldsValue,
      type,
      tenantId: type === 3 ? record?.tenantId || selectedTenant?.tenantId : undefined,
      // birthday: getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    const type = get(record, 'type') ?? (record ? (String(get(record, 'id')) === '1' ? 1 : get(record, 'tenantId') ? 3 : 2) : 3);
    return {
      name: get(record, 'name'),
      remarks: get(record, 'remarks'),
      status: get(record, 'status', true),
      type,
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
      <DragModal title={title} open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" label="角色名称" rules={[{ required: true }, { max: 10 }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="remarks" label="角色描述" rules={[{ required: true }, { max: 100 }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="是否启用" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Select options={user.superAdmin ? ROLE_TYPE_OPTIONS : ROLE_TYPE_OPTIONS.filter((item) => item.value !== 1)} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
