import React, {useContext, useEffect, useState} from 'react';
import {FaberBase} from "@/props/base";
import {Button, Modal, Space, Table} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {FaFlexRestLayout} from "@/components/base-layout";
import FaberEnums from "@/props/base/FaberEnums";
import {useDelete} from "@/utils/myHooks";
import {showResponse} from "@/utils/utils";
import {AuthDelBtn, FaHref} from '@/components/decorator'
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import RbacMenuModal from "./modal/RbacMenuModal";
import rbacMenuApi from '@/services/rbac/rbacMenu'
import Rbac from '@/props/rbac';


/**
 * @author xu.pengfei
 * @date 2022/9/19
 */
export default function RbacMenuTreeList() {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [tree, setTree] = useState<FaberBase.TreeNode<Rbac.RbacMenu>[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const [handleDelete] = useDelete<string>(rbacMenuApi.remove, refreshData, '菜单');

  useEffect(() => {
    refreshData()
  }, [])

  function refreshData() {
    rbacMenuApi.allTree().then((res) => {
      setTree(res.data)
    })
  }

  function handleBatchDelete() {
    Modal.confirm({
      title: '批量删除',
      content: '确认删除勾选的数据？',
      onOk: () => {
        return rbacMenuApi.removeBatchByIds(selectedRowKeys).then(res => {
          showResponse(res, "批量删除")
          refreshData()
          setSelectedRowKeys([])
        })
      },
    })
  }

  function moveUp(id:string) {
    rbacMenuApi.moveUp(id).then(refreshData)
  }

  function moveDown(id:string) {
    rbacMenuApi.moveDown(id).then(refreshData)
  }

  const columns: ColumnsType<FaberBase.TreeNode<Rbac.RbacMenu>> = [
    { title: '名称', dataIndex: 'name', width: 200, },
    {
      title: '菜单等级',
      dataIndex: ['sourceData', 'level'],
      render: (val:FaberEnums.RbacMenuLevelEnum) => FaberEnums.RbacMenuLevelEnumMap[val],
      width: 120,
    },
    { title: '链接', dataIndex: ['sourceData', 'linkUrl'] },
    {
      title: '操作',
      render: (text: string, record: FaberBase.TreeNode<Rbac.RbacMenu>) => (
        <Space>
          <FaHref onClick={() => moveUp(record.id)} icon={<ArrowUpOutlined />} />
          <FaHref onClick={() => moveDown(record.id)} icon={<ArrowDownOutlined />} />
          <RbacMenuModal title="编辑菜单" record={record.sourceData} fetchFinish={refreshData}>
            <FaHref icon={<EditOutlined />} text="编辑" />
          </RbacMenuModal>
          <AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} />
        </Space>
      ),
      width: 180,
      fixed: 'right',
    },
  ];

  const loadingTree = loadingEffect[rbacMenuApi.getUrl('allTree')];
  return (
    <div className="faber-full-content faber-flex-column">
      <Space style={{ margin: 12 }}>
        <Button onClick={refreshData} loading={loadingTree}>刷新</Button>
        <RbacMenuModal title="新增菜单" fetchFinish={refreshData}>
          <Button type="primary" icon={<PlusOutlined />}>新增菜单</Button>
        </RbacMenuModal>
        <Button danger onClick={handleBatchDelete} loading={loadingTree} disabled={selectedRowKeys.length === 0} icon={<DeleteOutlined />}>删除</Button>
      </Space>

      <FaFlexRestLayout>
        <Table
          rowKey="id"
          dataSource={tree}
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRows.map(i => i.id))
            },
            checkStrictly: false,
          }}
          pagination={false}
          loading={loadingTree}
          scroll={{ y: document.body.clientHeight - 181 }}
        />
      </FaFlexRestLayout>
    </div>
  )
}
