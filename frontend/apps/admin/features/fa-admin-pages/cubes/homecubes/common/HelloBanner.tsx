import React, { useContext, useState } from 'react';
import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { FaUtils } from '@fa/ui';
import { useInterval } from 'ahooks';
import './HelloBanner.scss';

export type HelloBannerProps = {};

export function HelloBanner() {
  const { user } = useContext(UserLayoutContext);
  const [time, setTime] = useState(FaUtils.getCurDateTime());

  useInterval(() => {
    setTime(FaUtils.getCurDateTime());
  }, 1000);

  return (
    <div className="fa-full fa-p12 fa-admin-hello-banner">
      <div style={{ fontSize: '18px', fontWeight: 600 }} className="fa-mb12">
        欢迎，{user.name}.
      </div>
      <div>{time}</div>
    </div>
  );
}

HelloBanner.displayName = 'HelloBanner'; // 必须与方法名称一致
HelloBanner.title = '欢迎';
HelloBanner.description = '欢迎组件';
HelloBanner.showTitle = false; // 是否展示Card的Title
HelloBanner.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
HelloBanner.w = 16; // 宽度-网格-max=16
HelloBanner.h = 3; // 高度-每个单位20px
