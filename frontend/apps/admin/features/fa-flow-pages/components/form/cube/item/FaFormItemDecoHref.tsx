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
    if (formItem.decoLineHeight) {
      baseStyle.lineHeight = formItem.decoLineHeight;
    }

    // 字体大小
    if (formItem.decoFontSize) {
      baseStyle.fontSize = `${formItem.decoFontSize}px`;
    }

    // 对齐方式
    if (formItem.decoTextAlign) {
      baseStyle.textAlign = formItem.decoTextAlign;
    }

    // 字体颜色
    if (formItem.decoColor) {
      baseStyle.color = formItem.decoColor;
    }

    // 是否加粗
    if (formItem.decoFontWeight) {
      baseStyle.fontWeight = 'bold';
    }

    // 是否斜体
    if (formItem.decoFontStyle) {
      baseStyle.fontStyle = 'italic';
    }

    // 下划线样式
    if (formItem.decoTextDecoration) {
      baseStyle.textDecoration = formItem.decoTextDecoration;
    }

    return baseStyle;
  }, [
    formItem.decoLineHeight,
    formItem.decoFontSize,
    formItem.decoTextAlign,
    formItem.decoColor,
    formItem.decoFontWeight,
    formItem.decoFontStyle,
    formItem.decoTextDecoration,
  ]);

  // 如果没有内容，显示占位文本
  const displayContent = formItem.content || '请输入链接文本';
  const href = formItem.decoHref || '#';

  return (
    <div style={{ textAlign: formItem.decoTextAlign || 'left' }}>
      <a href={href} style={style} target="_blank" rel="noopener noreferrer">
        {displayContent}
      </a>
    </div>
  );
}
