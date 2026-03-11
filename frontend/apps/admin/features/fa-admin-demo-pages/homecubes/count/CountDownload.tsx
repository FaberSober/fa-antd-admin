import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import './CountDownload.scss';

export function CountDownload() {
  // TODO: 替换为真实接口数据
  const newCount = 1200;
  const totalCount = 56000;

  const formatNum = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="count-card">
      <div className="count-card__header">
        <span className="count-card__title">下载量</span>
      </div>
      <div className="count-card__body">
        <span className="count-card__new-value">{formatNum(newCount)}</span>
        <div className="count-card__icon count-card__icon--download">
          <DownloadOutlined />
        </div>
      </div>
      <div className="count-card__footer">
        <span className="count-card__footer-label">总下载量</span>
        <span className="count-card__footer-value">{formatNum(totalCount)}</span>
      </div>
    </div>
  );
}

CountDownload.displayName = 'CountDownload'; // 必须与方法名称一致
CountDownload.title = '下载量';
CountDownload.description = '总下载量';
CountDownload.showTitle = false; // 是否展示Card的Title
CountDownload.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
CountDownload.w = 6; // 宽度-网格-max=24
CountDownload.h = 5; // 高度-每个单位20px
