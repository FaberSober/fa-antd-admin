import React, {useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import { RouteComponentProps } from '@reach/router';
import { DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {Button, Card, Checkbox, Form, Input, Space} from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import modelService from '@/services/admin/element';
import Admin from '@/props/admin';
import ElementModal from '../modal/ElementModal';
import { getSortOrder } from '@/components/base-table/utils';
import { UserContext } from '@/layout/UserSimpleLayout';
import { clearForm, useDelete, useExport, useTableQueryParams } from '@/utils/myHooks';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/base-table';
import MenuManageContext from "@/pages/system/base/menu/context/MenuManageContext";

const serviceName = '权限资源';
const buzzModal = 'base_element';

function ElementList(_: any, ref: any) {
  const { viewBlock, viewMenu } = useContext(MenuManageContext)
  const { user } = useContext(UserContext);
  const addModalRef = useRef<any | null>(null);
  const [form] = Form.useForm();
  const [casQuery, setCasQuery] = useState(false)

  function getExtraParams() {
    return { menuId: casQuery ? undefined : viewMenu?.id, casMenuId: casQuery ? viewMenu?.id : undefined, blockId: viewBlock?.id }
  }

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.ElementWebVO>(modelService.page,
      {
        extraParams: getExtraParams(),
        sorter: { field: 'crtTime', order: 'descend' }
      }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, { ...queryParams, extraParams: getExtraParams() });
  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  useEffect(() => {
    setExtraParams(getExtraParams());
  }, [viewMenu, viewBlock, casQuery]);

  useImperativeHandle(ref, () => ({
    showAddModal: () => {
      addModalRef.current.showModal();
    },
  }));

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.ElementWebVO>[] {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      {
        title: '所属菜单',
        dataIndex: 'menuId',
        sorter: true,
        sortOrder: getSortOrder(sorter, 'menuId'),
        render: (val: number, record: Admin.ElementWebVO) => <span>{record.menu.title}</span>,
        width: 150,
        tcChecked: true,
        tcConditionHide: true,
      },
      BaseTableUtils.genSimpleSorterColumn('资源编码', 'code', 240, sorter),
      BaseTableUtils.genSimpleSorterColumn('资源类型', 'type', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('资源名称', 'name', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('资源路径', 'uri', 200, sorter),
      // BaseTableUtils.genSimpleSorterColumn('父权限ID', 'parentId', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('资源树状检索路径', 'path', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('资源请求类型', 'method', 140, sorter),
      BaseTableUtils.genSimpleSorterColumn('描述', 'description', 200, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.Element) => (
          <Space>
            <ShiroPermissionContainer roleList={user.elements}>
              <ElementModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <a>
                  <EditOutlined />
                  编辑
                </a>
              </ElementModal>
            </ShiroPermissionContainer>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <strong style={{ fontSize: '18px', marginRight: 12 }}>{serviceName}</strong>
          <Checkbox checked={casQuery} onChange={(e) => setCasQuery(e.target.checked)}>级联查询</Checkbox>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="code" label="编码">
              <Input placeholder="请输入编码" />
            </Form.Item>
          </Form>

          <div>
            <Space>
              <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)} loading={loading}>
                重置
              </Button>
              <ShiroPermissionContainer roleList={user.elements}>
                <ElementModal ref={addModalRef} title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </ElementModal>
              </ShiroPermissionContainer>
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
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
      />
    </Card>
  );
}

export default React.forwardRef(ElementList);
