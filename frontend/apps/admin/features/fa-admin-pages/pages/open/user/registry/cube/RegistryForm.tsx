import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldNumberOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Space } from 'antd';
import { trim } from 'lodash';
import { ApiEffectLayoutContext, Captcha, FaUtils } from '@fa/ui';
import { userApi } from '@features/fa-admin-pages/services';
import { Helmet } from 'react-helmet-async';
import ConfigLayoutContext from '@features/fa-admin-pages/layout/config/context/ConfigLayoutContext';

export default function RegistryForm() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { systemConfig } = useContext(ConfigLayoutContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [code, setCode] = useState('');

  function onFinish(fieldsValue: any) {
    userApi.registry(fieldsValue).then((res) => {
      FaUtils.showResponse(res, '注册账户');
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

  function validateUsername(_rule: any, value: any) {
    if (trim(value) === '') return Promise.resolve();
    return userApi.jumpCount({ username: value }).then((res) => {
      if (Number(res.data) === 0) {
        return Promise.resolve();
      }
      return Promise.reject('该账户已存在，请修改');
    });
  }

  function validateTel(_rule: any, value: any) {
    if (trim(value) === '') return Promise.resolve();
    return userApi.jumpCount({ tel: value }).then((res) => {
      if (Number(res.data) === 0) {
        return Promise.resolve();
      }
      return Promise.reject('该手机号已存在，请修改');
    });
  }

  if (!systemConfig.safeRegistrationOn) return <Empty description="暂未开启" />;

  const loading = loadingEffect[userApi.getUrl('registry')];
  return (
    <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off">
      <Helmet title={`重置密码 | ${systemConfig?.title}`} />

      <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号' }, { validator: validateUsername }]}>
        <Input size="large" prefix={<UserOutlined />} placeholder="请输入账号" />
      </Form.Item>
      <Form.Item label="手机号" name="tel" rules={[{ required: true, message: '请输入手机号' }, { validator: validateTel }, FaUtils.FormRules.PATTERN_TEL]}>
        <Input size="large" prefix={<UserOutlined />} placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item label="用户名" name="name" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input size="large" prefix={<UserOutlined />} placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password size="large" prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item label="密码确认" name="passwordConfirm" rules={[{ required: true }, { validator: validateNewPwdConfirm }]}>
        <Input.Password size="large" prefix={<LockOutlined />} type="password" placeholder="请再次输入密码" />
      </Form.Item>

      {systemConfig?.safeCaptchaOn && (
        <Form.Item label="验证码" name="captcha" rules={[{ required: true, message: '请输入验证码' }, { validator: validateCaptcha }]}>
          <Input size="large" prefix={<FieldNumberOutlined />} placeholder="请输入验证码" addonAfter={<Captcha onCodeChange={(c) => setCode(c)} />} />
        </Form.Item>
      )}
      <Button size="large" block loading={loading} type="primary" htmlType="submit">
        注册
      </Button>

      <Space className="fa-flex-row-center fa-mt12">
        <a href="/login">返回登录</a>
      </Space>
    </Form>
  );
}
