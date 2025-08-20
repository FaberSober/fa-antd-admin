import React from 'react';
import { CloseOutlined } from "@ant-design/icons";
import { FaUtils } from "@fa/ui";


export interface NodeCloseBtnProps {
  onClick?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025/8/20 11:37
 */
export default function NodeCloseBtn({ onClick }: NodeCloseBtnProps) {

  return (
    <div
      className="close fa-link-btn"
      onClick={(e) => {
        FaUtils.preventEvent(e)
        if (onClick) onClick();
      }}
    >
      <CloseOutlined/>
    </div>
  )
}
