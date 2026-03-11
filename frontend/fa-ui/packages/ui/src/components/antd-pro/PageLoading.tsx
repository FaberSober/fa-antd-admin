import React, { CSSProperties } from 'react';
import { Spin } from 'antd';

export interface PageLoadingProps {
  style?: CSSProperties;
  tip?: string;
}

export default function PageLoading({ style = {}, tip = "加载中..." }: PageLoadingProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        ...style,
      }}
    >
      <Spin
        size="large"
        tip={tip}
      >
        <div style={{ width: 100, height: 100 }} />
      </Spin>
    </div>
  );
}
