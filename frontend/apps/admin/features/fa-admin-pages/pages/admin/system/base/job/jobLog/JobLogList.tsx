import React, { useEffect } from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, type FaberTable, FaEnums, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import type { Admin } from '@/types';
import { jobLogApi } from '@features/fa-admin-pages/services';

const serviceName = '系统定时任务-执行日志';
const biz = 'base_job_log';

export interface JobLogListProps {
  jobId: number;
}

export default function JobLogList({ jobId }: JobLogListProps) {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.JobLog>(jobLogApi.page, { extraParams: { jobId } }, serviceName);

  const [handleDelete] = useDelete<number>(jobLogApi.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(jobLogApi.exportExcel, queryParams);

  useEffect(() => {
    setExtraParams({ jobId });
  }, [jobId]);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('执行时长', 'duration', 100, sorter),
      BaseTableUtils.genTimeSorterColumn('开始时间', 'beginTime', 180, sorter),
      BaseTableUtils.genTimeSorterColumn('结束时间', 'endTime', 180, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('执行结果', 'status', 100, sorter),
        render: (_, record) => <span>{FaEnums.JOB_LOG_STATUS_MAP[record.status]}</span>,
      },
      BaseTableUtils.genSimpleSorterColumn('错误日志', 'errMsg', undefined, sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 80,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.JobLog>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="errMsg" label="错误日志">
              <Input placeholder="请输入错误日志" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
              查询
            </Button>
            <Button onClick={() => clearForm(form)}>重置</Button>
            <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
              导出
            </Button>
          </Space>
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
        batchDelete={(ids) => jobLogApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}
