import React from 'react';
import { handleClipboard } from '@/utils/utils';
import { LinkOutlined } from '@ant-design/icons';
import styles from './styles/FaLink.module.scss';

export interface FaLinkProps {
  link: string;
  text: string;
}

/**
 * @author xu.pengfei
 * @date 2022/1/10 11:29
 */
export default function FaLink({ link, text }: FaLinkProps) {
  return (
    <span>
      <a className={styles['fa-link']} href={link} target="_blank">
        {text}
      </a>
      <a onClick={() => handleClipboard(link)} style={{ marginLeft: 4 }}>
        <LinkOutlined />
      </a>
    </span>
  );
}
