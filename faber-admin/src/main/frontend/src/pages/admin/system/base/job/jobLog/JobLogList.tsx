import React, {useContext, useEffect} from 'react';
import {DownloadOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {UserContext} from "@/layout/UserSimpleLayout";
import {clearForm, useDelete, useExport, useTableQueryParams} from "@/utils/myHooks";
import modelService from '@/services/admin/jobLog';
import Admin from '@/props/admin';

const serviceName = '系统定时任务-执行日志';
const buzzModal = 'base_job_log';


export interface JobLogListProps {
  jobId: number;
}

export default function JobLogList({ jobId }: JobLogListProps) {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.JobLog>(modelService.page, { extraParams: { jobId } }, serviceName)

  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams)

  useEffect(() => {
    setExtraParams({ jobId })
  }, [jobId])

  /** 生成表格字段List */
  function genColumns():FaberTable.ColumnsProp<Admin.JobLog>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('执行时长', 'duration', 100, sorter),
      BaseTableUtils.genTimeSorterColumn('开始时间', 'beginTime', 180, sorter),
      BaseTableUtils.genTimeSorterColumn('结束时间', 'endTime', 180, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('执行结果', 'status', 100, sorter),
        render: (val, record) => <span>{Admin.JOB_LOG_STATUS_MAP[record.status]}</span>
      },
      BaseTableUtils.genSimpleSorterColumn('错误日志', 'errMsg', undefined, sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} />
          </Space>
        ),
        width: 80,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="errMsg" label="错误日志">
                <Input placeholder="请输入错误日志" />
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
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
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
        scrollYOccupied={280}
      />
    </div>
  );
}
