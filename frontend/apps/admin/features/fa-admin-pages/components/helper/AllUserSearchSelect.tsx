import React, { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
  BaseBizTable,
  BaseTableUtils,
  clearForm,
  DragModal,
  FaFlexRestLayout,
  FaLabel,
  type FaberTable,
  useTableQueryParams,
} from '@fa/ui';
import type { Admin } from '@/types';
import { userApi } from '@features/fa-admin-pages/services';
import { Button, Col, Form, Input, Row, Select, type SelectProps, Space, Table } from 'antd';
import { get, remove } from 'lodash';
import { useDebounce } from 'react-use';

interface SelectedUser {
  id: string;
  allowRemove?: boolean;
}

export interface AllUserSearchSelectProps extends Omit<SelectProps, 'onChange'> {
  labelKey?: string | ((record: Admin.User) => string | ReactNode);
  valueKey?: string | ((record: Admin.User) => string);
  value?: any;
  onChange?: (v: any, option?: any) => void;
  bodyStyle?: CSSProperties;
}

function parseLabel(data: Admin.User, labelKey: AllUserSearchSelectProps['labelKey']) {
  if (labelKey instanceof Function) {
    return labelKey(data);
  }
  return get(data, labelKey || 'name');
}

function parseValue(data: Admin.User, valueKey: AllUserSearchSelectProps['valueKey']) {
  if (valueKey instanceof Function) {
    return valueKey(data);
  }
  return get(data, valueKey || 'id');
}

function SelectedAllUserList({ selectedUsers, onRemove }: { selectedUsers?: SelectedUser[]; onRemove?: (item: Admin.User) => void }) {
  const [array, setArray] = useState<Admin.User[]>([]);

  useEffect(() => {
    if (!selectedUsers || selectedUsers.length === 0) {
      setArray([]);
      return;
    }

    userApi.getByIds(selectedUsers.map((i) => i.id)).then((res) => setArray(res.data || []));
  }, [selectedUsers]);

  const disallowRemoveUserIds = (selectedUsers || []).filter((i) => !i.allowRemove).map((i) => i.id);
  return (
    <Table
      rowKey="id"
      columns={[
        { dataIndex: 'username', title: '账户', width: 110 },
        { dataIndex: 'name', title: '姓名' },
        {
          title: '操作',
          dataIndex: 'opr',
          render: (_, record) => (
            <Space>
              {disallowRemoveUserIds.indexOf(record.id) === -1 && (
                <Button onClick={() => onRemove?.(record)} type="dashed" size="small" danger>
                  删除
                </Button>
              )}
            </Space>
          ),
          width: 80,
          fixed: 'right',
        },
      ]}
      dataSource={array}
      pagination={false}
      size="small"
    />
  );
}

function AllUserSelectModal({
  children,
  selectedUsers,
  multiple,
  onChange,
}: {
  children: ReactNode;
  selectedUsers?: SelectedUser[];
  multiple?: boolean;
  onChange?: (v: SelectedUser[], callback: () => void, error?: any) => void;
}) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [innerUsers, setInnerUsers] = useState<SelectedUser[]>(selectedUsers || []);

  useEffect(() => {
    setInnerUsers(selectedUsers || []);
  }, [selectedUsers]);

  const { queryParams, setFormValues, handleTableChange, fetchPageList, loading, list, paginationProps } = useTableQueryParams<Admin.UserWeb>(
    userApi.pageSuper,
    { sorter: { field: 'crtTime', order: 'descend' } },
    '用户',
  );

  function handleAdd(item: Admin.UserWeb) {
    if (innerUsers.some((i) => i.id === item.id)) {
      return;
    }
    const newSel = { id: item.id, allowRemove: true };
    setInnerUsers(multiple ? [...innerUsers, newSel] : [newSel]);
  }

  function handleRemove(item: Admin.User) {
    setInnerUsers(innerUsers.filter((i) => i.id !== item.id));
  }

  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('账户', 'username', 140, sorter),
      BaseTableUtils.genSimpleSorterColumn('姓名', 'name', 130, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('部门', 'departmentId', 160, sorter),
        render: (_, r) => r.departmentName,
      },
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            {innerUsers.map((i) => i.id).indexOf(record.id) === -1 && (
              <Button type="dashed" size="small" onClick={() => handleAdd(record)}>
                添加
              </Button>
            )}
          </Space>
        ),
        width: 80,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.UserWeb>[];
  }

  function handleConfirm() {
    if (!onChange) {
      return;
    }
    setConfirmLoading(true);
    onChange(
      innerUsers,
      () => {
        setConfirmLoading(false);
        setOpen(false);
      },
      () => setConfirmLoading(false),
    );
  }

  return (
    <span>
      <span onClick={() => setOpen(true)}>{children}</span>
      <DragModal title="选择用户" open={open} onOk={handleConfirm} confirmLoading={confirmLoading} onCancel={() => setOpen(false)} width={1100}>
        <Row className="fa-flex-row" style={{ height: 600 }} gutter={12}>
          <Col md={17}>
            <div className="fa-full fa-flex-column">
              <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="fa-mb12">
                <Form form={form} layout="inline" onFinish={setFormValues}>
                  <Form.Item name="name" label="姓名">
                    <Input placeholder="请输入姓名" />
                  </Form.Item>
                  <Form.Item name="username" label="账户">
                    <Input placeholder="请输入账户" />
                  </Form.Item>
                </Form>

                <Space>
                  <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button onClick={() => clearForm(form)} loading={loading}>
                    重置
                  </Button>
                </Space>
              </div>

              <BaseBizTable
                biz="AllUserList-Search"
                columns={genColumns()}
                pagination={{ ...paginationProps, size: 'small' }}
                loading={loading}
                dataSource={list}
                rowKey={(item) => item.id}
                onChange={handleTableChange}
                refreshList={() => fetchPageList()}
                batchDelete={(ids) => userApi.removeBatchByIds(ids)}
                showComplexQuery={false}
                showBatchDelBtn={false}
                showTableColConfigBtn={false}
                showCheckbox={false}
                showTopDiv={false}
              />
            </div>
          </Col>

          <Col md={7} className="fa-flex-column" style={{ height: '100%' }}>
            <FaLabel title="已选择" className="fa-mb12" />
            <FaFlexRestLayout>
              <SelectedAllUserList selectedUsers={innerUsers} onRemove={handleRemove} />
            </FaFlexRestLayout>
          </Col>
        </Row>
      </DragModal>
    </span>
  );
}

