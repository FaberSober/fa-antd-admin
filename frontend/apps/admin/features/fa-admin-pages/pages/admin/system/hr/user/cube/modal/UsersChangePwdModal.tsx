import React, { useContext, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { ApiEffectLayoutContext, DragModal, type DragModalProps, FaUtils } from '@fa/ui';
import { userApi } from '@features/fa-admin-pages/services';
import { ConfigLayoutContext } from '@features/fa-admin-pages/layout';
import * as FaSecurityUtils from '@features/fa-admin-pages/components/utils/FaSecurityUtils';

interface UsersChangePwdModalProps extends DragModalProps {
  userIds: string[];
  fetchFinish?: () => void;
}

/**
 * 批量修改密码
 */
export default function UsersChangePwdModal({ children, userIds, fetchFinish, ...props }: UsersChangePwdModalProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { systemConfig } = useContext(ConfigLayoutContext);

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    userApi.updateBatchPwd({ userIds, newPwd: fieldsValue.newPwd, passwordCheck: fieldsValue.passwordCheck }).then((res) => {
      FaUtils.showResponse(res, '批量修改密码');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  function validateNewPwd(_rule: any, value: any) {
    form.setFieldsValue({ newPwdConfirm: undefined });
    const oldPwd = form.getFieldValue('oldPwd');
    if (oldPwd === value) {
      return Promise.reject('新旧密码不能一样');
    }

    return FaSecurityUtils.validatePasswordSafeRule(value, systemConfig);
  }

  function validateNewPwdConfirm(_rule: any, value: any) {
    const newPwd = form.getFieldValue('newPwd');
    if (newPwd !== value) {
      throw new Error('两次输入密码不一致');
    }
    return Promise.resolve();
  }

  function showModal() {
    setOpen(true);
  }

  const loading = loadingEffect[userApi.getUrl('updateBatchPwd')];
  return (
    <span>
      <span onClick={() => showModal()}>
        <Button>修改密码</Button>
      </span>
      <DragModal title="批量修改密码" open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="passwordCheck" label="本账户密码" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input.Password placeholder="请输入本账户密码，即自己的登录密码" />
          </Form.Item>
          <Form.Item name="newPwd" label="新密码" rules={[{ required: true }, { validator: validateNewPwd }]} {...FaUtils.formItemFullLayout}>
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item name="newPwdConfirm" label="新密码确认" rules={[{ required: true }, { validator: validateNewPwdConfirm }]} {...FaUtils.formItemFullLayout}>
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
