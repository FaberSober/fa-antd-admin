import React, { createContext, useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { PageLoading } from '@/components/antd-pro';
import { PageHeader } from 'antd';
import bookService from '@/services/article/book';
import outlineService from '@/services/article/outline';
import Article from '@/props/article';
import { RES_CODE } from '@/configs/server.config';
import SplitPane from 'react-split-pane';
import BaseTree from '@/components/base-tree';
import OutlineModal from './modal/OutlineModal';
import { Helmet } from 'react-helmet-async';
import OutlineDetailEdit from './cube/OutlineDetailEdit';
import BaseTreeProps from "@/components/base-tree/interface";

export interface BookEditContextProps {
  bookId?: number; // 书本ID
}

export const BookEditContext = createContext<BookEditContextProps>({});

export interface BookEditProps extends RouteComponentProps {
  bookId?: number; // 设备ID
}

/**
 * 书本编辑界面
 * @author xu.pengfei
 * @date 2020/12/31
 */
export default function BookEdit({ bookId, uri }: BookEditProps) {
  const [book, setBook] = useState<Article.Book>();
  const [viewRecord, setViewRecord] = useState<Article.Outline>();

  useEffect(() => {
    if (bookId !== undefined) {
      bookService.findOne(bookId).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          setBook(res.data);
        }
      });
    }
  }, [bookId]);

  /** 点击选中tree节点的事件，这里可以获取点击节点的属性 */
  function onTreeSelect(keys: any[], event: any) {
    if (keys && keys[0]) {
      // 0为根节点
      if (`${keys[0]}` === '0') {
        setViewRecord(undefined);
      } else {
        outlineService.findOne(keys[0]).then((res) => {
          if (res && res.status === RES_CODE.OK) {
            setViewRecord(res.data);
          }
        });
      }
    }
  }

  function onAfterDelItem(item: BaseTreeProps.TreeNode) {
    if (viewRecord && item.value === viewRecord.id) {
      setViewRecord(undefined);
    }
  }

  if (bookId === undefined) return <PageLoading />;

  return (
    <BookEditContext.Provider value={{ bookId }}>
      <Helmet title={`编辑 - ${book?.name}`} />

      <div className="faber-full-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <PageHeader ghost={false} onBack={() => navigate(uri ? uri.substring(0, uri?.lastIndexOf('/')) : '/')} title={`编辑书籍 | ${book?.name}`} />

        <div style={{ flex: 1, position: 'relative', marginTop: 12 }}>
          <SplitPane split="vertical" minSize={50} defaultSize={240}>
            {/* 左侧面板 */}
            <BaseTree
              // showRoot
              showOprBtn
              onSelect={onTreeSelect}
              onAfterDelItem={onAfterDelItem}
              // 自定义配置
              serviceName="文章"
              ServiceModal={OutlineModal}
              serviceApi={{
                ...outlineService,
                allTree: () => outlineService.allBookIdTree(bookId),
              }}
            />

            <OutlineDetailEdit outlineId={viewRecord?.id} />
          </SplitPane>
        </div>
      </div>
    </BookEditContext.Provider>
  );
}
