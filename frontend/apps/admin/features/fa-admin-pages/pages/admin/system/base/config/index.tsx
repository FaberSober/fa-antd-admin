import React, { useState } from 'react';
import { Segmented } from 'antd';
import ConfigSystem from './cube/ConfigSystem';
import ConfigSafe from './cube/ConfigSafe';
import ConfigLog from './cube/ConfigLog';
import ConfigStorage from './cube/storage/ConfigStorage';
import { DatabaseOutlined, OrderedListOutlined, SafetyCertificateOutlined, SettingOutlined } from '@ant-design/icons';

/**
 * 系统配置
 * @author xu.pengfei
 * @date 2022/12/11 22:42
 */
export default function Config() {
  const [tab, setTab] = useState('system');

  return (
    <div className="fa-full-content-p12">
      <Segmented
        value={tab}
        onChange={(v: any) => setTab(v)}
        options={[
          {
            label: '系统配置',
            value: 'system',
            icon: <SettingOutlined />,
          },
          {
            label: '安全配置',
            value: 'safe',
            icon: <SafetyCertificateOutlined />,
          },
          {
            label: '文件配置',
            value: 'file',
            icon: <DatabaseOutlined />,
          },
          {
            label: '日志配置',
            value: 'log',
            icon: <OrderedListOutlined />,
          },
        ]}
      />

      <div className="fa-mt12 fa-bg-white">
        {tab === 'system' && <ConfigSystem />}
        {tab === 'safe' && <ConfigSafe />}
        {tab === 'file' && <ConfigStorage />}
        {tab === 'log' && <ConfigLog />}
      </div>
    </div>
  );
}
