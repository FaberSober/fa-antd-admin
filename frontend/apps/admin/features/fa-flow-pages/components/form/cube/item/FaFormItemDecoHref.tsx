import { Flow } from '@features/fa-flow-pages/types';
import React, { CSSProperties, useMemo } from 'react';

export interface FaFormItemDecoHrefProps {
  formItem: Flow.FlowFormItem
}

/**
 * deco_href链接展示
 * @author xu.pengfei
 * @date 2026-01-26 15:58:00
 */
export default function FaFormItemDecoHref({ formItem }: FaFormItemDecoHrefProps) {
  const style: CSSProperties = useMemo(() => {
    const baseStyle: CSSProperties = {};

    // 行高
    if (formItem.deco_lineHeight) {
      baseStyle.lineHeight = formItem.deco_lineHeight;
    }

    // 字体大小
    if (formItem.deco_fontSize) {
      baseStyle.fontSize = `${formItem.deco_fontSize}px`;
    }

    // 对齐方式
    if (formItem.deco_textAlign) {
      baseStyle.textAlign = formItem.deco_textAlign;
    }

    // 字体颜色
    if (formItem.deco_color) {
      baseStyle.color = formItem.deco_color;
    }

    // 是否加粗
    if (formItem.deco_fontWeight) {
      baseStyle.fontWeight = 'bold';
    }

    // 是否斜体
    if (formItem.deco_fontStyle) {
      baseStyle.fontStyle = 'italic';
    }

    // 下划线样式
    if (formItem.deco_textDecoration) {
      baseStyle.textDecoration = formItem.deco_textDecoration;
    }

    return baseStyle;
  }, [
    formItem.deco_lineHeight,
    formItem.deco_fontSize,
    formItem.deco_textAlign,
    formItem.deco_color,
    formItem.deco_fontWeight,
    formItem.deco_fontStyle,
    formItem.deco_textDecoration,
  ]);

  // 如果没有内容，显示占位文本
  const displayContent = formItem.content || '请输入链接文本';
  const href = formItem.deco_href || '#';

  return (
    <div style={{ textAlign: formItem.deco_textAlign || 'left' }}>
      <a href={href} style={style} target="_blank" rel="noopener noreferrer">
        {displayContent}
      </a>
    </div>
  );
}
