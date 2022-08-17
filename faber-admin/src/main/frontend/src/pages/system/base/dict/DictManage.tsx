import React, { useRef, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { RES_CODE } from '@/configs/server.config';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/biz/base-tree';
import DictTypeModal from "@/pages/system/base/dict/modal/DictTypeModal";
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse, Descriptions } from 'antd';
import Admin from '@/props/admin';
import dictTypeService from '@/services/admin/dictType';
import DictList from "@/pages/system/base/dict/cube/DictList";
import { useLocalStorageState } from 'ahooks';
import BaseTreeProps from "@/components/biz/base-tree/interface";

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictManage(props: RouteComponentProps) {
  const listRef = useRef<any | null>(null);

  const [viewRecord, setViewRecord] = useState<Admin.DictType>();
  const [splitPos, setSplitPos] = useLocalStorageState<number>('DictManage.splitPos', { defaultValue: 250 });

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[], event: any) {
    if (keys && keys[0]) {
      // -1为根节点
      if (`${keys[0]}` === '-1') {
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
    <div className="faber-full-content">
      <SplitPane split="vertical" minSize={50} defaultSize={splitPos} onChange={(size) => setSplitPos(size)}>
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
            defaultActiveKey={['1']}
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
