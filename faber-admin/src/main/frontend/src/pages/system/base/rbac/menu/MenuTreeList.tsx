import React, {useEffect, useState} from 'react';
import rbacMenuApi from '@/services/rbac/rbacMenu'
import {FaberBase} from "@/props/base";
import Rbac from '@/props/rbac';
import {RES_CODE} from "@/configs/server.config";
import {Button, Space} from "antd";
import RbacMenuModal from "@/pages/system/base/rbac/menu/modal/RbacMenuModal";
import {PlusOutlined} from "@ant-design/icons";

/**
 * @author xu.pengfei
 * @date 2022/9/19
 */
export default function MenuTreeList() {
  const [tree, setTree] = useState<FaberBase.TreeNode<Rbac.RbacMenu>[]>([])

  useEffect(() => {
    refreshData()
  }, [])

  function refreshData() {
    rbacMenuApi.allTree().then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setTree(res.data)
      }
    })
  }

  return (
    <div className="faber-full-content faber-flex-row">
      <Space>
        <RbacMenuModal title="新增菜单" fetchFinish={refreshData}>
          <Button type="primary" icon={<PlusOutlined />}>新增菜单</Button>
        </RbacMenuModal>
      </Space>
    </div>
  )
}
