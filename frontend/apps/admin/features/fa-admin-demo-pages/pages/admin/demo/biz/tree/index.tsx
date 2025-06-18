import React, { useState } from 'react';
import { Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { treeApi } from '@/services';
import { BaseTree } from '@fa/ui';
import type { Demo } from '@/types';
import TreeModal from "./modal/TreeModal";

/**
 * 远程数据Tree
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function tree() {
  const [sel, setSel] = useState<Demo.Tree>();

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[]) {
    if (keys && keys[0]) {
      treeApi.getById(keys[0]).then((res) => setSel(res.data));
    }
  }

  return (
    <div className="fa-full-content fa-p12">
      <Card title="远程数据Tree-带一个根节点" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. 远程数据返回Tree型数据；3. 禁止拖动；</p>

        <BaseTree
          showRoot
          onSelect={onTreeSelect}
          // 自定义配置
          serviceApi={treeApi}
          showTips={false}
          showTopBtn={false}
          bodyStyle={{ width: 400, height: 200 }}
          draggable={false}
        />

        <p>选中节点：{JSON.stringify(sel)}</p>
      </Card>

      <Card title="远程数据Tree-可编辑" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. 远程数据返回Tree型数据；3. 支持拖动排序；</p>

        <BaseTree
          // showRoot
          showOprBtn
          onSelect={(keys) => console.log('onSelect', keys)}
          onAfterDelItem={() => setSel(undefined)}
          // 自定义配置
          serviceName="Tree"
          ServiceModal={TreeModal}
          serviceApi={treeApi}
          extraContextMenus={[
            {
              key: 'extra-menu1',
              icon: <PlusOutlined />,
              title: '补充菜单1',
              onMenuClick: (_, item) => {
                message.info('点击补充菜单1' + JSON.stringify(item));
              },
            },
          ]}
          bodyStyle={{ width: 400, height: 300 }}
        />
      </Card>
    </div>
  );
}
