import React, { type CSSProperties, type ReactNode } from 'react';
import RGL, { type Layout, type ReactGridLayoutProps, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

export interface FaGridLayoutProps extends ReactGridLayoutProps {
  layout: Layout[];
  renderItem: (item: Layout) => ReactNode;
  itemDivStyle?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2023/1/8 20:42
 */
export function FaGridLayout({ layout, renderItem, itemDivStyle, ...props }: FaGridLayoutProps) {
  return (
    <ReactGridLayout layout={layout} {...props}>
      {layout.map((i) => (
        <div key={i.i} style={{ ...itemDivStyle }}>
          {renderItem(i)}
        </div>
      ))}
    </ReactGridLayout>
  );
}
