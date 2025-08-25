import React from "react";
import {
  CloseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FormOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import {
  AuthDelBtn,
  BaseBizTable,
  BaseDrawer,
  BaseTableUtils,
  clearForm,
  FaberTable,
  FaDateUtils,
  FaHref,
  useDelete,
  useDeleteByQuery,
  useExport,
  useTableQueryParams,
} from "@fa/ui";
import { CommonExcelUploadModal } from "@/components";
import { flwHisInstanceApi as api } from "@/services";
import { Flow, FlwEnums } from "@/types";
import FlowInstanceView from "../components/FlowInstanceView";

const serviceName = "历史流程实例表";
const biz = "flw_his_instance";

/**
 * 历史流程实例表表格查询
 */
export default function FlwHisInstanceList() {
  const [form] = Form.useForm();

  const {
    queryParams,
    setFormValues,
    handleTableChange,
    setSceneId,
    setConditionList,
    fetchPageList,
    loading,
    list,
    paginationProps,
  } = useTableQueryParams<Flow.FlwHisInstance>(api.page, {}, serviceName);

  const [handleDelete] = useDelete<string>(
    api.remove,
    fetchPageList,
    serviceName
  );
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams);
  const [_, deleteByQuery] = useDeleteByQuery(
    api.removeByQuery,
    queryParams,
    fetchPageList
  );

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIndexColumn(paginationProps),
      // BaseTableUtils.genIdColumn("主键ID", "id", 70, sorter),

      BaseTableUtils.genSimpleSorterColumn(
        "流程名称",
        "processName",
        200,
        sorter
      ),
      BaseTableUtils.genSimpleSorterColumn(
        "任务名称",
        "currentNodeName",
        undefined,
        sorter
      ),
      {
        ...BaseTableUtils.genSimpleSorterColumn(
          "实例状态",
          "instanceState",
          100,
          sorter
        ),
        render: (v) => FlwEnums.InstanceStateEnumMap[v as FlwEnums.InstanceStateEnum] || v,
      },
      BaseTableUtils.genSimpleSorterColumn("创建人", "createBy", 100, sorter),
      BaseTableUtils.genSimpleSorterColumn(
        "期望完成时间",
        "expireTime",
        170,
        sorter
      ),
      BaseTableUtils.genSimpleSorterColumn(
        "创建时间",
        "createTime",
        170,
        sorter
      ),
      BaseTableUtils.genSimpleSorterColumn("结束时间", "endTime", 170, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn("处理耗时", "duration", 140, sorter),
        render: (v) => v ? FaDateUtils.formatDuration(Math.floor(v / 1000)) : null,
      },
      {
        title: "操作",
        dataIndex: "menu",
        render: (_, r) => (
          <Space>
            <BaseDrawer
              triggerDom={<FaHref tooltip="查看流程" icon={<EyeOutlined />} />}
              width={1000}
            >
              <FlowInstanceView instance={r} />
            </BaseDrawer>

            <FaHref tooltip="查看变量" icon={<FormOutlined />} />
            <FaHref
              tooltip="作废流程"
              icon={<CloseCircleOutlined />}
              color="gold"
            />

            <AuthDelBtn handleDelete={() => handleDelete(r.id)} text="" />
          </Space>
        ),
        width: 120,
        fixed: "right",
        tcRequired: true,
        tcType: "menu",
      },
    ] as FaberTable.ColumnsProp<Flow.FlwHisInstance>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          padding: 8,
        }}
      >
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="_search" label="搜索">
              <Input placeholder="请输入搜索内容" allowClear />
            </Form.Item>

            <Space>
              <Button
                htmlType="submit"
                loading={loading}
                icon={<SearchOutlined />}
              >
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <Button
                loading={exporting}
                icon={<DownloadOutlined />}
                onClick={fetchExportExcel}
              >
                导出
              </Button>
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
