import React, { CSSProperties, ReactNode } from 'react';
import './FaFlashCard.css'


export interface FaFlashCardProps {
  hideTitle?: boolean;
  title?: string;
  extra?: string|ReactNode;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  children: ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2023/5/4 15:38
 */
export default function FaFlashCard({hideTitle = false, title, extra, style, titleStyle, bodyStyle, children}: FaFlashCardProps) {
  return (
    <div className="fa-flash-card" style={style}>
      {!hideTitle && (
        <div className="fa-flash-card-title-div" style={{ ...titleStyle }}>
          <div className="fa-flash-card-flash-bar" />
          <div className="fa-flash-card-title">
            {title}
          </div>
          <div className="fa-flash-card-title-extra">{extra}</div>
        </div>
      )}
      <div className="fa-flash-card-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  )
}