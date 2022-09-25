import React, {useContext, useState} from 'react';
import {Button, Drawer, Space, Tree} from 'antd';
import Rbac from '@/props/rbac';
import {DragModalProps} from "@/components/modal/DragModal";
import {FaberBase} from "@/props/base";
import rbacMenuApi from "@/services/rbac/rbacMenu";
import rbacRoleMenuApi from "@/services/rbac/rbacRoleMenu";
import {FaFlexRestLayout} from "@/components/base-layout";
import {showResponse} from "@/utils/utils";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";


export interface RbacRoleMenuDrawerProps extends DragModalProps {
  record: Rbac.RbacRole;
  success?: () => void;
}

/**
 * BASE-角色表实体新增、编辑弹框
 */
export default function RbacRoleMenuDrawer({ children, title, record, success, ...props }: RbacRoleMenuDrawerProps) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [tree, setTree] = useState<FaberBase.TreeNode<Rbac.RbacMenu>[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  function refreshData() {
    rbacMenuApi.allTree().then((res) => {
      setTree(res.data)

      rbacRoleMenuApi.getRoleMenu(record.id).then((res) => {
        setCheckedKeys(res.data.checkedRoleIds);
        setHalfCheckedKeys(res.data.halfCheckedRoleIds);
      })
    })
  }

  function handleSave() {
    rbacRoleMenuApi.updateRoleMenu({
      roleId: record.id,
      checkedRoleIds: checkedKeys.map((i) => Number(i)),
      halfCheckedRoleIds: halfCheckedKeys.map((i) => Number(i)),
    }).then(res => {
      showResponse(res, "更新角色权限")
    })
  }

  function showModal() {
    setModalVisible(true)
    refreshData()
  }

  const loading = loadingEffect[rbacRoleMenuApi.getUrl('updateRoleMenu')]
  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <Drawer
        title="角色权限设置"
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <div style={{ height: '100%', position: 'relative' }}>
          <div className="faber-full-content-no-padding faber-flex-column">
            <FaFlexRestLayout>
              <Tree
                checkable
                // @ts-ignore
                treeData={tree}
                fieldNames={{ title: 'name', key: 'id' }}
                checkedKeys={checkedKeys}
                onCheck={(checked, e  ) => {
                  // @ts-ignore
                  setCheckedKeys(checked)
                  setHalfCheckedKeys(e.halfCheckedKeys || [])
                }}
              />
            </FaFlexRestLayout>

            <Space style={{ marginTop: 12 }}>
              <Button type="primary" onClick={handleSave} loading={loading}>更新</Button>
            </Space>
          </div>
        </div>
      </Drawer>
    </span>
  )
}
