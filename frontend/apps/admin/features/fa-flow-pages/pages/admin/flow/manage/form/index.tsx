import { flowFormApi as api } from '@/services';
import { Flow } from '@/types';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, FaberTable, useDelete, useDeleteByQuery, useExport, useTableQueryParams } from '@fa/ui';
import { Button, Form, Input, Space } from 'antd';
import FlowFormConfigDrawer from './modal/FlowFormConfigDrawer';
import FlowFormModal from './modal/FlowFormModal';
import FlowFormViewDataDrawer from './modal/FlowFormViewDataDrawer';

const serviceName = '流程表单';
const biz = 'flow_form';

/**
 * FLOW-流程表单表格查询
 */
export default function FlowFormList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
          useTableQueryParams<Flow.FlowForm>(api.page, {}, serviceName)

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams)
  const [_, deleteByQuery] = useDeleteByQuery(api.removeByQuery, queryParams, fetchPageList);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('流程分类', 'catagoryId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('名称', 'name', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('编码', 'no', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('表单类型', 'type', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('状态', 'status', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('排序', 'sort', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('图标', 'icon', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('表名', 'tableName', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('备注', 'remark', 200, sorter),
      // BaseTableUtils.genSimpleSorterColumn('表单配置', 'config', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <FlowFormViewDataDrawer item={r} />
            <FlowFormConfigDrawer itemId={r.id} refresh={fetchPageList} />
            <FlowFormModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 240,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Flow.FlowForm>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" allowClear />
            </Form.Item>
            <Form.Item name="no" label="编码">
              <Input placeholder="请输入编码" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>查询</Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <FlowFormModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        rowKey="id"
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => api.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showDeleteByQuery
        onDeleteByQuery={deleteByQuery}
      />
    </div>
  );
}
