import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import './CountUser.scss';

export function CountUser() {
  // TODO: 替换为真实接口数据
  const newCount = 2000;
  const totalCount = 120000;

  const formatNum = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="count-card">
      <div className="count-card__header">
        <span className="count-card__title">用户量</span>
      </div>
      <div className="count-card__body">
        <span className="count-card__new-value">{formatNum(newCount)}</span>
        <div className="count-card__icon count-card__icon--user">
          <UserOutlined />
        </div>
      </div>
      <div className="count-card__footer">
        <span className="count-card__footer-label">总用户量</span>
        <span className="count-card__footer-value">{formatNum(totalCount)}</span>
      </div>
    </div>
  );
}

CountUser.displayName = 'CountUser'; // 必须与方法名称一致
CountUser.title = '用户量';
CountUser.description = '总用户量';
CountUser.showTitle = false; // 是否展示Card的Title
CountUser.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
CountUser.w = 6; // 宽度-网格-max=24
CountUser.h = 5; // 高度-每个单位20px
