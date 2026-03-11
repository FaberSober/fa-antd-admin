import { FieldNumberOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Captcha, FaUtils, useApiLoading } from '@fa/ui';
import ConfigLayoutContext from '@features/fa-admin-pages/layout/config/context/ConfigLayoutContext';
import { userApi } from '@features/fa-admin-pages/services';
import { Button, Form, Input, Space } from 'antd';
import { trim } from 'lodash';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgetPwdForm() {
  const { systemConfig } = useContext(ConfigLayoutContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [code, setCode] = useState('');

  function onFinish(fieldsValue: any) {
    userApi.forgetResetPwd(fieldsValue).then((res) => {
      FaUtils.showResponse(res, '重置密码');
      navigate('/login');
    });
  }

  function validateCaptcha(_: any, value: any) {
    if (value === undefined) {
      return Promise.resolve();
    }
    if (trim(value).toLowerCase() !== trim(code).toLowerCase()) {
      return Promise.reject('验证码输入错误');
    }
    return Promise.resolve();
  }

  function validateNewPwdConfirm(_rule: any, value: any) {
    const newPwd = form.getFieldValue('password');
    if (newPwd !== value) {
      return Promise.reject('两次输入密码不一致');
    }
    return Promise.resolve();
  }

  const loading = useApiLoading([userApi.getUrl('forgetResetPwd')]);
  return (
    <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off">
      <Form.Item label="账号" name="username" required={false} rules={[{ required: true, message: '请输入账号' }]}>
        <Input size="large" prefix={<UserOutlined />} placeholder="请输入账号" />
      </Form.Item>
      <Form.Item label="手机号" name="tel" required={false} rules={[{ required: true, message: '请输入手机号' }, FaUtils.FormRules.PATTERN_TEL]}>
        <Input size="large" prefix={<UserOutlined />} placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item label="密码" name="password" required={false} rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password size="large" prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item label="密码确认" name="passwordConfirm" required={false} rules={[{ required: true }, { validator: validateNewPwdConfirm }]}>
        <Input.Password size="large" prefix={<LockOutlined />} type="password" placeholder="请再次输入新密码" />
      </Form.Item>

      {systemConfig?.safeCaptchaOn && (
        <Form.Item label="验证码" required={false} name="captcha" rules={[{ required: true, message: '请输入验证码' }, { validator: validateCaptcha }]}>
          <Input size="large" prefix={<FieldNumberOutlined />} placeholder="请输入验证码" addonAfter={<Captcha onCodeChange={(c) => setCode(c)} />} />
        </Form.Item>
      )}
      <Button size="large" block loading={loading} type="primary" htmlType="submit">
        重置密码
      </Button>

      <Space className="fa-flex-row-center fa-mt12">
        <a href="/login">返回登录</a>
      </Space>
    </Form>
  );
}
