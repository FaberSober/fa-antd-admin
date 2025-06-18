import React, { useContext, useState } from 'react';
import { Button, Form } from 'antd';
import { ApiEffectLayoutContext, DragModal, type DragModalProps, FaUtils } from '@fa/ui';
import { userApi } from '@features/fa-admin-pages/services';
import RbacRoleSelect from '@features/fa-admin-pages/components/helper/RbacRoleSelect';

interface UsersChangeRoleModalProps extends DragModalProps {
  userIds: string[];
  fetchFinish?: () => void;
}

/**
 * 批量更新角色
 */
export default function UsersChangeRoleModal({ children, userIds, fetchFinish, ...props }: UsersChangeRoleModalProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    userApi.updateBatchRole({ userIds, roleIds: fieldsValue.roleIds }).then((res) => {
      FaUtils.showResponse(res, '批量更新角色');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  function showModal() {
    setOpen(true);
  }

  const loading = loadingEffect[userApi.getUrl('updateBatchRole')];
  return (
    <span>
      <span onClick={() => showModal()}>
        <Button>修改角色</Button>
      </span>
      <DragModal title="批量修改角色" open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="roleIds" label="角色" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <RbacRoleSelect mode="multiple" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
