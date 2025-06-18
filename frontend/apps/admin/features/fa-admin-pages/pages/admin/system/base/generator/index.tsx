import React from 'react';
import { CodepenOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, type FaberTable, useTableQueryParams } from '@fa/ui';
import { generatorApi } from '@features/fa-admin-pages/services';
import type { Generator } from '@/types';
import GeneratorCodePreview from './cube/GeneratorCodePreview';

const serviceName = '代码生成';
const biz = 'generator';

/**
 * Demo-学生表表格查询
 */
export default function StudentList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Generator.TableVo>(generatorApi.pageTable, { sorter: { field: 'createTime', order: 'descend' } }, serviceName);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('表名', 'tableName', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('表备注', 'tableComment', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('engine', 'engine', 100, sorter),
      BaseTableUtils.genTimeSorterColumn('创建时间', 'createTime', 170, sorter),
      // {
      //   title: '操作',
      //   dataIndex: 'opr',
      //   render: (_, r) => (
      //     <Space>
      //     </Space>
      //   ),
      //   width: 120,
      //   fixed: 'right',
      //   tcRequired: true,
      //   tcType: 'menu',
      // },
    ] as FaberTable.ColumnsProp<Generator.TableVo>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="tableName" label="表名">
              <Input placeholder="请输入表名" allowClear />
            </Form.Item>
            <Form.Item name="tableComment" label="备注">
              <Input placeholder="请输入备注" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        showRowNum
        rowKey="tableName"
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showBatchDelBtn={false}
        renderCheckBtns={(rowKeys) => (
          <Space>
            <BaseDrawer
              triggerDom={
                <Button type="primary" icon={<CodepenOutlined />}>
                  预览代码
                </Button>
              }
              title="预览代码"
              width={document.body.clientWidth - 44}
            >
              <GeneratorCodePreview tableNames={rowKeys} />
            </BaseDrawer>
          </Space>
        )}
      />
    </div>
  );
}
