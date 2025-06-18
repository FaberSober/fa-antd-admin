import React, { useContext } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { ApiEffectLayoutContext } from '@fa/ui';
import { userApi } from '@features/fa-admin-pages/services';
import * as FaSecurityUtils from '@features/fa-admin-pages/components/utils/FaSecurityUtils';
import ConfigLayoutContext from '@features/fa-admin-pages/layout/config/context/ConfigLayoutContext';
import UserLayoutContext from '@features/fa-admin-pages/layout/user/context/UserLayoutContext';

const formItemFullLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const tailLayout = { wrapperCol: { offset: 8, span: 16 } };

/**
 * @author xu.pengfei
 * @date 2020/12/26
 */
export default function AccountPwdUpdate() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { systemConfig } = useContext(ConfigLayoutContext);
  const { logout } = useContext(UserLayoutContext);
  const [form] = Form.useForm();

  function onFinish(fieldValues: any) {
    userApi.updateMyPwd(fieldValues).then(() => {
      message.info('更新密码成功，即将退出重新登录').then(logout);
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
      throw Promise.reject('两次输入密码不一致');
    }
    return Promise.resolve();
  }

  const loading = loadingEffect[userApi.getUrl('updateMyPwd')];
  return (
    <Card title="更新密码">
      <Form style={{ width: 600 }} form={form} onFinish={onFinish}>
        <Form.Item name="oldPwd" label="原密码" rules={[{ required: true }]} {...formItemFullLayout}>
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>
        <Form.Item name="newPwd" label="新密码" rules={[{ required: true }, { validator: validateNewPwd }]} {...formItemFullLayout}>
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item name="newPwdConfirm" label="新密码确认" rules={[{ required: true }, { validator: validateNewPwdConfirm }]} {...formItemFullLayout}>
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            更新密码
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
