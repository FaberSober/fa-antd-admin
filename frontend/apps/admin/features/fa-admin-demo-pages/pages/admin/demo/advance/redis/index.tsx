import React, {useContext, useState} from 'react';
import {Alert, Button, Card, Form, Input} from 'antd';
import {ApiEffectLayoutContext, FaFlexRestLayout, FaUtils} from '@fa/ui';
import {ConfigLayoutContext} from "@/layout";
import {redisTestApi, studentApi} from '@/services';
import type {Demo} from '@/types';


/**
 * @author xu.pengfei
 * @date 2022/12/7 22:10
 */
export default function DemoAdvanceRedis() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { systemConfig } = useContext(ConfigLayoutContext);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const [data, setData] = useState<string>();
  const [student, setStudent] = useState<Demo.Student>();

  function onFinish({ key, value }: any) {
    redisTestApi.addCache(key, value).then(refreshIframe);
  }

  function onFinish1({ key }: any) {
    redisTestApi.getCache(key).then((res) => setData(res.data));
  }

  function onFinish2({ id }: any) {
    studentApi
      .getById(id)
      .then((res) => setStudent(res.data))
      .then(refreshIframe);
  }

  function refreshIframe() {
    (document.getElementById('phpRedisAdmin') as any).contentWindow.location = systemConfig.phpRedisAdmin;
  }

  const loading = loadingEffect[redisTestApi.getUrl('addCache')];
  const loading2 = loadingEffect[redisTestApi.getUrl('getCache')];
  return (
    <div className="fa-full-content fa-flex-row fa-p12">
      <div style={{ width: 300, marginRight: 12 }}>
        <Card title="添加缓存" className="fa-mb12">
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="key" label="Key" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
              <Input />
            </Form.Item>
            <Form.Item name="value" label="Value" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
              <Input />
            </Form.Item>

            <Button loading={loading} htmlType="submit">
              添加缓存
            </Button>
          </Form>
        </Card>

        <Card title="获取缓存" className="fa-mb12">
          <Form form={form1} onFinish={onFinish1}>
            <Form.Item name="key" label="Key" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
              <Input />
            </Form.Item>

            <Button loading={loading2} htmlType="submit">
              获取缓存
            </Button>

            <p>获取缓存：{data}</p>
          </Form>
        </Card>

        <Alert description="缓存100s后失效" className="fa-mb12" />

        <Card title="获取Student" className="fa-mb12">
          <Form form={form2} onFinish={onFinish2}>
            <Form.Item name="id" label="id" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
              <Input />
            </Form.Item>

            <Button loading={loading2} htmlType="submit">
              获取Student
            </Button>

            <p>
              获取缓存：{student?.id} {student?.name}
            </p>
          </Form>
        </Card>
      </div>

      <FaFlexRestLayout>
        <iframe
          id="phpRedisAdmin"
          src={systemConfig.phpRedisAdmin}
          className="fa-full-content"
          style={{ width: '100%', height: '100%', border: 'none', margin: 0 }}
        />

        <Button onClick={refreshIframe} style={{ position: 'relative', top: 10, left: 180 }}>
          刷新
        </Button>
      </FaFlexRestLayout>
    </div>
  );
}
