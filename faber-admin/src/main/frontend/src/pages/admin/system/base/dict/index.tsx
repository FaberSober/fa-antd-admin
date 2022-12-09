import React, {useState} from 'react';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import {PlusOutlined} from '@ant-design/icons';
import {Descriptions} from 'antd';
import Admin from '@/props/admin';
import dictTypeService from '@/services/admin/dictType';
import {useLocalStorage} from 'react-use';
import DictList from "./cube/DictList";
import DictTypeModal from "./modal/DictTypeModal";
import {FaFlexRestLayout} from "@/components/base-layout";
import {dispatch} from "use-bus";


/**
 * 字典管理
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictManage() {
  const [viewRecord, setViewRecord] = useState<Admin.DictType>();
  const [splitPos, setSplitPos] = useLocalStorage<number>('DictManage.splitPos', 250);

  function onTreeSelect(keys: any[], event: any) {
    setViewRecord(keys.length > 0 ? event.node.sourceData : undefined)
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  function handleAddDict(e: any) {
    dispatch({ type: '@@DictModal/SHOW_ADD', payload: { type: e.props.sourceData.id } })
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
              icon: <PlusOutlined />,
              title: '新增字典值',
              onMenuClick: handleAddDict,
            },
          ]}
        />

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          <Descriptions bordered size="small" style={{ marginBottom: 12 }} labelStyle={{ width: 150 }} contentStyle={{ minWidth: 100 }}>
            <Descriptions.Item label="字典分组名称">{viewRecord?.name}</Descriptions.Item>
            <Descriptions.Item label="字典分组编码">{viewRecord?.code}</Descriptions.Item>
            <Descriptions.Item label="描述">{viewRecord?.description}</Descriptions.Item>
          </Descriptions>

          <FaFlexRestLayout>
            <DictList type={viewRecord?.id} />
          </FaFlexRestLayout>
        </div>
      </SplitPane>
    </div>
  );
}
