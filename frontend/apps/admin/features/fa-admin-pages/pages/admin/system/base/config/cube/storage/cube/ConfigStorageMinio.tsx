import React, { useContext, useEffect, useState } from 'react';
import { ApiEffectLayoutContext, FaUtils } from '@fa/ui';
import { Button, Form, Input } from 'antd';
import type { Admin } from '@/types';
import { configSysApi } from '@features/fa-admin-pages/services';
import { SaveOutlined } from '@ant-design/icons';
import { FaFormColSpace } from '@features/fa-admin-pages/components';

/**
 * @author xu.pengfei
 * @date 2024/10/08 11:33
 */
export default function ConfigStorageMinio() {
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
      <Form form={form} onFinish={onFinish} layout="horizontal" style={{ width: 700 }} labelCol={{ span: 4 }}>
        <Form.Item name="minioAk" label="access-key" rules={[{ required: true }]} extra="从Minio控制台Access Keys进行创建获取">
          <Input />
        </Form.Item>
        <Form.Item name="minioSk" label="secret-key" rules={[{ required: true }]} extra="从Minio控制台Access Keys进行创建获取">
          <Input />
        </Form.Item>
        <Form.Item name="minioEndPoint" label="end-point" rules={[{ required: true }]} extra="Minio接口地址，一般为：http://127.0.0.1:9000">
          <Input />
        </Form.Item>
        <Form.Item name="minioBucketName" label="bucket-name" rules={[{ required: true }]} extra="Minio Bucket桶名称，在Buckets中创建">
          <Input />
        </Form.Item>
        <Form.Item name="minioDomain" label="domain" rules={[{ required: true }]} extra="访问域名，注意“/”结尾，例如：http://minio.abc.com/abc/">
          <Input placeholder="访问域名，注意“/”结尾，例如：http://minio.abc.com/abc/" />
        </Form.Item>
        <Form.Item name="minioBasePath" label="base-path" rules={[{ required: true }]} extra="基础路径，注意“/”结尾，例如：prod/">
          <Input placeholder="基础路径" />
        </Form.Item>

        <FaFormColSpace offset={4}>
          <Button htmlType="submit" icon={<SaveOutlined />} type="primary" loading={loading}>
            保存
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </FaFormColSpace>
      </Form>
    </div>
  );
}
