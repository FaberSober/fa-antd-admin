import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Form, Input, Select, Space } from 'antd';
import { UserContext } from '@/layout/UserSimpleLayout';
import FaberBase from '@/props/base/FaberBase';
import modelService from '@/services/admin/msg';
import Admin from '@/props/admin';
import { getValueFromDicts } from '@/components/base-table/utils';
import { clearForm, useTableQueryParams } from '@/utils/myHooks';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/base-table';

const serviceName = '消息';
const buzzModal = 'base_msg';

export default function MsgList(props: RouteComponentProps) {
  const { refreshUnreadCount, user } = useContext(UserContext);
  const [form] = Form.useForm();

  const [batchReading, setBatchReading] = useState(false);

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.MsgPageVo>(
      modelService.page,
      { extraParams: { toUserId: user.id }, sorter: { field: 'crtTime', order: 'descend' } },
      serviceName
    );

  useEffect(() => {
    setExtraParams({ toUserId: user.id });
  }, [user.id]);

  function handleBatchRead(ids: number[]) {
    setBatchReading(true);
    modelService.batchRead({ ids }).then((res) => {
      setBatchReading(false);
      fetchPageList();
      // 全局消息数量刷新
      refreshUnreadCount();
    });
  }

  /** 消息已读 */
  function handleReadOne(id: number) {
    modelService.batchRead({ ids: [id] }).then((res) => {
      fetchPageList();
      // 全局消息数量刷新
      refreshUnreadCount();
    });
  }

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.MsgPageVo>[] {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter, false),
      {
        ...BaseTableUtils.genSimpleSorterColumn('消息内容', 'content', undefined, sorter),
        render: (val, record) => (
          <div>
            <Badge status={record.isRead === FaberBase.TrueOrFalse.TRUE ? 'default' : 'processing'} />
            <span style={{ color: record.isRead === FaberBase.TrueOrFalse.TRUE ? '#999' : '#333' }}>{val}</span>
          </div>
        ),
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('来源用户', 'fromUserId', 100, sorter),
        render: (val, record) => record.fromUser?.name,
      },
      // BaseTableUtils.genSimpleSorterColumn('接收用户', 'toUserId', 100, sorter),
      {
        ...BaseTableUtils.genDictSorterColumn('是否已读', 'isRead', 100, sorter, dicts, 'common.enum.true_or_false'),
        render: (val, record) => (
          <div>
            <Badge status={record.isRead === FaberBase.TrueOrFalse.TRUE ? 'default' : 'processing'} />
            <span style={{ color: record.isRead === FaberBase.TrueOrFalse.TRUE ? '#999' : '#333' }}>{getValueFromDicts(val, dicts, 'isRead')}</span>
          </div>
        ),
      },
      // BaseTableUtils.genSimpleSorterColumn('已读时间', 'readTime', 100, sorter),
      // BaseTableUtils.genDictSorterColumn('业务类型', 'buzzType', 200, sorter, dicts, 'common.msg.buzz_type'),
      // BaseTableUtils.genSimpleSorterColumn('业务ID', 'buzzId', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.MsgPageVo) => (
          <Space>
            {record.isRead !== FaberBase.TrueOrFalse.TRUE && (
              <a onClick={() => handleReadOne(record.id)}>
                <CheckOutlined /> 已读
              </a>
            )}
          </Space>
        ),
        width: 70,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="content" label="消息内容">
                <Input placeholder="请输入消息内容" />
              </Form.Item>
              <Form.Item name="isRead" label="类型">
                <Select allowClear style={{ minWidth: 70 }}>
                  <Select.Option value="0">未读</Select.Option>
                  <Select.Option value="1">已读</Select.Option>
                </Select>
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
        showBatchBelBtn={false}
        showComplexQuery={false}
        renderCheckBtns={(rowKeys) => (
          <Space>
            <Button onClick={() => handleBatchRead(rowKeys)} loading={batchReading}>
              批量已读
            </Button>
          </Space>
        )}
      />
    </Card>
  );
}
