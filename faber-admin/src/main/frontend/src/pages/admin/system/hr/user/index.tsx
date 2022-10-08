import React, {useRef, useState} from 'react';
import {RES_CODE} from '@/configs/server.config';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import Admin from '@/props/admin';
import departmentService from '@/services/admin/department';
import {PlusOutlined} from '@ant-design/icons';
import { useLocalStorage } from 'react-use';
import BaseTreeProps from "@/components/base-tree/interface";
import DepartmentModal from "./modal/DepartmentModal";
import UserList from "./cube/UserList";

/**
 * 用户部门管理
 * @author xu.pengfei
 * @date 2020/12/27
 */
export default function UserDepartmentManage() {
  const listRef = useRef<any | null>(null);

  const [splitPos, setSplitPos] = useLocalStorage<number>('UserDepartmentManage.splitPos', 250);
  const [viewRecord, setViewRecord] = useState<Admin.Department>();

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[], event: any) {
    if (keys && keys[0]) {
      // 0为根节点
      if (`${keys[0]}` === '0') {
        setViewRecord(undefined);
      } else {
        departmentService.findOne(keys[0]).then((res) => {
          if (res && res.status === RES_CODE.OK) {
            setViewRecord(res.data);
          }
        });
      }
    }
  }

  function onAfterDelItem(item: BaseTreeProps.TreeNode<Admin.Department, string>) {
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
          serviceName="部门"
          ServiceModal={DepartmentModal}
          serviceApi={departmentService}
          extraContextMenus={[
            {
              key: 'add-dict',
              menuTitle: (
                <div>
                  <PlusOutlined /> 新增账户
                </div>
              ),
              onMenuClick: () => listRef.current.showAddModal(),
            },
          ]}
        />

        {/* 右侧面板 */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'auto' }}>
          <UserList ref={listRef} departmentId={viewRecord?.id} />
        </div>
      </SplitPane>
    </div>
  );
}
