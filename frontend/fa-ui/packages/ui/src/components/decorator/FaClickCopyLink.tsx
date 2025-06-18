import React, { ReactNode } from 'react';
import { handleClipboard } from "@ui/utils/utils";


export interface FaClickCopyLinkProps {
  children?: string|ReactNode;
  copyText: string;
}

/**
 * @author xu.pengfei
 * @date 2023/3/21 9:50
 */
export default function FaClickCopyLink({children, copyText}: FaClickCopyLinkProps) {
  return (
    <a onClick={() => handleClipboard(copyText)}>{children || copyText}</a>
  )
}