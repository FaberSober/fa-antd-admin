import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Space } from 'antd';
import React, { useState } from 'react';
import './SearchGrid.scss';

export interface SearchGridProps<Values = any> extends FormProps<Values> {
  children?: React.ReactNode;
  btns?: React.ReactNode;
  /** 默认展示多少个 Form.Item */
  defaultCount?: number;
  /** 每个 Form.Item 的最小宽度 */
  minItemWidth?: number;
}

/**
 * 适配表格顶部的搜索组件
 * @author xu.pengfei
 * @date 2025-11-13 10:19:01
 */
export default function SearchGrid({ children, btns, defaultCount = 3, minItemWidth = 240, style, className, ...props }: SearchGridProps) {
  const [expand, setExpand] = useState(false);

  // 将 children 转换为数组，方便 slice
  const childArray = React.Children.toArray(children);

  // 控制显示数量
  const visibleChildren = expand ? childArray : childArray.slice(0, defaultCount);

  return (
    <Form className={`fa-search-grid fa-form-m0 ${className || ''}`} style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`, ...style }} labelCol={{ span: 8 }} {...props}>
      {visibleChildren}

      <div
        style={{
          // gridColumn: `${grid} / span 1`,
          // justifySelf: 'end', // 让按钮区域靠右
        }}
      >
        <Space>
          {btns}
          {childArray.length > defaultCount && (
            <Button type="link" onClick={() => setExpand(!expand)}>
              {expand ? (
                <span>
                  收起 <UpOutlined />
                </span>
              ) : (
                <span>
                  展开 <DownOutlined />
                </span>
              )}
            </Button>
          )}
        </Space>
      </div>
    </Form>
  );
}
