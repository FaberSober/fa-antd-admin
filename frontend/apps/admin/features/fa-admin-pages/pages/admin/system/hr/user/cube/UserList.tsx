import React, { useEffect } from 'react';
import { get } from 'lodash';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Form, Input, Space } from 'antd';
import {
  AuthDelBtn,
  BaseBizTable,
  BaseTableUtils,
  clearForm,
  DictEnumApiSelector,
  type FaberTable,
  useDelete,
  useExport,
  useTableQueryParams,
  useViewItem,
} from '@fa/ui';
import { type Admin, FaEnums } from '@/types';
import { userApi } from '@features/fa-admin-pages/services';
import UserModal from '../modal/UserModal';
import UsersChangeDeptModal from './modal/UsersChangeDeptModal';
import UsersChangeRoleModal from './modal/UsersChangeRoleModal';
import UsersChangePwdModal from './modal/UsersChangePwdModal';
import UserView from './cube/UserView';
import UserStatusCol from './cube/UserStatusCol';
import DepartmentCascade from '@features/fa-admin-pages/components/helper/DepartmentCascade';

const serviceName = '';
const biz = 'UserList-v3';

interface IProps {
  departmentId?: string;
}

export default function UserList({ departmentId }: IProps) {
  const [form] = Form.useForm();

  const {
    queryParams,
    setFormValues,
    handleTableChange,
    setSceneId,
    setConditionList,
    setExtraParams,
    fetchPageList,
    loading,
    list,
    setList,
    dicts,
    paginationProps,
  } = useTableQueryParams<Admin.UserWeb>(
    userApi.page,
    { extraParams: { departmentIdSuper: departmentId }, sorter: { field: 'crtTime', order: 'descend' } },
    serviceName,
  );

  const [exporting, fetchExportExcel] = useExport(userApi.exportExcel, {
    ...queryParams,
    extraParams: { departmentIdSuper: departmentId },
  });
  const [handleDelete] = useDelete<string>(userApi.remove, fetchPageList, serviceName);
  const { show, hide, open, item } = useViewItem<Admin.User>(); // 查看记录

  useEffect(() => setExtraParams({ departmentIdSuper: departmentId }), [departmentId]);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('ID', 'id', 340, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('手机号', 'tel', 120, sorter),
      BaseTableUtils.genSimpleSorterColumn('账户', 'username', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('姓名', 'name', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('角色', 'roleNames', undefined, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('部门', 'departmentId', 200, sorter),
        render: (_, record) => record.departmentName,
        tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
          <DepartmentCascade value={value} onChangeWithItem={(v: any, item: any) => callback(v, index, get(item, 'name'))} {...props} />
        ),
      },
      {
        ...BaseTableUtils.genEnumSorterColumn('工作状态', 'workStatus', 100, sorter, dicts),
        render: (_, record) => {
          switch (record.workStatus) {
            case FaEnums.UserWorkStatusEnum.ON_JOB:
              return <Badge status="success" text="在职" />;
            case FaEnums.UserWorkStatusEnum.ASK_LEAVE:
              return <Badge status="warning" text="请假" />;
            case FaEnums.UserWorkStatusEnum.DEPART:
              return <Badge status="error" text="离职" />;
            default:
              return null;
          }
        },
      },
      {
        ...BaseTableUtils.genBoolSorterColumn('账户有效', 'status', 100, sorter),
        render: (_v, r) => (
          <UserStatusCol
            item={r}
            onChange={() => {
              setList(list.map((i) => (i.id === r.id ? { ...i, status: !i.status } : i)));
            }}
          />
        ),
      },
      BaseTableUtils.genDictSorterColumn('性别', 'sex', 100, sorter, dicts, 'common_sex'),
      BaseTableUtils.genTimeSorterColumn('最后在线时间', 'lastOnlineTime', 165, sorter),
      BaseTableUtils.genSimpleSorterColumn('邮箱', 'email', 150, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('地址', 'address', 200, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('描述', 'description', undefined, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('开放平台的唯一标识符', 'wxUnionId', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('微信小程序用户唯一标识', 'wxMaOpenid', 100, sorter, false),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <UserModal editBtn title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.UserWeb>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-p12 fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="tel" label="手机号">
              <Input placeholder="请输入手机号" allowClear />
            </Form.Item>
            <Form.Item name="name" label="姓名">
              <Input placeholder="请输入员工姓名" allowClear />
            </Form.Item>
            <Form.Item name="workStatus" label="工作状态">
              <DictEnumApiSelector enumName="UserWorkStatusEnum" />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <UserModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        rowKey={(item) => item.id}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => userApi.removeBatchByIds(ids)}
        showComplexQuery={false}
        showBatchDelBtn={false}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        renderCheckBtns={(rowKeys) => (
          <Space>
            <UsersChangeDeptModal userIds={rowKeys} fetchFinish={fetchPageList} />
            <UsersChangeRoleModal userIds={rowKeys} fetchFinish={fetchPageList} />
            <UsersChangePwdModal userIds={rowKeys} fetchFinish={fetchPageList} />
          </Space>
        )}
        onRow={(r) => ({ onDoubleClick: () => show(r) })}
      />

      <Drawer title="查看详情" open={open} onClose={hide} width={1000} styles={{ body: { position: 'relative' } }}>
        {open && item && <UserView item={item} />}
      </Drawer>
    </div>
  );
}
