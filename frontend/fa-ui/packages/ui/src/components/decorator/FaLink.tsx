import React from 'react';
import { handleClipboard } from '@ui/utils/utils';
import { LinkOutlined } from '@ant-design/icons';
import './FaLink.css';

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
      <a className="fa-link" href={link} target="_blank">
        {text}
      </a>
      <a onClick={() => handleClipboard(link)} style={{ marginLeft: 4 }}>
        <LinkOutlined />
      </a>
    </span>
  );
}
