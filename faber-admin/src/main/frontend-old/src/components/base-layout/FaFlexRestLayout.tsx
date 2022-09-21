import React from 'react';

/**
 * @author xu.pengfei
 * @date 2021/11/29 14:48
 */
export default function FaFlexRestLayout({ children, style }:any) {
  return (
    <div className="fa-flex-1">
      <div className="faber-full-content-no-padding" style={{ overflowY: 'auto', ...style }}>
        {children}
      </div>
    </div>
  )
}

