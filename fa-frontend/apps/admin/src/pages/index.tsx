import React, { useState } from 'react';
import { Button, ConfigProvider, DatePicker, Form, InputNumber, Radio, Space } from 'antd';
import { Button as UiButton } from '@fa/ui';
import clsx from 'clsx';
import styles from './index.module.scss';

type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
};

const defaultData: ThemeData = {
  borderRadius: 6,
  colorPrimary: '#1677ff',
};

/**
 * @author xu.pengfei
 * @date 2022/12/17 17:23
 */
export default function index() {
  const [form] = Form.useForm();
  const [data, setData] = useState<ThemeData>(defaultData);

  function handleChangeTheme(e: any) {
    const theme = e.target.dataset.theme;
    document.body.setAttribute('data-theme', theme);

    const currentThemeNode = document.getElementById('theme-current');
    if (theme === 'light') {
      currentThemeNode!.textContent = '亮色';
    } else if (theme === 'dark') {
      currentThemeNode!.textContent = '暗色';
    }
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: data.colorPrimary, borderRadius: data.borderRadius } }}>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <main className="mx-auto w-auto px-4 pt-4 pb-4 sm:pt-12 lg:px-8">
          <h1 className="mx-auto max-w-5xl text-center text-6xl font-extrabold leading-[1.1] tracking-tighter sm:text-7xl lg:text-8xl xl:text-8xl">
            Web <br className="hidden lg:block" />
            <span className="inline-block bg-gradient-to-r from-brandred to-brandblue bg-clip-text text-transparent">
              Turborepo Example
            </span>
          </h1>
          <div className="mx-auto max-w-xl mb-4">
            <UiButton />
          </div>

          <div className={clsx(styles.main, 'mx-auto', 'mb-4')}>
            <div className={styles.title}>scss module style</div>

            <div className={styles.info}>mi info</div>
            <div className={styles.alert}>mi info</div>
            <div className={styles.success}>mi info</div>

            <Button type="primary">Style Changed By Sass Global</Button>
          </div>

          <Space>
            <Button type="primary">Hello</Button>
            <DatePicker />
          </Space>

          <Space>
            <Form
              form={form}
              onValuesChange={(_, allValues) => {
                setData(allValues);
              }}
              name="theme"
              initialValues={defaultData}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Form.Item name="colorPrimary" label="Primary Color">
                <Radio.Group
                  options={[
                    { label: '#1677ff', value: '#1677ff' },
                    { label: '#F00', value: '#F00' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="borderRadius" label="Border Radius">
                <InputNumber />
              </Form.Item>
              <Form.Item name="submit" wrapperCol={{ offset: 4, span: 20 }}>
                <Button type="primary">Submit</Button>
              </Form.Item>
            </Form>
          </Space>

          <h1 className="title">Hello, World</h1>
          <p className="subtitle">
            当前主题：<span id="theme-current">亮色</span>
          </p>
          <button className="theme-switch light" data-theme="light" onClick={handleChangeTheme}>
            亮色
          </button>
          <button className="theme-switch dark" data-theme="dark" onClick={handleChangeTheme}>
            暗色
          </button>
        </main>
      </div>
    </ConfigProvider>
  );
}
