import React, { CSSProperties } from 'react';
import {SITE_INFO} from "@/configs/server.config";

export interface FaLabelProps {
  title: string;
  barColor?: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2021/6/16
 */
export default function FaLabel({ title, barColor, style, textStyle }: FaLabelProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderLeft: `4px solid ${barColor || SITE_INFO.PRIMARY_COLOR}`,
        backgroundColor: '#FFF',
        ...style,
      }}
    >
      <div style={{ fontSize: '15px', fontWeight: 600, ...textStyle }}>{title}</div>
    </div>
  );
}
