import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {FieldNumberOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input} from 'antd';
import {trim} from 'lodash'
import {login} from '@/services/admin/auth';
import {setToken} from '@/utils/cache';
import {SITE_INFO} from '@/configs/server.config';
import {Captcha} from "@/components/base-field";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import styles from './login.module.less'
import * as Admin from "@/props/admin";
import configSysApi from "@/services/admin/configSys";


export default function Login() {
  const vantaRef = useRef<any>()
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [systemConfig, setSystemConfig] = useState<Admin.SystemConfigPo>();
  const [code, setCode] = useState('');

  useEffect(() => {
    // 获取系统配置参数
    configSysApi.getSystemConfig().then((res) => setSystemConfig(res.data))

    // 使用vanta制作背景效果图
    const vantaEffect = window.VANTA.WAVES({
      el: vantaRef.current,
      // THREE: THREE, // use a custom THREE when initializing
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      zoom: 0.79,
    })
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [])

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

  const loading = loadingEffect['/api/base/auth/login']
  return (
    <div ref={vantaRef} className={styles['main-container']}>
      <div className={styles.bannerDiv}>
        <div className={styles.bannerTitle}>{systemConfig?.title || '-'}</div>
        <div className={styles.bannerSubTitle}>{systemConfig?.subTitle || '-'}</div>
      </div>

      <div className={styles.loginContainer}>
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
  );
};
