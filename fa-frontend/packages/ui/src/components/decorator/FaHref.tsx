import React, { CSSProperties, ReactNode } from 'react';

export interface FaLinkProps {
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2022/1/10 11:29
 */
export default function FaHref({ icon, text, onClick, style }: FaLinkProps) {
  return (
    <a onClick={onClick} style={style}>
      {icon}
      {text}
    </a>
  );
}
