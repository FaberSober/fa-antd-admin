import type { Admin } from '@/types';
import { SaveOutlined } from '@ant-design/icons';
import { FaUtils, useApiLoading } from '@fa/ui';
import { FaFormColSpace } from '@features/fa-admin-pages/components';
import { configSysApi } from '@features/fa-admin-pages/services';
import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

/**
 * @author xu.pengfei
 * @date 2022/12/29 15:40
 */
export default function ConfigStorageLocal() {
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

  const loading = useApiLoading([configSysApi.getUrl('update')]);
  return (
    <div className="fa-p12">
      <Form form={form} onFinish={onFinish} layout="horizontal" style={{ width: 700 }} labelCol={{ span: 4 }}>
        <Form.Item name="storeLocalPath" label="本地存储路径" rules={[{ required: true }]}>
          <Input />
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
