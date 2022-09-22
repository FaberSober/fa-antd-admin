import React, {useContext, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {FieldNumberOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input} from 'antd';
import {trim} from 'lodash'
import {login} from '@/services/admin/auth';
import {setToken} from '@/utils/cache';
import {SITE_INFO} from '@/configs/server.config';
import {Captcha} from "@/components/base-field";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import styles from './login.module.less'

export default function Login() {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [code, setCode] = useState('');

  function onFinish(fieldsValue: any) {
    login(fieldsValue.username, fieldsValue.password).then((res) => {
      setToken(res.data);
      navigate(SITE_INFO.HOME_LINK);
    })
  }

  function validateCaptcha(rules: any, value: any) {
    if (value === undefined) {
      return Promise.resolve();
    }
    if (trim(value).toLowerCase() !== trim(code).toLowerCase()) {
      return Promise.reject('验证码输入错误');
    }
    return Promise.resolve();
  }

  const loading = loadingEffect['/api/auth/jwt/token']
  return (
    <div className={styles['main-container']}>
      <div className={styles['login-container']}>
        <h1 style={{ color: '#FFF' }}>{SITE_INFO.WEB_CONTEXT_TITLE}</h1>
        <span style={{ color: '#FFF', marginBottom: 24 }}>{SITE_INFO.WEB_CONTEXT_DESC_EN}</span>
        <div className={styles.main}>
          <div>
            <div className={styles.title}>用户登录</div>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
                <Input size="large" prefix={<UserOutlined />} placeholder="请输入账号" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password size="large" prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
              </Form.Item>
              <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }, { validator: validateCaptcha }]}>
                <Input size="large" prefix={<FieldNumberOutlined />} placeholder="请输入验证码" addonAfter={<Captcha onCodeChange={(c) => setCode(c)} />} />
              </Form.Item>
              <Button size="large" block loading={loading} className={styles.submit} type="primary" htmlType="submit">
                登录
              </Button>
            </Form>
          </div>
        </div>

        <div style={{ height: 150 }} />
      </div>
    </div>
  );
};
