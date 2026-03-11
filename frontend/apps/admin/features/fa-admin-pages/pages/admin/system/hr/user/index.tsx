import React, { useState } from 'react';
import { BaseTree } from '@fa/ui';
import type { Admin } from '@/types';
import { departmentApi } from '@features/fa-admin-pages/services';
import DepartmentModal from './modal/DepartmentModal';
import UserList from './cube/UserList';
import { dispatch } from 'use-bus';
import { PlusOutlined } from '@ant-design/icons';
import { Splitter } from 'antd';

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
    <div className="fa-full-content-p12">
      <Splitter>
        {/* 左侧面板 */}
        <Splitter.Panel defaultSize={260} min={240} max="50%" collapsible>
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
        </Splitter.Panel>

        {/* 右侧面板 */}
        <Splitter.Panel>
          <div className="fa-flex-column fa-full fa-relative">
            <UserList departmentId={viewRecord?.id} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
