import React, { useContext, useEffect, useState } from 'react';
import { ApiEffectLayoutContext, FaUtils } from '@fa/ui';
import { Button, Form, Input } from 'antd';
import type { Admin } from '@/types';
import { configSysApi } from '@features/fa-admin-pages/services';
import { SaveOutlined } from '@ant-design/icons';
import { FaFormColSpace } from '@features/fa-admin-pages/components';

/**
 * @author xu.pengfei
 * @date 2024/10/08 16:33
 */
export default function ConfigStorageQiniu() {
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
        <Form.Item name="qiniuAk" label="access-key" rules={[{ required: true }]} extra="从qiniu控制台Access Keys进行创建获取">
          <Input />
        </Form.Item>
        <Form.Item name="qiniuSk" label="secret-key" rules={[{ required: true }]} extra="从qiniu控制台Access Keys进行创建获取">
          <Input />
        </Form.Item>
        <Form.Item name="qiniuBucketName" label="bucket-name" rules={[{ required: true }]} extra="qiniu Bucket桶名称，在Buckets中创建">
          <Input />
        </Form.Item>
        <Form.Item name="qiniuDomain" label="domain" rules={[{ required: true }]} extra="访问域名，注意“/”结尾，例如：http://qiniu.abc.com/abc/">
          <Input placeholder="访问域名，注意“/”结尾，例如：http://abc.hn-bkt.clouddn.com/" />
        </Form.Item>
        <Form.Item name="qiniuBasePath" label="base-path" rules={[{ required: true }]} extra="基础路径，注意“/”结尾，例如：prod/">
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
