import React, {ReactNode} from 'react';
import {handleClipboard} from "@/utils/utils";
import {EditOutlined, LinkOutlined} from "@ant-design/icons";
import styles from './styles/FaLink.module.less'


export interface FaLinkProps {
  icon?: ReactNode;
  text?: string;
}

/**
 * @author xu.pengfei
 * @date 2022/1/10 11:29
 */
export default function FaHref({ icon, text }: FaLinkProps) {
  return (
    <a>{icon}{text}</a>
  )
}
