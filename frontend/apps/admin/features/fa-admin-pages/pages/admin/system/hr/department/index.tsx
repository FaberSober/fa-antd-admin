import React, { useEffect, useState } from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { AuthDelBtn, type Fa, FaHref, FaUtils, useApiLoading, useDelete } from '@fa/ui';
import { departmentApi } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import { Button, Form, Input, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { SearchGrid } from '@/components';
import DepartmentModal from '../user/modal/DepartmentModal';

const serviceName = '部门';

type DepartmentRow = Admin.DepartmentVo & {
  hasChildren: boolean;
  children?: DepartmentRow[];
};

const departmentTypeMap: Record<string, { text: string; color: string }> = {
  CORP: { text: '公司', color: 'blue' },
  DEPT: { text: '部门', color: 'green' },
  TEAM: { text: '小组', color: 'orange' },
};

function parseRows(nodes: Fa.TreeNode<Admin.DepartmentVo, string>[] = []): DepartmentRow[] {
  return nodes.map((node) => {
    const children = node.hasChildren ? parseRows(node.children || []) : undefined;
    return {
      ...node.sourceData,
      id: node.sourceData?.id || node.id,
      parentId: node.sourceData?.parentId || node.parentId,
      name: node.sourceData?.name || node.name,
      hasChildren: node.hasChildren,
      children,
    };
  });
}

function collectKeys(rows: DepartmentRow[]): React.Key[] {
  return rows.reduce<React.Key[]>((keys, row) => {
    keys.push(row.id);
    if (row.children && row.children.length > 0) {
      keys.push(...collectKeys(row.children));
    }
    return keys;
  }, []);
}

/**
 * 部门管理
 * @author xu.pengfei
 * @date 2026-04-28 11:36:29
 */
export default function DepartmentManage() {
  const [form] = Form.useForm();
  const [query, setQuery] = useState<Record<string, any>>({});
  const [treeData, setTreeData] = useState<DepartmentRow[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const loading = useApiLoading([
    departmentApi.getUrl('getTree'),
    departmentApi.getUrl('remove'),
    departmentApi.getUrl('moveUp'),
    departmentApi.getUrl('moveDown'),
  ]);

  const [handleDelete] = useDelete<string>(departmentApi.remove, fetchTreeData, serviceName);

  useEffect(() => {
    fetchTreeData();
  }, [query]);

  function fetchTreeData() {
    departmentApi.getTree({ query }).then((res) => {
      const rows = parseRows(res.data || []);
      setTreeData(rows);
      setExpandedRowKeys(collectKeys(rows));
    });
  }

  function handleSearch(values: Record<string, any>) {
    setQuery(values);
  }

  function handleReset() {
    form.resetFields();
    setQuery({});
  }

  function handleMove(id: string, direction: 'up' | 'down') {
    const request = direction === 'up' ? departmentApi.moveUp(id) : departmentApi.moveDown(id);
    request.then((res) => {
      FaUtils.showResponse(res, direction === 'up' ? '上移部门' : '下移部门');
      fetchTreeData();
    });
  }

  const columns: TableProps<DepartmentRow>['columns'] = [
    {
      title: '部门名称',
      dataIndex: 'name',
      width: 260,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (value) => {
        const type = departmentTypeMap[value] || { text: value || '-', color: 'default' };
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
    {
      title: '负责人',
      dataIndex: ['manager', 'name'],
      width: 140,
      render: (_, record) => record.manager?.name || record.managerId || '-',
    },
    {
      title: '排序',
      dataIndex: 'sortId',
      width: 90,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'crtTime',
      width: 170,
    },
    {
      title: '更新时间',
      dataIndex: 'updTime',
      width: 170,
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: 320,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <DepartmentModal title="新增子部门" parentId={record.id} fetchFinish={fetchTreeData}>
            <FaHref icon={<PlusOutlined />} text="新增子部门" />
          </DepartmentModal>
          <DepartmentModal title="编辑部门" record={record} fetchFinish={fetchTreeData}>
            <FaHref icon={<EditOutlined />} text="编辑" />
          </DepartmentModal>
          <FaHref icon={<ArrowUpOutlined />} text="上移" onClick={() => handleMove(record.id, 'up')} />
          <FaHref icon={<ArrowDownOutlined />} text="下移" onClick={() => handleMove(record.id, 'down')} />
          <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fa-full-content fa-flex-column fa-p12 fa-bg-white">
      <SearchGrid
        form={form}
        onFinish={handleSearch}
        btns={(
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchTreeData}>
              刷新
            </Button>
            <DepartmentModal title="新增部门" parentId={0} fetchFinish={fetchTreeData}>
              <Button type="primary" icon={<PlusOutlined />}>
                新增部门
              </Button>
            </DepartmentModal>
          </Space>
        )}
        defaultCount={2}
        className="fa-mb12"
      >
        <Form.Item name="name" label="部门名称">
          <Input placeholder="请输入部门名称" allowClear />
        </Form.Item>
        <Form.Item name="managerId" label="负责人ID">
          <Input placeholder="请输入负责人ID" allowClear />
        </Form.Item>
      </SearchGrid>

      <Table<DepartmentRow>
        rowKey="id"
        columns={columns}
        dataSource={treeData}
        loading={loading}
        pagination={false}
        size="middle"
        scroll={{ x: 1200 }}
        expandable={{
          expandedRowKeys,
          rowExpandable: (record) => record.hasChildren,
          onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
        }}
      />
    </div>
  );
}
