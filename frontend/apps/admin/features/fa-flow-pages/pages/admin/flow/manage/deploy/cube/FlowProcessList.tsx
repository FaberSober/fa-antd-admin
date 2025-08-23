import React, { useEffect } from 'react';
import { DownloadOutlined, EyeOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, FaberTable, FaHref, useDelete, useDeleteByQuery, useExport, useTableQueryParams } from '@fa/ui';
import { CommonExcelUploadModal } from "@/components";
import { flowProcessApi as api } from '@/services';
import { Flow } from '@/types';
import FlowProcessModal from '../modal/FlowProcessModal';

const serviceName = '流程定义';
const biz = 'flow_process';

interface FlowProcessListProps {
  catagoryId?: number;
}

/**
 * FLOW-流程定义表格查询
 */
export default function FlowProcessList({ catagoryId }: FlowProcessListProps) {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
          useTableQueryParams<Flow.FlowProcess>(api.page, { extraParams: {catagoryId} }, serviceName)

  // Refresh list when catagoryId changes
  useEffect(() => {
    setExtraParams({ catagoryId });
  }, [catagoryId]);

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams)
  const [_, deleteByQuery] = useDeleteByQuery(api.removeByQuery, queryParams, fetchPageList);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('流程分类', 'catagoryId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('流程key', 'processKey', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('流程', 'processName', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('图标', 'processIcon', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('类型', 'processType', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('流程版本', 'processVersion', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('实例地址', 'instanceUrl', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('备注说明', 'remark', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('使用范围', 'useScope', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('流程状态', 'processState', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('流程模型定义JSON内容', 'modelContent', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('排序ID', 'sort', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <BaseDrawer triggerDom={<FaHref text="查看" icon={<EyeOutlined />} />}>
              {/* <FlowProcessView item={r} /> */}
            </BaseDrawer>
            <FlowProcessModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 170,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Flow.FlowProcess>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="_search" label="搜索">
              <Input placeholder="请输入搜索内容" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>查询</Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <FlowProcessModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
              <CommonExcelUploadModal fetchFinish={fetchPageList} apiDownloadTplExcel={api.exportTplExcel} apiImportExcel={api.importExcel} type={biz}>
                <Button icon={<UploadOutlined />}>上传</Button>
              </CommonExcelUploadModal>
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
