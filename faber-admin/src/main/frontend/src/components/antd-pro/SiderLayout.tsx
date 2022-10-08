import React, {ReactNode} from 'react';
import {DoubleLeftOutlined, DoubleRightOutlined} from '@ant-design/icons';
import {FaFlexRestLayout} from "@/components/base-layout";
import './SiderLayout.less';

interface IProps {
  collapse?: boolean; // 是否折叠
  onCollapse?: (collapse: boolean) => void;
  width?: number; // 展开宽度
  collapseWidth?: number; // 折叠宽度
  children?: ReactNode;
}

export default function SiderLayout({ collapse = false, width = 200, collapseWidth = 44, onCollapse, children }: IProps) {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', borderRight: '1px solid #eee', width: collapse ? collapseWidth : width }}>
      <FaFlexRestLayout style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </FaFlexRestLayout>

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
