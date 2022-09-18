import React, { useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { RouteComponentProps } from '@reach/router';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space } from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/biz/base-table';
import modelService from '@/services/admin/groupUser';
import Admin from '@/props/admin';
import GroupUserModal from '../modal/GroupUserModal';
import { UserContext } from '@/layout/UserSimpleLayout';
import { clearForm, useDelete, useTableQueryParams } from '@/utils/myHooks';

const serviceName = '用户角色';
const buzzModal = 'base_dict_v1';

interface IProps extends RouteComponentProps {
  groupId?: number;
}

function GroupUserList({ groupId }: IProps, ref: any) {
  const { user } = useContext(UserContext);
  const addModalRef = useRef<any | null>(null);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.GroupUserVo>(modelService.groupUserPost, { extraParams: { groupId }, sorter: { field: 'name', order: 'descend' } }, serviceName);

  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  useEffect(() => setExtraParams({ groupId }), [groupId]);

  useImperativeHandle(ref, () => ({
    showAddModal: () => {
      addModalRef.current.showModal();
    },
  }));

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.GroupUserVo>[] {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('姓名', 'name', 200, sorter),
        sorter: false,
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('账户', 'username', 200, sorter),
        sorter: false,
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('电话', 'mobilePhone', 220, sorter),
        sorter: false,
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('描述', 'description', undefined, sorter),
        sorter: false,
      },
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.GroupUserVo) => (
          <Space>
            {groupId && (
              <ShiroPermissionContainer roleList={user.elements}>
                <GroupUserModal groupId={groupId} title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                  <a>
                    <EditOutlined />
                    编辑
                  </a>
                </GroupUserModal>
              </ShiroPermissionContainer>
            )}
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} elements={user.elements} permission={undefined} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item name="mobilePhone" label="手机号">
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Form>
          </div>

          <div>
            <Space>
              <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)} loading={loading}>
                重置
              </Button>
              {groupId && (
                <ShiroPermissionContainer roleList={user.elements}>
                  <GroupUserModal ref={addModalRef} title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false} groupId={groupId}>
                    <Button icon={<PlusOutlined />} type="primary">
                      新增
                    </Button>
                  </GroupUserModal>
                </ShiroPermissionContainer>
              )}
            </Space>
          </div>
        </div>
      </div>

      <BaseBizTable
        buzzModal={buzzModal}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        rowKey={(item) => item.id}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => modelService.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showComplexQuery={false}
      />
    </Card>
  );
}
export default React.forwardRef(GroupUserList);