export default function AllUserSearchSelect({
  labelKey = 'name',
  valueKey = 'id',
  value,
  onChange,
  bodyStyle,
  ...props
}: AllUserSearchSelectProps) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [array, setArray] = useState<any[]>([]);
  const [innerUsers, setInnerUsers] = useState<SelectedUser[]>([]);
  const multiple = props.mode === 'multiple';

  useEffect(() => {
    if (multiple) {
      if (!value || value.length === 0) {
        searchNow();
        setInnerUsers([]);
      } else {
        updateValue(value);
        setInnerUsers(value.map((i: string) => ({ id: i, allowRemove: true })));
      }
      return;
    }

    if (value === undefined || value === null || value === '') {
      searchNow();
      setInnerUsers([]);
      onChange?.(undefined);
    } else {
      updateValue(value);
      setInnerUsers([{ id: value, allowRemove: true }]);
    }
  }, [value]);

  function updateValue(outValue: any) {
    if (outValue === undefined || outValue === null || outValue === '') {
      return;
    }
    if (multiple) {
      userApi.getByIds(outValue).then((res) => {
        const newList = (res.data || []).map((d) => ({
          label: parseLabel(d, labelKey),
          value: parseValue(d, valueKey),
        }));

        userApi
          .pageSuper({ current: 1, pageSize: 20, query: { name: search } })
          .then((res1) => {
            const newListAdd = (res1.data.rows || []).map((c) => ({
              label: parseLabel(c, labelKey),
              value: parseValue(c, valueKey),
            }));
            const newListValues = newList.map((v1) => v1.value);
            remove(newListAdd, (v) => newListValues.indexOf(v.value) > -1);
            setArray([...newList, ...newListAdd]);
          })
          .catch(() => setArray(newList));
      });
    } else {
      userApi.getById(outValue).then((res) => {
        const newList = [{ label: parseLabel(res.data, labelKey), value: parseValue(res.data, valueKey) }];
        setArray(newList);
      });
    }
  }

  function searchNow() {
    setLoading(true);
    userApi
      .pageSuper({ current: 1, pageSize: 20, query: { name: search } })
      .then((res) => {
        const newList = (res.data.rows || []).map((c) => ({
          label: parseLabel(c, labelKey),
          value: parseValue(c, valueKey),
        }));
        setArray(newList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useDebounce(
    () => {
      searchNow();
    },
    500,
    [search],
  );

  function handleValueChange(v: any, item: any) {
    onChange?.(v, item);
    if (search !== '') {
      setSearch('');
    }
  }

  function handleAddUsers(users: SelectedUser[], callback: () => void) {
    if (multiple) {
      onChange?.(
        users.map((i) => i.id),
        users,
      );
    } else if (users && users[0]) {
      onChange?.(users[0].id, users[0]);
    } else {
      onChange?.(undefined, undefined);
    }
    callback();
  }

  return (
    <Space.Compact block style={bodyStyle}>
      <Select
        showSearch
        allowClear
        defaultActiveFirstOption={false}
        filterOption={false}
        searchValue={search}
        onSearch={(v) => {
          setLoading(true);
          setSearch(v);
        }}
        notFoundContent={null}
        placeholder="请输入员工名称进行搜索"
        options={array}
        value={value}
        loading={loading}
        style={{ minWidth: 138 }}
        onChange={handleValueChange}
        {...props}
      />
      <AllUserSelectModal onChange={handleAddUsers} selectedUsers={innerUsers} multiple={multiple}>
        <Button icon={<SearchOutlined />} />
      </AllUserSelectModal>
    </Space.Compact>
  );
}
