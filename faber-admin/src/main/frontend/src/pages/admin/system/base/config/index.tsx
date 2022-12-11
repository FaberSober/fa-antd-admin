import React from 'react';
import {Tabs} from "antd";
import ConfigSystem from "@/pages/admin/system/base/config/cube/ConfigSystem";

/**
 * 系统配置
 * @author xu.pengfei
 * @date 2022/12/11 22:42
 */
export default function index() {
  return (
    <div className="fa-full-content-p12">
      <Tabs
        defaultActiveKey="1"
        className="fa-bg-white"
        tabBarStyle={{ padding: '0 12px' }}
        items={[
          { label: `系统配置`, key: '1', children: <ConfigSystem /> },
          { label: `文件配置`, key: '2', children: `Content of Tab Pane 3` },
          { label: `邮件配置`, key: '3', children: `Content of Tab Pane 2` },
          { label: `短信配置`, key: '4', children: `Content of Tab Pane 3` },
        ]}
      />
    </div>
  )
}
