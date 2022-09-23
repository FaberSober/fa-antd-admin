import React, { ReactNode, useContext } from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import './Sider.less';
import { UserMenuContext } from '@/layout/UserMenuLayout';

interface IProps {
  collapse?: boolean; // 是否折叠
  onCollapse?: (collapse: boolean) => void;
  width?: number; // 展开宽度
  collapseWidth?: number; // 折叠宽度
  children?: ReactNode | Element;
}

const Sider = ({ collapse = false, width = 200, collapseWidth = 44, onCollapse, children }: IProps) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: collapse ? collapseWidth : width }}>
      {children}
      <div
        className="sider-toggle-div-dark"
        style={{ width: collapse ? collapseWidth : width }}
        onClick={() => onCollapse && onCollapse(!collapse)}
      >
        {collapse ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
      </div>
    </div>
  );
};

export default Sider;
