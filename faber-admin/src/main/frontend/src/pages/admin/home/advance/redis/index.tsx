import React, {useContext, useState} from 'react';
import {Alert, Button, Card, Form, Input, Space} from "antd";
import redisTestApi from '@/services/demo/redisTest'
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import {formItemFullLayout} from "@/utils/utils";
import {FaFlexRestLayout} from "@/components/base-layout";
import {UserLayoutContext} from "@/layout/UserLayout";


/**
 * @author xu.pengfei
 * @date 2022/12/7 22:10
 */
export default function index() {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const {systemConfig} = useContext(UserLayoutContext)
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [url, setUrl] = useState<string>(systemConfig.phpRedisAdmin)
  const [data, setData] = useState<string>()

  function onFinish({key, value}: any) {
    redisTestApi.addCache(key, value).then(refreshIframe)
  }

  function onFinish1({key}: any) {
    redisTestApi.getCache(key).then(res => setData(res.data))
  }

  function refreshIframe() {
    // setUrl(`${systemConfig.phpRedisAdmin}?a=${Date.parse(new Date()) / 1000}`)
    document.getElementById('phpRedisAdmin').contentWindow.location.reload();

  }

  const loading = loadingEffect[redisTestApi.getUrl('addCache')];
  const loading2 = loadingEffect[redisTestApi.getUrl('getCache')];
  return (
    <div className="fa-full-content fa-flex-row fa-p12">
      <div style={{ width: 300, marginRight: 12 }}>
        <Card title="添加缓存" className="fa-mb12">
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="key" label="Key" rules={[{ required: true }]} {...formItemFullLayout}>
              <Input />
            </Form.Item>
            <Form.Item name="value" label="Value" rules={[{ required: true }]} {...formItemFullLayout}>
              <Input />
            </Form.Item>

            <Button loading={loading} htmlType="submit">添加缓存</Button>
          </Form>
        </Card>

        <Card title="添加缓存" className="fa-mb12">
          <Form form={form1} onFinish={onFinish1}>
            <Form.Item name="key" label="Key" rules={[{ required: true }]} {...formItemFullLayout}>
              <Input />
            </Form.Item>

            <Button loading={loading2} htmlType="submit">获取缓存</Button>

            <p>获取缓存：{data}</p>
          </Form>
        </Card>

        <Alert description="缓存100s后失效" />
      </div>

      <FaFlexRestLayout>
        <iframe id="phpRedisAdmin" src={url} className="fa-full-content" style={{ width: '100%', height: '100%', border: 'none', margin: 0 }} />

        <Button onClick={refreshIframe} style={{ position: 'relative', top: 10, left: 180 }}>刷新</Button>
      </FaFlexRestLayout>
    </div>
  )
}
