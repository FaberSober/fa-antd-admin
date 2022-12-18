import React, {useContext, useEffect, useState} from 'react';
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import {Button, Col, Form, Input, Row, Space} from "antd";
import {UploadImgLocal} from "@/components/base-uploader";
import * as Admin from "@/props/admin";
import configSysApi from '@/services/admin/configSys'
import {SaveOutlined} from "@ant-design/icons";
import {showResponse} from "@/utils/utils";
import modelService from "@/services/admin/user";


/**
 * @author xu.pengfei
 * @date 2022/12/11 22:48
 */
export default function ConfigSystem() {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();
  const [configSys, setConfigSys] = useState<Admin.ConfigSys>()

  useEffect(() => {
    configSysApi.getOne().then(res => {
      setConfigSys(res.data);
      form.setFieldsValue({
        ...res.data.data
      })
    })
  }, []);

  function onFinish(v:any) {
    if (configSys === undefined) return;

    const params = {
      id: configSys.id,
      data: { ...configSys.data, ...v },
    }
    configSysApi.update(configSys.id, params).then(res => showResponse(res, '更新配置'))
  }

  function handleReset() {
    if (configSys === undefined) return;
    form.setFieldsValue({
      ...configSys.data
    })
  }

  const loading = loadingEffect[configSysApi.getUrl('update')]
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
        </Row>
        <Row gutter={12}>
          <Col md={8}>
            <Form.Item name="title" label="网站标题" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="subTitle" label="网站副标题" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="cop" label="版权信息" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Space>
          <Button htmlType="submit" icon={<SaveOutlined />} type="primary" loading={loading}>保存</Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Form>
    </div>
  )
}
