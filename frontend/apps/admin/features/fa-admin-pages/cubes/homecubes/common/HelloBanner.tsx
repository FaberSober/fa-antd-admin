import React, { useContext, useMemo } from 'react';
import { Avatar } from 'antd';
import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { CloudOutlined } from '@ant-design/icons';
import './HelloBanner.scss';

export type HelloBannerProps = {};

/** 根据当前小时返回问候语 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 12) return '早安';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export function HelloBanner() {
  const { user } = useContext(UserLayoutContext);

  const greeting = useMemo(() => getGreeting(), []);

  // 今日天气（模拟数据，可替换为真实天气 API）
  const weather = '20°C ~ 10°C';

  return (
    <div className="fa-admin-hello-banner">
      {/* 左侧：头像 + 问候语 + 天气 */}
      <div className="fa-admin-hello-banner__left">
        <Avatar
          className="fa-admin-hello-banner__avatar"
          size={66}
          src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />}
        >
          {user.name?.charAt(0)}
        </Avatar>
        <div className="fa-admin-hello-banner__info">
          <div className="fa-admin-hello-banner__title">
            {greeting}，{user.name}，开始您一天的工作吧！
          </div>
          <div className="fa-admin-hello-banner__subtitle">
            <CloudOutlined className="fa-admin-hello-banner__weather-icon" />
            今日{weather}
          </div>
        </div>
      </div>

      {/* 右侧：统计数据 */}
      <div className="fa-admin-hello-banner__stats">
        <div className="fa-admin-hello-banner__stat-item">
          <span className="fa-admin-hello-banner__stat-value">2/10</span>
          <span className="fa-admin-hello-banner__stat-label">待办</span>
        </div>
        <div className="fa-admin-hello-banner__divider" />
        <div className="fa-admin-hello-banner__stat-item">
          <span className="fa-admin-hello-banner__stat-value">8</span>
          <span className="fa-admin-hello-banner__stat-label">笔记</span>
        </div>
        <div className="fa-admin-hello-banner__divider" />
        <div className="fa-admin-hello-banner__stat-item">
          <span className="fa-admin-hello-banner__stat-value">300</span>
          <span className="fa-admin-hello-banner__stat-label">团队</span>
        </div>
      </div>
    </div>
  );
}

HelloBanner.displayName = 'HelloBanner'; // 必须与方法名称一致
HelloBanner.title = '欢迎';
HelloBanner.description = '欢迎组件';
HelloBanner.showTitle = false; // 是否展示Card的Title
HelloBanner.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
HelloBanner.w = 24; // 宽度-网格-max=24
HelloBanner.h = 5; // 高度-每个单位20px
