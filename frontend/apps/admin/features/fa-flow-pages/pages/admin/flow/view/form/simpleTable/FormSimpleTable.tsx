import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, FaberTable, FaHref, useDelete, useTableQueryParams, FaUtils } from '@fa/ui';
import { Button, Form, Input, Space } from 'antd';
import { each } from 'lodash';
import React, { useState } from 'react';
import FormAdd from './cube/FormAdd';
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
  const [viewRecord, setViewRecord] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState<number>(-1);

  const { queryParams, setFormValues, handleTableChange, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<any>(flowFormApi.pageFormData, { flowFormId: flowForm.id }, flowForm.name);

  const [handleDelete] = useDelete<number>((id) => flowFormApi.removeFormDataById(flowForm.id, id), fetchPageList, flowForm.name);

  // 翻页逻辑
  const handlePrev = React.useCallback(() => {
    if (viewIndex > 0) {
      const newIndex = viewIndex - 1;
      setViewIndex(newIndex);
      setViewRecord(list[newIndex]);
    }
  }, [viewIndex, list]);

  const handleNext = React.useCallback(() => {
    if (viewIndex < list.length - 1) {
      const newIndex = viewIndex + 1;
      setViewIndex(newIndex);
      setViewRecord(list[newIndex]);
    }
  }, [viewIndex, list]);

  // 计算边界状态
  const hasPrev = viewIndex > 0;
  const hasNext = viewIndex < list.length - 1;

  function genColumns() {
    const { sorter } = queryParams;
    const columns = [
      BaseTableUtils.genIndexColumn(paginationProps),
    ] as FaberTable.ColumnsProp<any>[];

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

    columns.push(
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, r) => (
          <Space>
            <FaHref text='查看' icon={<EyeOutlined />} onClick={() => {
              const index = list.findIndex((item: any) => item.id === r.id);
              setViewIndex(index);
              setViewRecord(r);
              setViewOpen(true);
            }} />
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
        record={viewRecord} 
        open={viewOpen} 
        onOpenChange={setViewOpen}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}