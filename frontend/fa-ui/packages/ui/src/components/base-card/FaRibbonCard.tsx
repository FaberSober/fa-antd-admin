import React, { CSSProperties, ReactNode } from 'react';
import './FaRibbonCard.css'


export interface FaRibbonCardProps {
  title: string;
  ribbonColor?: string;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  children: ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2023/5/4 15:38
 */
export default function FaRibbonCard({title, ribbonColor, style, titleStyle, bodyStyle, children}: FaRibbonCardProps) {
  return (
    <div className="fa-ribbon-card" style={style}>
      <div className="fa-ribbon-card-title-div" style={{ background: ribbonColor, ...titleStyle }}>
        <div className="fa-ribbon-card-title">
          {title}
        </div>
      </div>
      <div className="fa-ribbon-card-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  )
}