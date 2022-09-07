import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import { DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Image, Input, Space } from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/biz/base-table';
import { UserContext } from '@/layout/UserSimpleLayout';
import modelService from '@/services/admin/notice';
import Admin from '@/props/admin';
import NoticeModal from './modal/NoticeModal';
import { DictDataSelector } from '@/components/biz/base-dict';
import { clearForm, useDelete, useExport, useTableQueryParams } from '@/utils/myHooks';
import { previewImage } from '@/utils/utils';

const serviceName = '通知与公告';
const buzzModal = 'base_notice';

export default function NoticeList(props: RouteComponentProps) {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.Notice>(modelService.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(modelService.logicDeleteById, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.Notice>[] {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('标题', 'title', 200, sorter),
      BaseTableUtils.genSimpleSorterColumn('内容', 'content', 300, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('图片', 'url', 100, sorter),
        sorter: false,
        render: (val) => (val ? <Image src={previewImage(val, 200, 200)} width={70} height={70} preview={{ src: val }} /> : null),
      },
      BaseTableUtils.genDictSorterColumn('有效', 'status', 70, sorter, dicts, 'common.enum.true_or_false'),
      BaseTableUtils.genDictSorterColumn('APP提醒', 'forApp', 100, sorter, dicts, 'common.enum.true_or_false'),
      BaseTableUtils.genDictSorterColumn('强提醒', 'strongNotice', 90, sorter, dicts, 'common.enum.true_or_false'),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.Notice) => (
          <Space>
            <ShiroPermissionContainer roleList={user.elements}>
              <NoticeModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <a>
                  <EditOutlined />
                  编辑
                </a>
              </NoticeModal>
            </ShiroPermissionContainer>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} elements={user.elements} permission={undefined} />
          </Space>
        ),
        width: 120,
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
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="status" label="状态">
              <DictDataSelector dictLabel="common.enum.true_or_false" />
            </Form.Item>
            <Form.Item name="title" label="标题">
              <Input placeholder="请输入标题" />
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
              <ShiroPermissionContainer roleList={user.elements}>
                <NoticeModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </NoticeModal>
              </ShiroPermissionContainer>
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
        batchDelete={(ids) => modelService.batchLogicDelete(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </Card>
  );
}
