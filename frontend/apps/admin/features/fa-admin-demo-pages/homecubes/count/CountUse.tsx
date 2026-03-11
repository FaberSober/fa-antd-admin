import React from 'react';
import { ThunderboltOutlined } from '@ant-design/icons';
import './CountUse.scss';

export function CountUse() {
  // TODO: 替换为真实接口数据
  const newCount = 3400;
  const totalCount = 210000;

  const formatNum = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="count-card">
      <div className="count-card__header">
        <span className="count-card__title">使用量</span>
      </div>
      <div className="count-card__body">
        <span className="count-card__new-value">{formatNum(newCount)}</span>
        <div className="count-card__icon count-card__icon--use">
          <ThunderboltOutlined />
        </div>
      </div>
      <div className="count-card__footer">
        <span className="count-card__footer-label">总使用量</span>
        <span className="count-card__footer-value">{formatNum(totalCount)}</span>
      </div>
    </div>
  );
}

CountUse.displayName = 'CountUse'; // 必须与方法名称一致
CountUse.title = '使用量';
CountUse.description = '总使用量';
CountUse.showTitle = false; // 是否展示Card的Title
CountUse.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
CountUse.w = 6; // 宽度-网格-max=24
CountUse.h = 5; // 高度-每个单位20px
