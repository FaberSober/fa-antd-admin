import React, {useState} from 'react';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import Admin from '@/props/admin';
import departmentService from '@/services/admin/department';
import {useLocalStorage} from 'react-use';
import BaseTreeProps from "@/components/base-tree/interface";
import DepartmentModal from "./modal/DepartmentModal";
import UserList from "./cube/UserList";


/**
 * 用户部门管理
 * @author xu.pengfei
 * @date 2020/12/27
 */
export default function UserDepartmentManage() {
  const [splitPos, setSplitPos] = useLocalStorage<number>('UserDepartmentManage.splitPos', 250);
  const [viewRecord, setViewRecord] = useState<Admin.Department>();

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[], event: any) {
    setViewRecord(event.node.sourceData)
  }

  function onAfterDelItem(item: BaseTreeProps.TreeNode<Admin.Department, string>) {
    setViewRecord(undefined);
  }

  return (
    <div className="fa-full-content">
      <SplitPane split="vertical" minSize={200} maxSize={350} defaultSize={splitPos} onChange={(size) => setSplitPos(size)}>
        {/* 左侧面板 */}
        <BaseTree
          showRoot
          rootName="全部"
          showOprBtn
          onSelect={onTreeSelect}
          onAfterDelItem={onAfterDelItem}
          // 自定义配置
          serviceName="部门"
          ServiceModal={DepartmentModal}
          serviceApi={departmentService}
        />

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          <UserList departmentId={viewRecord?.id} />
        </div>
      </SplitPane>
    </div>
  );
}
