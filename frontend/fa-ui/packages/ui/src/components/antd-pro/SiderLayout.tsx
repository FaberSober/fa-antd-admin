import React, { ReactNode } from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@ui/components/base-layout';
import './SiderLayout.css';

export interface SiderLayoutProps {
  collapse?: boolean; // 是否折叠
  onCollapse?: (collapse: boolean) => void;
  width?: number; // 展开宽度
  collapseWidth?: number; // 折叠宽度
  children?: ReactNode;
}

export default function SiderLayout({
  collapse = false,
  width = 200,
  collapseWidth = 44,
  onCollapse,
  children,
}: SiderLayoutProps) {
  return (
    <div
      className="fa-sider-div"
      style={{
        width: collapse ? collapseWidth : width,
      }}
    >
      <FaFlexRestLayout style={{ overflowY: 'auto', overflowX: 'hidden' }}>{children}</FaFlexRestLayout>

      <div
        className="sider-toggle-div-dark"
        style={{ width: collapse ? collapseWidth - 1 : width - 1 }}
        onClick={() => onCollapse && onCollapse(!collapse)}
      >
        <span style={{fontSize: '16px'}}>{collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
      </div>
    </div>
  );
}
