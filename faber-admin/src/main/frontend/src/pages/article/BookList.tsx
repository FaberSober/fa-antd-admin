import React, { useContext, useEffect } from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import { DownloadOutlined, EditOutlined, EyeOutlined, FireOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Image, Input, Space } from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/biz/base-table';
import modelService from '@/services/article/book';
import Article from '@/props/article';
import BookModal from './modal/BookModal';
import { UserContext } from '@/layout/UserSimpleLayout';
import { clearForm, useDelete, useExport, useTableQueryParams } from '@/utils/myHooks';

const serviceName = '文章-书本';
const buzzModal = 'article_book';

interface BookListProps extends RouteComponentProps {
  bizType: Article.BookBizType;
}

export default function BookList({ bizType, uri }: BookListProps) {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();

  const {
    queryParams,
    setFormValues,
    handleTableChange,
    setSceneId,
    setConditionList,
    setExtraParams,
    fetchPageList,
    loading,
    list,
    paginationProps,
  } = useTableQueryParams<Article.Book>(modelService.page, { extraParams: { bizType } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, { ...queryParams, extraParams: { bizType } });
  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  useEffect(() => setExtraParams({ bizType }), [bizType]);

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Article.Book>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('书名', 'name', 200, sorter),
      // BaseTableUtils.genSimpleSorterColumn('业务类型', 'bizType', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('业务ID', 'bizId', 100, sorter),
      {
        title: 'cover',
        dataIndex: 'cover',
        tcChecked: true,
        width: 120,
        tcConditionHide: true,
        render: (val) => <Image width={100} src={val} />,
      },
      BaseTableUtils.genSimpleSorterColumn('描述', 'description', 300, sorter),
      BaseTableUtils.genSimpleSorterColumn('是否发布', 'pub', 100, sorter),
      BaseTableUtils.genDateSorterColumn('发布时间', 'pubTime', 160, sorter, 'YYYY-MM-DD HH:mm'),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Article.Book) => (
          <Space>
            <a style={{ display: 'none' }}>
              <EyeOutlined />
              发布
            </a>
            <Link to={`${uri}/${record.id}`}>
              <FireOutlined />
              编写
            </Link>
            <ShiroPermissionContainer roleList={user.elements}>
              <BookModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList} bizType={bizType}>
                <a>
                  <EditOutlined />
                  编辑
                </a>
              </BookModal>
            </ShiroPermissionContainer>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} elements={user.elements} permission={undefined} />
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
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="书名">
              <Input placeholder="请输入书名" />
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
                <BookModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false} bizType={bizType}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </BookModal>
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
        batchDelete={(ids) => modelService.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </Card>
  );
}
