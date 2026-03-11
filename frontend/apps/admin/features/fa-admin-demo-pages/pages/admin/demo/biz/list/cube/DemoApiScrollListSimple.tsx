import React from 'react';
import { Form, Input, List } from 'antd';
import { FaApiScrollList } from '@features/fa-admin-pages/components';
import { logApiApi } from '@features/fa-admin-pages/services';
import { Admin } from '@features/fa-admin-pages/types';
import { DictEnumApiSelector } from '@fa/ui';

/**
 * 使用FaApiScrollList组件简化实现的API滚动列表示例
 * @author xu.pengfei
 * @date 2025-08-28 21:53:05
 */
export default function DemoApiScrollListSimple() {
  return (
    <div className='fa-full-content' style={{width: 400}}>
      <FaApiScrollList
        apiPage={logApiApi.page}
        renderItem={(item: Admin.LogApi) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={item.biz + " / " + item.opr}
              description={item.crtName + " / " + item.crtTime}
            />
            <div>
              {item.url}
            </div>
          </List.Item>
        )}
        renderFilterFormItems={() => (
          <div>
            <Form.Item name="crud" label="类型">
              <DictEnumApiSelector enumName="LogCrudEnum" allowClear />
            </Form.Item>
            <Form.Item name="biz" label="模块">
              <Input placeholder="请输入模块" allowClear />
            </Form.Item>
            <Form.Item name="opr" label="操作">
              <Input placeholder="请输入操作" allowClear />
            </Form.Item>
            <Form.Item name="url" label="URL">
              <Input placeholder="请输入请求URL" allowClear />
            </Form.Item>
          </div>
        )}
      />
    </div>
  );
}
