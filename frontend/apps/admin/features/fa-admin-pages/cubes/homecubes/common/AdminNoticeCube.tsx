import React, { useEffect, useState } from 'react';
import type { Admin } from '@features/fa-admin-pages/types';
import { noticeApi } from '@features/fa-admin-pages/services';
import { BaseDrawer } from '@fa/ui';
import FaRichHtmlView from '@features/fa-admin-pages/components/rich-html/FaRichHtmlView';
import { TitleClickTab } from "@features/fa-admin-pages/components";

export function AdminNoticeCube() {
  const [array, setArray] = useState<Admin.Notice[]>([]);

  useEffect(() => {
    noticeApi.list({ query: { status: true }, sorter: 'ID DESC' }).then((res) => {
      setArray(res.data);
    });
  }, []);

  return (
    <div className="fa-full-content fa-scroll-auto-y">
      {array.map((item) => {
        return (
          <BaseDrawer
            key={item.id}
            title="查看公告详情"
            triggerDom={
              <div className="fa-flex-row fa-link-grey fa-p8 fa-border-b">
                <div style={{ width: 100 }}>{item.crtName}</div>
                <div className="fa-flex-1">{item.title}</div>
                <div className="fa-text-same-width-only" style={{ fontSize: '12px', width: 150 }}>{item.crtTime}</div>
              </div>
            }
          >
            <div className="fa-h1 fa-mb12">{item.title}</div>
            <div className="fa-flex-row-center fa-mb12">
              <div className="fa-mr12">{item.crtName}</div>
              <div>{item.crtTime}</div>
            </div>
            <FaRichHtmlView html={item.content} />
          </BaseDrawer>
        );
      })}
    </div>
  );
}

AdminNoticeCube.displayName = 'AdminNoticeCube'; // 必须与方法名称一致
AdminNoticeCube.title = "公告";
AdminNoticeCube.titleRender = () => <TitleClickTab title="公告" url="/admin/system/base/notice" />;
AdminNoticeCube.description = '展示系统公告信息';
AdminNoticeCube.showTitle = true; // 是否展示Card的Title
AdminNoticeCube.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
AdminNoticeCube.w = 8; // 宽度-max=16
AdminNoticeCube.h = 8; // 高度
