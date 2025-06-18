import React, { useContext, useEffect, useState } from 'react';
import { ApiEffectLayoutContext, FaUtils } from '@fa/ui';
import { Button, Col, Form, InputNumber, Row, Select, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { configSysApi } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';

/**
 * @author xu.pengfei
 * @date 2025/05/30 11:20
 */
export default function ConfigLog() {
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
        <Row>
          <Col md={8}>
            <Form.Item name="logSaveLevel" label="日志保存级别" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '全部', value: 'all' },
                  { label: '记录请求URL(不记录请求内容与返回内容，节省日志空间)', value: 'simple' },
                  { label: '不记录', value: 'no' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <Form.Item name="logSaveMaxNum" label="日志保存最大数量" rules={[{ required: true }]} help="-1表示不限制记录数量">
              <InputNumber step={1} min={-1} max={100000} addonAfter="条" />
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
