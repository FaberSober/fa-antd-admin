import { flowFormApi as api, generatorApi } from '@/services';
import { Generator } from '@/types';
import { SearchOutlined } from "@ant-design/icons";
import { BaseBizTable, BaseTableUtils, DragModal, DragModalProps, useTableQueryParams, FaberTable, clearForm } from '@fa/ui';
import { Button, Form, Input, Space } from 'antd';
import { useState } from 'react';


export interface FormTableSelectModalProps extends DragModalProps {
  fetchFinish?: (v: {tableName: string, comment: string}) => void;
}

/**
 * FLOW-流程表单实体新增、编辑弹框
 */
export default function FormTableSelectModal({ children, fetchFinish, ...props }: FormTableSelectModalProps) {
  const [open, setOpen] = useState(false);
  const [selItem, setSelItem] = useState<Generator.TableVo>();

  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Generator.TableVo>(generatorApi.pageTable, { sorter: { field: 'createTime', order: 'descend' } }, '数据表');

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('表名', 'tableName', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('表备注', 'tableComment', undefined, sorter),
      BaseTableUtils.genTimeSorterColumn('创建时间', 'createTime', 170, sorter),
    ] as FaberTable.ColumnsProp<Generator.TableVo>[];
  }

  function confirm() {
    setOpen(false)
    if (selItem && fetchFinish) {
      fetchFinish({ tableName: selItem.tableName, comment: selItem.tableComment });
    }
  }

  function showModal() {
    setOpen(true)
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
      </span>
      <DragModal
        title="选择数据表"
        open={open}
        onOk={confirm}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={1000}
        styles={{
          body: { padding: 0 }
        }}
        {...props}
      >
        <div className="fa-full fa-flex-column fa-bg-white" style={{ height: 600 }}>
          <div className="fa-flex-row-center fa-p8">
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
            keyName="tableName"
            biz="system_generator_table"
            columns={genColumns()}
            pagination={paginationProps}
            loading={loading}
            dataSource={list}
            onChange={handleTableChange}
            refreshList={() => fetchPageList()}
            showBatchDelBtn={false}
            showTableColConfigBtn={false}
            rowClickSelected
            rowSelection={{
              type: 'radio',
            }}
            onSelectedRowsChange={(rowKeys, rows) => {
              console.log('onSelectedRowsChange', rowKeys, rows);
              if (rows && rows[0]) {
                setSelItem(rows[0]);
              }
            }}
          />
        </div>
      </DragModal>
    </span>
  )
}
