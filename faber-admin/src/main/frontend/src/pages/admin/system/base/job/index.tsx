import React from 'react';
import {
  DownloadOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import {Badge, Button, Card, Form, Input, Popconfirm, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {showResponse} from '@/utils/utils';
import modelService from '@/services/admin/job';
import Admin from '@/props/admin';
import JobModal from './modal/JobModal';
import {clearForm, useDelete, useExport, useTableQueryParams} from '@/utils/myHooks';
import JobLogDrawer from "./jobLog/JobLogDrawer";
import {FaHref} from "@/components/decorator";
import FaberEnums from "@/props/base/FaEnums";

const serviceName = '系统定时任务';
const buzzModal = 'base_job';

export default function JobList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.Job>(modelService.page, { sorter: { field: 'id', order: 'descend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  /** 确定立即执行一次该任务 */
  function handleRunOneTime(id: number) {
    modelService.runOneTime(id).then((res) => showResponse(res, '立即执行任务'));
  }

  /** 任务启停 */
  function handleJobStatus(record: Admin.Job) {
    if (record.status === FaberEnums.BoolEnum.NO) {
      modelService
        .startJob(record.id)
        .then((res) => showResponse(res, '启动任务'))
        .then(() => fetchPageList());
    } else {
      modelService
        .endJob(record.id)
        .then((res) => showResponse(res, '停止任务'))
        .then(() => fetchPageList());
    }
  }

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.Job>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('任务名称', 'jobName', 150, sorter),
        render: (val, record) => (
          <JobLogDrawer jobId={record.id}>
            <a>{val}</a>
          </JobLogDrawer>
        )
      },
      BaseTableUtils.genSimpleSorterColumn('cron表达式', 'cron', 120, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('状态', 'status', 80, sorter),
        render: (val) => (val === FaberEnums.BoolEnum.YES ? <Badge status="processing" text="运作中" /> : <Badge status="default" text="暂停" />),
      },
      BaseTableUtils.genSimpleSorterColumn('任务执行方法', 'clazzPath', 400, sorter),
      BaseTableUtils.genSimpleSorterColumn('任务描述', 'jobDesc', undefined, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.Job) => (
          <Space>
            <Popconfirm title="确定立即执行一次该任务" onConfirm={() => handleRunOneTime(record.id)} getPopupContainer={() => document.body}>
              <FaHref icon={<ThunderboltOutlined />} text="执行" />
            </Popconfirm>
            <Popconfirm title={record.status === FaberEnums.BoolEnum.NO ? '确定启动任务?' : '确定停止任务?'} onConfirm={() => handleJobStatus(record)} getPopupContainer={() => document.body}>
              <a>
                {record.status === FaberEnums.BoolEnum.NO ? (
                  <FaHref icon={<PlayCircleOutlined />} text="启动" />
                ) : (
                  <FaHref icon={<PauseCircleOutlined />} text="停止" />
                )}
              </a>
            </Popconfirm>
            {record.status === FaberEnums.BoolEnum.NO && (
              <JobModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <FaHref icon={<EditOutlined />} text="编辑" />
              </JobModal>
            )}
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} />
          </Space>
        ),
        width: 220,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <div className="fa-full-content fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="jobName" label="任务名称">
              <Input placeholder="请输入任务名称" />
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
              <JobModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                <Button icon={<PlusOutlined />} type="primary">新增</Button>
              </JobModal>
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
        scrollY={document.body.clientHeight - 275}
      />
    </div>
  );
}
