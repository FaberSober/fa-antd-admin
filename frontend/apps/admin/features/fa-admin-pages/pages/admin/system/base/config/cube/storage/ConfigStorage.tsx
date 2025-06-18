import React from 'react';
import { Tabs } from 'antd';
import ConfigStorageBase from './cube/ConfigStorageBase';
import ConfigStorageLocal from './cube/ConfigStorageLocal';
import ConfigStorageMinio from './cube/ConfigStorageMinio';
import ConfigStorageQiniu from './cube/ConfigStorageQiniu';

/**
 * @author xu.pengfei
 * @date 2022/12/29 15:38
 */
export default function ConfigStorage() {
  return (
    <div>
      <Tabs
        defaultActiveKey="base"
        className="fa-bg-white"
        items={[
          { label: '基础配置', key: 'base', children: <ConfigStorageBase /> },
          { label: '本地文件', key: 'local', children: <ConfigStorageLocal /> },
          { label: 'Minio', key: 'minio', children: <ConfigStorageMinio /> },
          { label: '七牛云', key: 'qiniu', children: <ConfigStorageQiniu /> },
        ]}
        tabPosition="left"
        destroyInactiveTabPane
        size="small"
      />
    </div>
  );
}
