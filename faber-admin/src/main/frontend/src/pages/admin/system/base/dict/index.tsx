import React, {useRef, useState} from 'react';
import {RES_CODE} from '@/configs/server.config';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import {CaretRightOutlined, PlusOutlined} from '@ant-design/icons';
import {Collapse, Descriptions} from 'antd';
import Admin from '@/props/admin';
import dictTypeService from '@/services/admin/dictType';
import { useLocalStorage } from 'react-use';
import BaseTreeProps from "@/components/base-tree/interface";
import DictList from "./cube/DictList";
import DictTypeModal from "./modal/DictTypeModal";

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictManage() {
  const listRef = useRef<any | null>(null);

  const [viewRecord, setViewRecord] = useState<Admin.DictType>();
  const [splitPos, setSplitPos] = useLocalStorage<number>('DictManage.splitPos', 250);

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[], event: any) {
    if (keys && keys[0]) {
      // 0为根节点
      if (`${keys[0]}` === '0') {
        setViewRecord(undefined);
      } else {
        dictTypeService.findOne(keys[0]).then((res) => {
          if (res && res.status === RES_CODE.OK) {
            setViewRecord(res.data);
          }
        });
      }
    }
  }

  function onAfterDelItem(item: BaseTreeProps.TreeNode) {
    setViewRecord(undefined);
  }

  return (
    <div className="fa-full-content">
      <SplitPane split="vertical" minSize={200} maxSize={350} defaultSize={splitPos} onChange={(size) => setSplitPos(size)}>
        {/* 左侧面板 */}
        <BaseTree
          // showRoot
          showOprBtn
          onSelect={onTreeSelect}
          onAfterDelItem={onAfterDelItem}
          // 自定义配置
          serviceName="字典分组"
          ServiceModal={DictTypeModal}
          serviceApi={dictTypeService}
          extraContextMenus={[
            {
              key: 'add-dict',
              menuTitle: (
                <>
                  <PlusOutlined /> 新增字典值
                </>
              ),
              onMenuClick: () => listRef.current.showAddModal(),
            },
          ]}
        />

        {/* 右侧面板 */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'auto' }}>
          <Collapse
            bordered={false}
            defaultActiveKey={[]}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ marginBottom: 12 }}
          >
            <Collapse.Panel header={viewRecord ? `字典信息 - ${viewRecord.name}` : '字典信息'} key="1" className="site-collapse-custom-panel">
              {viewRecord ? (
                <Descriptions bordered size="small">
                  <Descriptions.Item label="字典分组名称">{viewRecord.name}</Descriptions.Item>
                  <Descriptions.Item label="字典分组编码">{viewRecord.code}</Descriptions.Item>
                  <Descriptions.Item label="描述">{viewRecord.description}</Descriptions.Item>
                </Descriptions>
              ) : null}
            </Collapse.Panel>
          </Collapse>

          <DictList ref={listRef} type={viewRecord?.id} />
        </div>
      </SplitPane>
    </div>
  );
}
