import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { DictEnumApiSelector, Fa } from '@fa/ui';
import { InfiniteScroll } from '@features/fa-admin-pages/components';
import { logApiApi } from '@features/fa-admin-pages/services';
import { Admin } from '@features/fa-admin-pages/types';
import { Button, Divider, Form, Input, List, Popover, Skeleton } from 'antd';
import { useEffect, useId, useState } from 'react';


export default function DemoApiScrollList() {
  const [form] = Form.useForm();
  const id = useId()
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Fa.Pagination>();
  const [data, setData] = useState<Admin.LogApi[]>([]);
  const [page, setPage] = useState(1);

  function loadMoreData(query?: any, pageOut?: number) {
    if (loading) {
      return;
    }
    setLoading(true);
    const {_search, ...restQuery} = query || {}
    logApiApi.page({
      query: restQuery,
      search: _search,
      current: pageOut ? pageOut : page,
      pageSize: 20,
      sorter: 'id DESC'
    }).then(res => {
      if (pageOut && pageOut === 1) {
        setData(res.data.rows)
      } else {
        setData([ ...data, ...res.data.rows ]);
      }
      setPage(pageOut ? pageOut + 1 : page + 1);
      setPagination(res.data.pagination);
      setLoading(false)
    }).catch(() => setLoading(false));
  }

  useEffect(() => {
    loadMoreData({}, 1);
  }, []);

  function onFinish(fieldsValue: any) {
    loadMoreData(fieldsValue, 1)
  }

  return (
    <div className='fa-full-content fa-flex-column' style={{width: 400}}>
      <Form form={form} onFinish={onFinish}>
        <div className='fa-mb12 fa-mt12 fa-flex-row-center' style={{gap: 12}}>
          <div className='fa-flex-1'>
            <Form.Item name="_search" noStyle style={{width: 'auto'}}>
              <Input.Search loading={loading} onSearch={() => form.submit()} allowClear />
            </Form.Item>
          </div>
          <Button icon={<ReloadOutlined />} loading={loading} />
          <Popover
            placement='rightTop'
            title='高级筛选'
            content={(
              <div>
                <Form.Item name="crud" label="类型">
                  <DictEnumApiSelector enumName="LogCrudEnum" allowClear />
                </Form.Item>
                <Form.Item name="biz" label="模块">
                  <Input placeholder="请输入模块" allowClear />
                </Form.Item>
                <Form.Item name="opr" label="操作">
                  <Input placeholder="请输入操作" allowClear />
                </Form.Item>
                <Form.Item name="url" label="URL">
                  <Input placeholder="请输入请求URL" allowClear />
                </Form.Item>
              </div>
            )}
          >
            <Button icon={<FilterOutlined />} />
          </Popover>
        </div>
      </Form>
      <div
        id={id}
        style={{
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={pagination ? pagination.hasNextPage : true}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>数据加载完成～</Divider>}
          scrollableTarget={id}
        >
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.biz + " / " + item.opr}
                  description={item.crtName + " / " + item.crtTime}
                />
                {/* <div>
                  {item.url}
                </div> */}
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}
