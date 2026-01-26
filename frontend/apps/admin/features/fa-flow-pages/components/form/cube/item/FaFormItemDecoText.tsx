import { Flow } from '@features/fa-flow-pages/types';
import React, { CSSProperties, useMemo } from 'react';

export interface FaFormItemDecoTextProps {
  formItem: Flow.FlowFormItem
}

/**
 * deco_text文本展示
 * @author xu.pengfei
 * @date 2026-01-26 15:42:59
 */
export default function FaFormItemDecoText({ formItem }: FaFormItemDecoTextProps) {
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
  const displayContent = formItem.content || '请输入文本内容';

  return (
    <div style={style}>
      {displayContent}
    </div>
  );
}