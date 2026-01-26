import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { DownloadOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, FaberTable, FaHref, useDelete, useTableQueryParams } from '@fa/ui';
import { Button, Form, Input, Space } from 'antd';
import { each } from 'lodash';
import React from 'react';
import FlowFormAdd from './cube/FlowFormAdd';

export interface FlowFormDataTableProps {
  flowForm: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-19 14:27:05
 */
export default function FlowFormDataTable({ flowForm }: FlowFormDataTableProps) {
  const [form] = Form.useForm();

  const {queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps} =
    useTableQueryParams<any>(flowFormApi.pageFormData, { flowFormId: flowForm.id }, flowForm.name);

  const [handleDelete] = useDelete<number>((id) => flowFormApi.removeFormDataById(flowForm.id, id), fetchPageList, flowForm.name);
  // const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams);

  function genColumns() {
    const { sorter } = queryParams;
    const columns = [
      BaseTableUtils.genIndexColumn(paginationProps),
    ] as FaberTable.ColumnsProp<any>[];

    each(flowForm.tableConfig.table.columns, col => {
      if ('date' === col.dataType) {
        columns.push(BaseTableUtils.genDateSorterColumn(col.label || col.field, col.field, col.width, sorter))
      } else if ('datetime' === col.dataType) {
        columns.push(BaseTableUtils.genTimeSorterColumn(col.label || col.field, col.field, col.width, sorter))
      } else {
        columns.push(BaseTableUtils.genSimpleSorterColumn(col.label || col.field, col.field, col.width, sorter))
      }
    })

    columns.push(
      // BaseTableUtils.genTimeSorterColumn('创建时间', 'crtTime', 170, sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, r) => (
          <Space>
            <FaHref text='查看' icon={<EyeOutlined />} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    );

    return columns;
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{flowForm.name}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            {flowForm.tableConfig?.query?.columns?.map(col => {
              return (
                <Form.Item name={col.field} label={col.label} key={col.field}>
                  <Input placeholder={`请输入${col.label}`} allowClear />
                </Form.Item>
              )
            })}

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>查询</Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              {flowForm.flowProcessId && (<FlowFormAdd flowForm={flowForm} onSuccess={fetchPageList} />)}
              {/* <Button icon={<DownloadOutlined />}>导出</Button> */}
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        rowKey="id"
        biz={flowForm.no}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        // batchDelete={(ids) => api.removeBatchByIds(ids)}
        // onSceneChange={(v) => setSceneId(v)}
        // onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}
