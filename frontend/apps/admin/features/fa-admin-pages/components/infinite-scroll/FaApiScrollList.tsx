import React, { CSSProperties, forwardRef, useEffect, useId, useImperativeHandle, useState } from 'react';
import { Button, Divider, Form, Input, Popover, Skeleton } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Fa, FaFlexRestLayout } from '@fa/ui';
import InfiniteScroll from './InfiniteScroll';

export interface FaApiScrollListRef {
  /** 加载更多数据的方法 */
  loadMoreData: (query?: any, pageOut?: number) => void;
  /** 刷新列表数据的方法 */
  refresh: () => void;
}

export interface FaApiScrollListProps<T> {
  /** page分页获取接口 */
  apiPage: (params: Fa.BasePageProps) => Promise<Fa.Ret<Fa.Page<T>>>,
  /** 列表项渲染组件 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 最外层div样式 */
  style?: CSSProperties;
  /** 搜索Input的FormName */
  searchKey?: string;
  /** 高级检索的Form表单 */
  renderFilterFormItems?: () => React.ReactNode;
  /** 排序sorter */
  sorter?: string;
  /** form style */
  formStyle?: CSSProperties;
  /** body div样式 */
  bodyStyle?: CSSProperties;
}

/**
 * 基于page分页接口的滚动列表
 * 1. 默认加载第一页，每页20条数据；
 * 2. 滚动到底部自动加载下一页；
 * @author xu.pengfei
 * @date 2025-08-28 21:39:55
 */
function FaApiScrollListComponent<T>(
  { apiPage, renderItem, style, searchKey = '_search', renderFilterFormItems, sorter = '', formStyle, bodyStyle }: FaApiScrollListProps<T>,
  ref: React.Ref<FaApiScrollListRef>
) {
  const [form] = Form.useForm();

  const id = useId();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Fa.Pagination>();
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);

  function loadMoreData(query?: any, pageOut?: number) {
    if (loading) {
      return;
    }
    setLoading(true);
    const {_search, ...restQuery} = query || {}
    apiPage({
      query: restQuery,
      search: _search,
      current: pageOut ? pageOut : page,
      pageSize: 20,
      sorter,
    }).then(res => {
      if (pageOut && pageOut === 1) {
        setData(res.data.rows)
      } else {
        setData([ ...data, ...res.data.rows ]);
      }
      setPage(page + 1);
      setPagination(res.data.pagination);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  /**
   * 刷新列表数据
   * 触发表单提交，重新加载第一页数据
   */
  function refresh() {
    form.submit();
  }

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    loadMoreData,
    refresh
  }), [data, page, loading]);

  useEffect(() => {
    loadMoreData({}, 1);
  }, [])

  function onFinish(fieldsValue: any) {
    loadMoreData(fieldsValue, 1)
  }

  const defaultStyle: CSSProperties = {
    height: '100%',
    overflow: 'auto',
    // padding: '0 12px',
    // border: '1px solid rgba(140, 140, 140, 0.35)',
  }

  return (
    <div className='fa-flex-column fa-full' style={style}>
      <Form form={form} onFinish={onFinish} className='fa-border-b' style={{ ...formStyle }}>
        <div className='fa-mb12 fa-flex-row-center' style={{gap: 12}}>
          <div className='fa-flex-1'>
            <Form.Item name={searchKey} noStyle style={{width: 'auto'}}>
              <Input.Search loading={loading} onSearch={() => form.submit()} allowClear />
            </Form.Item>
          </div>
          <Popover
            placement='rightTop'
            title='高级筛选'
            content={(
              <div className="fa-form-mb12">
                {renderFilterFormItems && renderFilterFormItems()}
                <div className='fa-flex-row-end' style={{gap: 12}}>
                  <Button onClick={() => form.resetFields()} size='small'>重置</Button>
                  <Button onClick={() => form.submit()} size='small' type='primary'>搜索</Button>
                </div>
              </div>
            )}
            trigger='click'
          >
            <Button icon={<FilterOutlined />} />
          </Popover>
        </div>
      </Form>

      <FaFlexRestLayout>
        <div
          id={id}
          style={{ ...defaultStyle, ...bodyStyle }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={pagination ? pagination.hasNextPage : true}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>数据加载完成～</Divider>}
            scrollableTarget={id}
          >
            {data.map((item, index) => (renderItem(item, index)))}
          </InfiniteScroll>
        </div>
      </FaFlexRestLayout>
    </div>
  );
}

// 使用React.forwardRef包装组件以支持泛型
const FaApiScrollList = React.forwardRef(FaApiScrollListComponent) as <T>(
  props: FaApiScrollListProps<T> & { ref?: React.Ref<FaApiScrollListRef> }
) => React.ReactElement;

export default FaApiScrollList;
