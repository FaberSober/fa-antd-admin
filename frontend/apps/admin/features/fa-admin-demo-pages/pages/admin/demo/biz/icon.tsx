import React, { useState } from 'react';
import { Card, Space } from 'antd';
import { IconSelect } from "@/components";
import { Icon } from '@iconify/react';

/**
 * @author xu.pengfei
 * @date 2022/9/24 20:56
 */
export default function IconIndex() {
  const [value, setValue] = useState<string>();

  return (
    <div className="fa-full-content-p12" style={{ fontSize: '30px' }}>
      <Card title="使用@iconify/react" className="fa-mb12">
        <p>可以自定义大小：</p>
        <Space>
          <Icon icon="mdi:rocket-launch" fontSize="10px" />
          <Icon icon="mdi:rocket-launch" fontSize="20px" />
          <Icon icon="mdi:rocket-launch" fontSize="30px" />
        </Space>
        <p>可以自定义修改颜色：</p>
        <Space>
          <Icon icon="mdi:rocket-launch" fontSize="30px" style={{ color: '#f50' }} />
          <Icon icon="mdi:rocket-launch" fontSize="30px" style={{ color: 'rgb(45, 183, 245)' }} />
          <Icon icon="mdi:rocket-launch" fontSize="30px" style={{ color: 'hsl(102, 53%, 61%)' }} />
          <Icon icon="mdi:rocket-launch" fontSize="30px" style={{ color: 'hwb(205 6% 9%)' }} />
        </Space>
      </Card>

      <Card title="选择图标" className="fa-mb12">
        <div style={{ width: 300}}>
          <IconSelect value={value} onChange={setValue} />
        </div>

        <p>
          图标代码：<code>&lt;FaIconPro icon="{value}" /&gt;</code>
        </p>
      </Card>

      <Card title="UnoCSS图标" className="fa-mb12">
        <ol>
          <li>logo图标参考网站：<a href="https://icon-sets.iconify.design/logos/" target="_blank">@iconify-json/logos</a></li>
          <li>icon使用插件：<a href="https://unocss.dev/presets/icons" target="_blank"><code>@unocss/preset-icons</code></a></li>
        </ol>
        <Space>
          <div className="logo"/>
          <div className="i-logos-twitter w-6em h-6em transform transition-300 hover:rotate-x-50 hover:rotate-y-50 hover:rotate-z-30"/>
          <div className="i-logos-vitejs w-6em h-6em"/>
          <h1 className="mt-2em animate-bounce-alt animate-duration-2s">Hello Vite + React!</h1>
          <button
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600"
            type="button"
          >
            hello UnoCSS
          </button>
        </Space>
      </Card>
    </div>
  );
}
