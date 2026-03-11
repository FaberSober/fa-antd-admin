import React, { CSSProperties, ReactNode } from 'react';
import { Tooltip } from 'antd';


export interface FaLinkProps {
  icon?: ReactNode;
  text?: string;
  color?: string;
  onClick?: (e: any) => void;
  style?: CSSProperties;
  disabled?: boolean
  tooltip?: string;
}

/**
 * @author xu.pengfei
 * @date 2022/1/10 11:29
 */
export default function FaHref({ icon, text, onClick, color, style, disabled, tooltip }: FaLinkProps) {
  function handleClick(e: any) {
    if (disabled) return;
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Tooltip title={tooltip}>
      <a onClick={handleClick} style={{ color, ...style }} className={disabled ? 'fa-link-btn-disabled' : 'fa-link-btn'}>
        {icon}
        {text}
      </a>
    </Tooltip>
  );
}
