import React, {useContext, useEffect, useState} from 'react';
import {CheckOutlined, SearchOutlined} from '@ant-design/icons';
import {Badge, Button, Card, Form, Input, Space} from 'antd';
import modelService from '@/services/admin/msg';
import Admin from '@/props/admin';
import {clearForm, useTableQueryParams} from '@/utils/myHooks';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {UserLayoutContext} from "@/layout/UserLayout";
import FaberEnums from "@/props/base/FaberEnums";
import BaseBoolIntSelector from "@/components/base-dict/BaseBoolIntSelector";

const serviceName = '消息';
const buzzModal = 'base_msg';

export default function MsgList() {
  const {user} = useContext(UserLayoutContext)
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
      // TODO 全局消息数量刷新
      // refreshUnreadCount();
    });
  }

  /** 消息已读 */
  function handleReadOne(id: number) {
    modelService.batchRead({ ids: [id] }).then((res) => {
      fetchPageList();
      // TODO 全局消息数量刷新
      // refreshUnreadCount();
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
            <Badge status={record.isRead === FaberEnums.BoolEnum.YES ? 'default' : 'processing'} />
            <span style={{ color: record.isRead === FaberEnums.BoolEnum.YES ? '#999' : '#333' }}>{val}</span>
          </div>
        ),
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('来源用户', 'fromUserId', 100, sorter),
        render: (val, record) => record.fromUser?.name,
      },
      BaseTableUtils.genBoolSorterColumn('是否已读', 'isRead', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.MsgPageVo) => (
          <Space>
            {record.isRead !== FaberEnums.BoolEnum.YES && (
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
                <BaseBoolIntSelector />
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
