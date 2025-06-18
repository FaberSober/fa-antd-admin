import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldNumberOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { trim } from 'lodash';
import { ApiEffectLayoutContext, Captcha, LoginMode, setLoginMode, setToken, useQs } from '@fa/ui';
import { authApi } from '@features/fa-admin-pages/services';
import { SITE_INFO } from '@/configs';
import { Helmet } from 'react-helmet-async';
import { ConfigLayoutContext } from '@features/fa-admin-pages/layout/config/context/ConfigLayoutContext';

export default function LoginForm() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { systemConfig } = useContext(ConfigLayoutContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const search: any = useQs();

  const [code, setCode] = useState('');

  function onFinish(fieldsValue: any) {
    authApi.login(fieldsValue.username, fieldsValue.password).then((res) => {
      setToken(res.data.tokenValue);
      setLoginMode(LoginMode.LOCAL);
      if (search.redirect) {
        navigate(search.redirect);
      } else {
        navigate(SITE_INFO.HOME_LINK);
      }
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

  const loading = loadingEffect[authApi.getUrl('login')];
  return (
    <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off" initialValues={{ remember: true }}>
      <Helmet title={`登录 | ${systemConfig.title}`} />

      <Form.Item name="username" label="账号" required={false} rules={[{ required: true, message: '请输入账号' }]}>
        <Input size="large" prefix={<UserOutlined />} placeholder="请输入账号" />
      </Form.Item>

      <Form.Item name="password" label="密码" required={false} rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password size="large" prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
      </Form.Item>
      {systemConfig.safeCaptchaOn && (
        <Form.Item name="captcha" label="验证码" required={false} rules={[{ required: true, message: '请输入验证码' }, { validator: validateCaptcha }]}>
          <Input size="large" prefix={<FieldNumberOutlined />} placeholder="请输入验证码" addonAfter={<Captcha onCodeChange={(c) => setCode(c)} />} />
        </Form.Item>
      )}

      <div className="fa-login-cute-main-btn fa-flex-row-center fa-mb12">
        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>
        <div className="fa-flex-1" />
        {systemConfig.safeRegistrationOn && <a href="/open/user/registry">注册账户</a>}
        <a href="/open/user/forgetPwd" className="fa-ml12">
          忘记密码？
        </a>
      </div>

      <Button size="large" block loading={loading} type="primary" htmlType="submit">
        登录
      </Button>
    </Form>
  );
}
