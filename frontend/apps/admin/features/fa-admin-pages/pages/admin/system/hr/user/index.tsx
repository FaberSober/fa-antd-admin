import React, { useState } from 'react';
import { BaseTree } from '@fa/ui';
import type { Admin } from '@/types';
import { departmentApi } from '@features/fa-admin-pages/services';
import DepartmentModal from './modal/DepartmentModal';
import UserList from './cube/UserList';
import { dispatch } from 'use-bus';
import { PlusOutlined } from '@ant-design/icons';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

/**
 * 用户部门管理
 * @author xu.pengfei
 * @date 2020/12/27
 */
export default function UserDepartmentManage() {
  const [viewRecord, setViewRecord] = useState<Admin.Department>();

  function onTreeSelect(keys: any[], event: any) {
    setViewRecord(keys.length > 0 ? event.node.sourceData : undefined);
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  function handleAddUser(e: any) {
    dispatch({ type: '@@UserModal/SHOW_ADD', payload: { departmentId: e.props.sourceData.id } });
  }

  return (
    <div className="fa-full-content">
      <Allotment defaultSizes={[100, 500]}>
        {/* 左侧面板 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <BaseTree
            // showRoot
            rootName="全部"
            showOprBtn
            onSelect={onTreeSelect}
            onAfterDelItem={onAfterDelItem}
            // 自定义配置
            serviceName="部门"
            ServiceModal={DepartmentModal}
            serviceApi={departmentApi}
            extraContextMenus={[
              {
                key: 'add-user',
                icon: <PlusOutlined />,
                title: '新增用户',
                onMenuClick: handleAddUser,
              },
            ]}
          />
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          <UserList departmentId={viewRecord?.id} />
        </div>
      </Allotment>
    </div>
  );
}
