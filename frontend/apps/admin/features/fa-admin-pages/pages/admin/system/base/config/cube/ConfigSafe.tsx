import type { Admin } from '@/types';
import { SaveOutlined } from '@ant-design/icons';
import { BaseBoolRadio, DictEnumApiSelector, FaUtils, useApiLoading } from '@fa/ui';
import { configSysApi } from '@features/fa-admin-pages/services';
import { Button, Col, Form, InputNumber, Row, Space } from 'antd';
import { useEffect, useState } from 'react';

/**
 * @author xu.pengfei
 * @date 2022/12/11 22:48
 */
export default function ConfigSafe() {
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

  function validateSafePasswordLen() {
    const safePasswordLenMin = form.getFieldValue('safePasswordLenMin');
    const safePasswordLenMax = form.getFieldValue('safePasswordLenMax');
    if (safePasswordLenMin > safePasswordLenMax) {
      return Promise.reject('密码最大长度要大于最小长度');
    }
    return Promise.resolve();
  }

  const loading = useApiLoading([configSysApi.getUrl('update')]);
  return (
    <div className="fa-p12">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={12}>
          <Col md={8}>
            <Form.Item name="safeCaptchaOn" label="是否开启验证码" rules={[{ required: true }]}>
              <BaseBoolRadio />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="safeRegistrationOn" label="是否开启注册" rules={[{ required: true }]}>
              <BaseBoolRadio />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="safeTokenExpireHour" label="token有效时长" rules={[{ required: true }, { validator: validateSafePasswordLen }]}>
              <InputNumber step={1} min={-1} max={7200} addonAfter="小时" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col md={8}>
            <Form.Item name="safePasswordType" label="密码类型" rules={[{ required: true }, { validator: validateSafePasswordLen }]}>
              <DictEnumApiSelector enumName="ConfigSysSafePasswordTypeEnum" />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="safePasswordLenMin" label="密码最小长度" rules={[{ required: true }, { validator: validateSafePasswordLen }]}>
              <InputNumber min={1} max={30} />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="safePasswordLenMax" label="密码最大长度" rules={[{ required: true }, { validator: validateSafePasswordLen }]}>
              <InputNumber min={1} max={30} />
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
