import React, {useContext, useEffect, useState} from 'react';
import rbacMenuApi from '@/services/rbac/rbacMenu'
import {FaberBase} from "@/props/base";
import Rbac from '@/props/rbac';
import {Button, Space, Table} from "antd";
import RbacMenuModal from "@/pages/system/base/rbac/menu/modal/RbacMenuModal";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {FaFlexRestLayout} from "@/components/biz/base-layout";
import {TableRowSelection} from "antd/es/table/interface";
import {UserContext} from "@/layout/UserSimpleLayout";
import FaberEnums from "@/props/base/FaberEnums";
import {useDelete} from "@/utils/myHooks";
import {AuthDelBtn, FaHref} from '@/components/biz/decorator'

/**
 * @author xu.pengfei
 * @date 2022/9/19
 */
export default function MenuTreeList() {
  const {loadingEffect} = useContext(UserContext)
  const [tree, setTree] = useState<FaberBase.TreeNode<Rbac.RbacMenu>[]>([])

  const [handleDelete] = useDelete<number>(rbacMenuApi.remove, refreshData, '菜单');

  useEffect(() => {
    refreshData()
  }, [])

  function refreshData() {
    rbacMenuApi.allTree().then((res) => {
      setTree(res.data)
    })
  }

  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<Rbac.RbacMenu> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const columns: ColumnsType<Rbac.RbacMenu> = [
    { title: '名称', dataIndex: 'name', width: 200, },
    {
      title: '菜单等级',
      dataIndex: ['sourceData', 'level'],
      render: (val) => FaberEnums.RbacMenuLevelEnumMap[val],
      width: 120,
    },
    { title: '链接', dataIndex: ['sourceData', 'linkUrl'] },
    {
      title: '操作',
      render: (text: string, record: Rbac.RbacMenu) => (
        <Space>
          <RbacMenuModal title="编辑菜单" record={record} fetchFinish={refreshData}>
            <FaHref icon={<EditOutlined />} text="编辑" />
          </RbacMenuModal>
          <AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} />
        </Space>
      ),
      width: 220,
      fixed: 'right',
    },
  ];

  const loadingTree = loadingEffect[rbacMenuApi.getUrl('allTree')];
  return (
    <div className="faber-full-content faber-flex-column">
      <Space style={{ margin: 12 }}>
        <RbacMenuModal title="新增菜单" fetchFinish={refreshData}>
          <Button type="primary" icon={<PlusOutlined />}>新增菜单</Button>
        </RbacMenuModal>
        <Button onClick={refreshData} loading={loadingTree}>刷新</Button>
      </Space>

      <FaFlexRestLayout>
        <Table
          rowKey="id"
          dataSource={tree}
          columns={columns}
          rowSelection={{ ...rowSelection }}
          pagination={false}
          loading={loadingTree}
        />
      </FaFlexRestLayout>
    </div>
  )
}
