import React, { useContext, useEffect, useState } from 'react';
import { ApiEffectLayoutContext, FaUtils, InputColor, UploadImgLocal } from '@fa/ui';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { configSysApi } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';

/**
 * @author xu.pengfei
 * @date 2022/12/11 22:48
 */
export default function ConfigSystem() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();
  const [configSys, setConfigSys] = useState<Admin.ConfigSys>();

  useEffect(() => {
    configSysApi.getOne().then((res) => {
      setConfigSys(res.data);
      form.setFieldsValue({
        ...res.data.data,
      });
    });
  }, []);

  function onFinish(v: any) {
    if (configSys === undefined) return;

    const params = {
      id: configSys.id,
      data: { ...configSys.data, ...v },
    };
    configSysApi.update(configSys.id, params).then((res) => FaUtils.showResponse(res, '更新配置'));
  }

  function handleReset() {
    if (configSys === undefined) return;
    form.setFieldsValue({
      ...configSys.data,
    });
  }

  const loading = loadingEffect[configSysApi.getUrl('update')];
  return (
    <div className="fa-p12">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={12}>
          <Col md={8}>
            <Form.Item name="logo" label="系统LOGO" rules={[{ required: true }]}>
              <UploadImgLocal />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="logoWithText" label="系统LOGO（带文字）" rules={[{ required: true }]}>
              <UploadImgLocal />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="loginBg" label="登录页面背景图" rules={[{ required: false }]}>
              <UploadImgLocal />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col md={7}>
            <Form.Item name="title" label="网站标题" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={1}>
            <Form.Item name="titleColor" rules={[{ required: true }]}>
              <InputColor style={{ width: 32, height: 32, marginTop: 30 }} />
            </Form.Item>
          </Col>

          <Col md={7}>
            <Form.Item name="subTitle" label="网站副标题" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={1}>
            <Form.Item name="subTitleColor" rules={[{ required: true }]}>
              <InputColor style={{ width: 32, height: 32, marginTop: 30 }} />
            </Form.Item>
          </Col>

          <Col md={7}>
            <Form.Item name="cop" label="版权信息" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={1}>
            <Form.Item name="copColor" rules={[{ required: true }]}>
              <InputColor style={{ width: 32, height: 32, marginTop: 30 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col md={8}>
            <Form.Item name="loginPageType" label="登录页面样式" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '默认', value: 'default' },
                  { label: '样式一', value: 'cute' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="topMenuBarStyle" label="顶部菜单条样式" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '默认(白色底)', value: 'default' },
                  { label: '主题色', value: 'color' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col md={8}>
            <Form.Item name="wxminiapp" label="微信小程序">
              <UploadImgLocal />
            </Form.Item>
          </Col>
        </Row>

        <Space>
          <Button htmlType="submit" icon={<SaveOutlined />} type="primary" loading={loading}>
            保存
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Form>
    </div>
  );
}
