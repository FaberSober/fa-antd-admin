import React, { CSSProperties, ReactNode } from 'react';

export interface SegmentTitleProps {
  title: string;
  style?: CSSProperties;
  extra?: ReactNode;
  ribbonColor?: string;
}

/**
 * @author xu.pengfei
 * @date 2021/4/21
 */
export default function SegmentTitle({ title, style, extra, ribbonColor = '#1890FF', ...props }: SegmentTitleProps) {
  return (
    <div
      style={{
        fontSize: '20px',
        fontWeight: 500,
        borderLeft: `4px solid ${ribbonColor}`,
        color: 'var(--fa-text-color)',
        paddingLeft: 12,
        marginTop: 12,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        // width: '100%',
        ...style,
      }}
      {...props}
    >
      {title}
      {extra}
    </div>
  );
}
