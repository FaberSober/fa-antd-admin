import React, { HTMLAttributes } from 'react';

/**
 * @author xu.pengfei
 * @date 2021/11/29 14:48
 */
export default function FaFlexRestLayout({ children, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="fa-flex-1">
      <div className="fa-full-content" style={{ overflowY: 'auto', ...style }} {...props}>
        {children}
      </div>
    </div>
  );
}
