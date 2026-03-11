import React, { type CSSProperties, type ReactNode } from 'react';
import { type LayoutItem, type GridLayoutProps, ReactGridLayout, useContainerWidth, verticalCompactor, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


export interface FaGridLayoutProps extends Omit<GridLayoutProps, 'children' | 'layout' | 'width'> {
  layout: Layout;
  renderItem: (item: LayoutItem, index: number) => ReactNode;
  itemDivStyle?: CSSProperties;
  isDraggable?: boolean;
  isResizable?: boolean;
  rowHeight?: number;
  cols?: number;
  width?: number;
  containerStyle?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2023/1/8 20:42
 */
export function FaGridLayout({ layout, renderItem, itemDivStyle, width: outWidth, gridConfig, isDraggable, isResizable, dragConfig, resizeConfig, rowHeight = 20, cols = 24, containerStyle, ...props }: FaGridLayoutProps) {
  const { width, containerRef, mounted } = useContainerWidth();

  return (
    <div ref={containerRef as any} style={containerStyle}>
      {mounted && (
        <ReactGridLayout
          width={width}
          layout={layout}
          compactor={verticalCompactor}
          gridConfig={{
            cols: cols,
            rowHeight: rowHeight,
            containerPadding: [0, 0],
            ...gridConfig,
          }}
          dragConfig={{
            enabled: isDraggable ?? true,             // 是否启用拖拽（默认 true）
            // handle: '.drag-handle',    // 只允许匹配该 CSS 选择器的元素触发拖拽（等同旧版 draggableHandle）
            cancel: '.no-drag',        // 匹配该 CSS 选择器的元素及其子元素不会触发拖拽（等同旧版 draggableCancel）
            // bounded: true,          // 可选：限制拖拽边界在容器内
            ...dragConfig,
          }}
          resizeConfig={{
            enabled: isResizable ?? true,          // 是否启用调整大小（默认 true）
            // handles: ['se'],      // 可选：调整大小的控制点位置，默认四角和边中点都有
            // minWidth: 10,        // 可选：调整大小的最小宽度
            // minHeight: 10,       // 可选：调整大小的最小高度
            // maxWidth: 1000,     // 可选：调整大小的最大宽度
            // maxHeight: 1000,    // 可选：调整大小的最大高度
            // bounded: true,      // 可选：限制调整大小边界在容器内
            ...resizeConfig,
          }}
          {...props}
        >
          {layout.map((item, index) => (
            <div key={item.i} style={{ ...itemDivStyle }}>
              {renderItem(item, index)}
            </div>
          ))}
        </ReactGridLayout>
      )}
    </div>
  );
}
