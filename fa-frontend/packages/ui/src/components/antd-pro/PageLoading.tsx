import React, { CSSProperties } from 'react';
import { Spin } from 'antd';

export interface PageLoadingProps {
  style?: CSSProperties;
}

export default function PageLoading({ style = {} }: PageLoadingProps) {
  return (
    <Spin
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        ...style,
      }}
      size="large"
      tip="加载中..."
    />
  );
}
