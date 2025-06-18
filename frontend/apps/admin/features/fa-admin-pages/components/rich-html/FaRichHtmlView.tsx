import React, { useState } from 'react';
import { FaUtils } from '@fa/ui';
import './docview.scss';
import FaRichHtmlImgPreview from './FaRichHtmlImgPreview';

export interface FaRichHtmlViewProps {
  html: string;
}

/**
 * 富文本html渲染。
 * 1. 提取文本图片，增加点击放大预览功能；
 * @author xu.pengfei
 * @date 2024/1/30 14:39
 */
export default function FaRichHtmlView({ html }: FaRichHtmlViewProps) {
  const [id] = useState(FaUtils.uuid());

  return (
    <div className="fa-rich-html-view">
      <div id={id} dangerouslySetInnerHTML={{ __html: html }} />

      {/* img 图片预览 */}
      <FaRichHtmlImgPreview domId={id} />
    </div>
  );
}
