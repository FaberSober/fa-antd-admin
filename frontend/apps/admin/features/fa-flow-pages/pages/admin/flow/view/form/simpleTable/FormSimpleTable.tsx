import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, FaberTable, FaHref, useDelete, useTableQueryParams, FaUtils, useViewItemPro } from '@fa/ui';
import { Button, Form, Input, Space } from 'antd';
import { each } from 'lodash';
import React from 'react';
import FormAdd from './cube/FormAdd';
import FormEdit from './cube/FormEdit';
import FormView from './cube/FormView';

export interface FormSimpleTableProps {
  flowForm: Flow.FlowForm;
}

/**
 * 简单表格：即不包含流程的简单表格，功能如下：
 * 1. 增删改查；
 * 2. 导入导出；
 * @author xu.pengfei
 * @date 2026-02-05 17:29:24
 */
export default function FormSimpleTable({ flowForm }: FormSimpleTableProps) {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<any>(flowFormApi.pageFormData, { flowFormId: flowForm.id }, flowForm.name);

  const viewItem = useViewItemPro<any>(list);
  const editItem = useViewItemPro<any>(list);

  const [handleDelete] = useDelete<number>((id) => flowFormApi.removeFormDataById(flowForm.id, id), fetchPageList, flowForm.name);

  function genColumns() {
    const { sorter } = queryParams;
    const columns = [
      BaseTableUtils.genIndexColumn(paginationProps),
    ] as FaberTable.ColumnsProp<any>[];

    if (flowForm.tableConfig) {
      each(flowForm.tableConfig.table.columns, col => {
        const dataIndex = FaUtils.toHump(col.field);
        if ('date' === col.dataType) {
          columns.push(BaseTableUtils.genDateSorterColumn(col.label || col.field, dataIndex, col.width, sorter))
        } else if ('datetime' === col.dataType) {
          columns.push(BaseTableUtils.genTimeSorterColumn(col.label || col.field, dataIndex, col.width, sorter))
        } else {
          columns.push(BaseTableUtils.genSimpleSorterColumn(col.label || col.field, dataIndex, col.width, sorter))
        }
      })
    }

    columns.push(
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, r) => (
          <Space>
            <FaHref text='查看' icon={<EyeOutlined />} onClick={() => {
              const index = list.findIndex((item: any) => item.id === r.id);
              viewItem.show(r, index);
            }} />
            <FaHref text='编辑' icon={<EditOutlined />} onClick={() => {
              const index = list.findIndex((item: any) => item.id === r.id);
              editItem.show(r, index);
            }} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 180,
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
              <FormAdd flowForm={flowForm} onSuccess={fetchPageList} />
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
      />

      <FormView 
        flowForm={flowForm} 
        record={viewItem.item} 
        open={viewItem.open} 
        onOpenChange={(open) => !open && viewItem.hide()}
        onPrev={viewItem.prev}
        onNext={viewItem.next}
        hasPrev={viewItem.hasPrev}
        hasNext={viewItem.hasNext}
      />

      <FormEdit
        flowForm={flowForm}
        record={editItem.item}
        open={editItem.open}
        onOpenChange={(open) => !open && editItem.hide()}
        onSuccess={fetchPageList}
        onPrev={editItem.prev}
        onNext={editItem.next}
        hasPrev={editItem.hasPrev}
        hasNext={editItem.hasNext}
      />
    </div>
  );
}