import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import SplitPane from 'react-split-pane';
import { CaretRightOutlined } from '@ant-design/icons';
import {Collapse, Descriptions, Empty, Tabs} from 'antd';
import BaseTree from '@/components/base-tree';
import Admin from '@/props/admin';
import { RES_CODE } from '@/configs/server.config';
import groupApi from '@/services/admin/group';
import groupTypeApi from '@/services/admin/groupType';
import GroupModal from './modal/GroupModal';
import BaseTreeProps from '@/components/base-tree/interface';
import GroupUserList from "@/pages/system/human_manage/role_auth/cube/GroupUserList";
import GroupAuthCheck from './cube/GroupAuthCheck';
import { useLocalStorageState } from 'ahooks';

/**
 * 智能人事/角色权限管理
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function GroupAuthManage(_: RouteComponentProps) {
  const [viewGroup, setViewGroup] = useState<Admin.Group>();
  const [splitPos, setSplitPos] = useLocalStorageState<number>('GroupAuthManage.splitPos', { defaultValue: 250 });
  const [selectedGroupType, setSelectedGroupType] = useState('1');
  const [groupTypes, setGroupTypes] = useState<Admin.GroupType[]>([]);

  useEffect(() => {
    groupTypeApi.list({}).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setGroupTypes(res.data);
      }
    });
  }, []);

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[], event: any) {
    if (keys && keys[0]) {
      // 0为根节点
      if (`${keys[0]}` === '0') {
        setViewGroup(undefined);
      } else {
        groupApi.findOne(keys[0]).then((res) => {
          if (res && res.status === RES_CODE.OK) {
            setViewGroup(res.data);
          }
        });
      }
    }
  }

  function onAfterDelItem(item: BaseTreeProps.TreeNode) {
    setViewGroup(undefined);
  }

  return (
    <div className="faber-full-content">
      <SplitPane split="vertical" minSize={50} defaultSize={splitPos} onChange={(size) => setSplitPos(size)}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Tabs type="card" activeKey={selectedGroupType} onChange={(t) => setSelectedGroupType(t)}>
            {groupTypes.map((g) => (
              <Tabs.TabPane tab={g.name} key={`${g.id}`} />
            ))}
          </Tabs>
          <div style={{ position: 'absolute', top: 40, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
            {/* 左侧面板 */}
            <BaseTree
              // showRoot
              showOprBtn
              onSelect={onTreeSelect}
              onAfterDelItem={onAfterDelItem}
              // 自定义配置
              serviceName="角色"
              ServiceModal={GroupModal}
              serviceApi={{
                allTree: () => groupApi.getTree({ groupType: selectedGroupType }),
                changePos: (list: any[]) => groupApi.changePos(list),
                findOne: (id: number) => groupApi.findOne(id),
                remove: (id: number) => groupApi.remove(id),
              }}
              extraEffectArgs={{ groupType: selectedGroupType }}
            />
          </div>
        </div>

        {/* 右侧面板 */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'auto' }}>
          {viewGroup ? (
              <>
                <Collapse
                  bordered={false}
                  // defaultActiveKey={['1']}
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  style={{ marginBottom: 12 }}
                >
                  <Collapse.Panel header={viewGroup ? `菜单信息 - ${viewGroup.name}` : '菜单信息'} key="1" className="site-collapse-custom-panel">
                    {viewGroup ? (
                      <Descriptions bordered size="small">
                        <Descriptions.Item label="角色名称">{viewGroup.name}</Descriptions.Item>
                        <Descriptions.Item label="角色编码">{viewGroup.code}</Descriptions.Item>
                        <Descriptions.Item label="描述">{viewGroup.description}</Descriptions.Item>
                      </Descriptions>
                    ) : null}
                  </Collapse.Panel>
                </Collapse>

                <Tabs type="card">
                  <Tabs.TabPane tab="关联用户" key="1">
                    <GroupUserList groupId={viewGroup?.id} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="分配权限" key="2">
                    <GroupAuthCheck groupId={viewGroup?.id} />
                  </Tabs.TabPane>
                </Tabs>
              </>
          ) : <Empty description="请先选择角色" />}
        </div>
      </SplitPane>
    </div>
  );
}
