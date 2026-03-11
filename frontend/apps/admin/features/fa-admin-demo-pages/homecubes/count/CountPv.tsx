import React from 'react';
import { EyeOutlined } from '@ant-design/icons';
import './CountPv.scss';

export function CountPv() {
  // TODO: 替换为真实接口数据
  const newCount = 5800;
  const totalCount = 980000;

  const formatNum = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="count-card">
      <div className="count-card__header">
        <span className="count-card__title">访问量</span>
      </div>
      <div className="count-card__body">
        <span className="count-card__new-value">{formatNum(newCount)}</span>
        <div className="count-card__icon count-card__icon--pv">
          <EyeOutlined />
        </div>
      </div>
      <div className="count-card__footer">
        <span className="count-card__footer-label">总访问量</span>
        <span className="count-card__footer-value">{formatNum(totalCount)}</span>
      </div>
    </div>
  );
}

CountPv.displayName = 'CountPv'; // 必须与方法名称一致
CountPv.title = '访问量';
CountPv.description = '总访问量';
CountPv.showTitle = false; // 是否展示Card的Title
CountPv.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
CountPv.w = 6; // 宽度-网格-max=24
CountPv.h = 5; // 高度-每个单位20px
