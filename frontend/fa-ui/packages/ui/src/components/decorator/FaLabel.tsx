import React, { CSSProperties } from 'react';
import './FaLabel.css'


export interface FaLabelProps {
  title: string;
  barColor?: string;
  className?: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
  block?: boolean; // 是否块式
  extra?: React.ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2021/6/16
 */
export default function FaLabel({ title, barColor = 'var(--primary-color)', className, style, textStyle, block, extra }: FaLabelProps) {
  return (
    <div className={className ? ['fa-flex-row-center', className].join(' ') : 'fa-flex-row-center'}>
      <div
        className="fa-label"
        style={{
          // display: block ? 'flex' : 'inline-flex',
          // alignItems: 'center',
          // padding: '4px 12px',
          // borderLeft: `4px solid ${barColor}`,
          // backgroundColor: 'var(--fa-bg-color)',
          ...style,
        }}
      >
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--fa-text-color)', ...textStyle }}>{title}</div>
      </div>
      <div className="fa-flex-1" />
      <div>
        {extra}
      </div>
    </div>
  );
}
