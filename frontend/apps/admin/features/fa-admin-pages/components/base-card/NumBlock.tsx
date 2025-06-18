import React, { type CSSProperties, type ReactNode } from 'react';
import './NumBlock.scss';

export interface NumBlockProps {
  title: string | ReactNode;
  value: number;
  unit?: string;
  titleStyle?: CSSProperties;
  valueStyle?: CSSProperties;
  unitStyle?: CSSProperties;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2023/6/5 21:24
 */
export default function NumBlock({ title, value, unit, titleStyle, valueStyle, unitStyle, style }: NumBlockProps) {
  return (
    <div className="fa-num-block-div" style={style}>
      <div className="fa-num-block-title" style={titleStyle}>
        {title}
      </div>
      <div className="fa-flex-row fa-num-block-value-div">
        <div className="fa-num-block-value" style={valueStyle}>
          {value}
        </div>
        <div className="fa-num-block-unit" style={unitStyle}>
          {unit}
        </div>
      </div>
    </div>
  );
}
