import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import { DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space } from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/biz/base-table';
import modelService from '@/services/admin/area';
import Admin from '@/props/admin';
import AreaModal from './modal/AreaModal';
import { UserContext } from '@/layout/UserSimpleLayout';
import { clearForm, useDelete, useExport, useTableQueryParams } from '@/utils/myHooks';

const serviceName = '中国行政地区表';
const buzzModal = 'base_area';

export default function AreaList(props: RouteComponentProps) {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.Area>(modelService.page, { sorter: { field: 'areaCode', order: 'ascend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(modelService.logicDeleteById, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.Area>[] {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('名称', 'name', 150, sorter),
      BaseTableUtils.genDictSorterColumn('层级', 'level', 70, sorter, dicts, 'common_area_level'),
      BaseTableUtils.genSimpleSorterColumn('父级行政代码', 'parentCode', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('行政代码', 'areaCode', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('邮政编码', 'zipCode', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('区号', 'cityCode', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('简称', 'shortName', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('组合名', 'mergerName', 250, sorter),
      BaseTableUtils.genSimpleSorterColumn('拼音', 'pinyin', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('经度', 'lng', 120, sorter),
      BaseTableUtils.genSimpleSorterColumn('纬度', 'lat', 120, sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.Area) => (
          <Space>
            <ShiroPermissionContainer roleList={user.elements}>
              <AreaModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <a>
                  <EditOutlined />
                  编辑
                </a>
              </AreaModal>
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
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" />
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
                <AreaModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </AreaModal>
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
        batchDelete={(ids) => modelService.batchLogicDelete(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        scrollY={document.body.clientHeight - 275}
      />
    </Card>
  );
}
