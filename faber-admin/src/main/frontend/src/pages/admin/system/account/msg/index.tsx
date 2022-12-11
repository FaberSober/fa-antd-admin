import React, {useContext, useEffect} from 'react';
import {CheckOutlined, SearchOutlined} from '@ant-design/icons';
import {Badge, Button, Form, Input, Space} from 'antd';
import modelService from '@/services/admin/msg';
import Admin from '@/props/admin';
import {clearForm, useTableQueryParams} from '@/utils/myHooks';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {UserLayoutContext} from "@/layout/UserLayout";
import {FaHref} from "@/components/decorator";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import {BaseBoolSelector} from "@/components/base-dict";

const serviceName = '消息';
const buzzModal = 'base_msg';

export default function MsgList() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const {user} = useContext(UserLayoutContext)
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.Msg>(
      modelService.page,
      { extraParams: { toUserId: user.id }, sorter: { field: 'crtTime', order: 'descend' } },
      serviceName
    );

  useEffect(() => {
    setExtraParams({ toUserId: user.id });
  }, [user.id]);

  function handleBatchRead(ids: string[]) {
    modelService.batchRead(ids).then((res) => {
      fetchPageList();
      // TODO 全局消息数量刷新
      // refreshUnreadCount();
    });
  }

  /** 消息已读 */
  function handleReadOne(id: string) {
    modelService.batchRead([id]).then((res) => {
      fetchPageList();
      // TODO 全局消息数量刷新
      // refreshUnreadCount();
    });
  }

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.Msg>[] {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter, false),
      {
        ...BaseTableUtils.genSimpleSorterColumn('消息内容', 'content', undefined, sorter),
        render: (val, record) => (
          <div>
            <Badge status={record.isRead ? 'default' : 'processing'} />
            <span style={{ color: record.isRead ? '#999' : '#333' }}>{val}</span>
          </div>
        ),
      },
      BaseTableUtils.genSimpleSorterColumn('来源用户', 'fromUserName', 100, sorter),
      BaseTableUtils.genBoolSorterColumn('是否已读', 'isRead', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.Msg) => (
          <Space>
            {!record.isRead && (
              <FaHref onClick={() => handleReadOne(record.id)} icon={<CheckOutlined />} text="已读" />
            )}
          </Space>
        ),
        width: 70,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.Msg>[];
  }

  const batchReading = loadingEffect[modelService.getUrl('batchRead')]
  return (
    <div className="fa-full-content fa-flex-column">
      <div className="fa-flex-row-center fa-p8">
        <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="content" label="消息内容">
              <Input placeholder="请输入消息内容" />
            </Form.Item>
            <Form.Item name="isRead" label="是否已读">
              <BaseBoolSelector />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
          </Space>
        </div>
      </div>

      <BaseBizTable
        biz={buzzModal}
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
    </div>
  );
}
