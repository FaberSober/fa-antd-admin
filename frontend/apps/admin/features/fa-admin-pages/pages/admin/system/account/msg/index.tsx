import React, { useContext, useEffect } from 'react';
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Form, Input, Modal, Space } from 'antd';
import {
  ApiEffectLayoutContext,
  BaseBizTable,
  BaseBoolSelector,
  BaseTableUtils,
  clearForm,
  type FaberTable,
  FaHref,
  FaUtils,
  useTableQueryParams,
} from '@fa/ui';
import type { Admin } from '@/types';
import { msgApi } from '@features/fa-admin-pages/services';
import UserLayoutContext from '@features/fa-admin-pages/layout/user/context/UserLayoutContext';

const serviceName = '消息';
const biz = 'base_msg';

export default function MsgList() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { user, refreshUnreadCount } = useContext(UserLayoutContext);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.Msg>(msgApi.page, { extraParams: { toUserId: user.id }, sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  useEffect(() => {
    setExtraParams({ toUserId: user.id });
  }, [user.id]);

  function handleRefreshAll() {
    fetchPageList();
    // 全局消息数量刷新
    refreshUnreadCount();
  }

  function handleBatchRead(ids: string[]) {
    msgApi.batchRead(ids).then(() => {
      handleRefreshAll();
    });
  }

  /** 消息已读 */
  function handleReadOne(id: string) {
    msgApi.batchRead([id]).then(() => {
      handleRefreshAll();
    });
  }

  /** 全部已读 */
  function handleReadAll() {
    Modal.confirm({
      title: '全部已读',
      content: '确认标记全部消息为已读？',
      onOk: () =>
        msgApi.readAll().then((res) => {
          FaUtils.showResponse(res, '标记全部已读');
          handleRefreshAll();
        }),
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
            <Badge status={record.isRead ? 'default' : 'success'} />
            <span style={{ color: record.isRead ? 'var(--fa-text-color-light100)' : 'var(--fa-text-color)', marginLeft: 4 }}>{val}</span>
          </div>
        ),
      },
      BaseTableUtils.genSimpleSorterColumn('来源用户', 'fromUserName', 100, sorter),
      {
        ...BaseTableUtils.genBoolSorterColumn('是否已读', 'isRead', 100, sorter),
        render: (val: any) => (val ? <Badge status="default" text="是" /> : <Badge status="success" text="否" />),
      },
      ...BaseTableUtils.genCtrColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_: string, record: Admin.Msg) => (
          <Space>{!record.isRead && <FaHref onClick={() => handleReadOne(record.id)} icon={<CheckOutlined />} text="已读" />}</Space>
        ),
        width: 70,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.Msg>[];
  }

  const batchReading = loadingEffect[msgApi.getUrl('batchRead')];
  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="content" label="消息内容">
              <Input placeholder="请输入消息内容" allowClear />
            </Form.Item>
            <Form.Item name="isRead" label="是否已读">
              <BaseBoolSelector />
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
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        rowKey={(item) => item.id}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => msgApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showBatchDelBtn={false}
        showComplexQuery={false}
        renderCheckBtns={(rowKeys) => (
          <Space>
            <Button onClick={() => handleBatchRead(rowKeys)} loading={batchReading}>
              批量已读
            </Button>
          </Space>
        )}
        querySuffix={<Button onClick={handleReadAll}>全部已读</Button>}
      />
    </div>
  );
}
