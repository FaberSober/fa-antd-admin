import React, {useState} from 'react';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import * as Admin from '../../../../../../types/admin';
import departmentService from '@/services/admin/department';
import {useLocalStorage} from 'react-use';
import DepartmentModal from "./modal/DepartmentModal";
import UserList from "./cube/UserList";
import {dispatch} from 'use-bus'
import {PlusOutlined} from "@ant-design/icons";


/**
 * 用户部门管理
 * @author xu.pengfei
 * @date 2020/12/27
 */
export default function UserDepartmentManage() {
  const [splitPos, setSplitPos] = useLocalStorage<number>('UserDepartmentManage.splitPos', 250);
  const [viewRecord, setViewRecord] = useState<Admin.Department>();

  function onTreeSelect(keys: any[], event: any) {
    setViewRecord(keys.length > 0 ? event.node.sourceData : undefined)
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  function handleAddUser(e: any) {
    dispatch({ type: '@@UserModal/SHOW_ADD', payload: { departmentId: e.props.sourceData.id } })
  }

  return (
    <div className="fa-full-content">
      <SplitPane split="vertical" minSize={200} maxSize={350} defaultSize={splitPos} onChange={(size) => setSplitPos(size)}>
        {/* 左侧面板 */}
        <BaseTree
          // showRoot
          rootName="全部"
          showOprBtn
          onSelect={onTreeSelect}
          onAfterDelItem={onAfterDelItem}
          // 自定义配置
          serviceName="部门"
          ServiceModal={DepartmentModal}
          serviceApi={departmentService}
          extraContextMenus={[
            {
              key: 'add-user',
              icon: <PlusOutlined />,
              title: '新增用户',
              onMenuClick: handleAddUser,
            },
          ]}
        />

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          <UserList departmentId={viewRecord?.id} />
        </div>
      </SplitPane>
    </div>
  );
}
