import React, { CSSProperties } from 'react';
import { Loading } from 'react-vant';

export interface PageLoadingProps {
  style?: CSSProperties;
}

export default function PageLoading({ style = {} }: PageLoadingProps) {
  return (
    <Loading
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        ...style,
      }}
      type="ball"
      size="large">
      加载中...
    </Loading>
  );
}
