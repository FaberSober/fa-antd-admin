import { Flow } from '@features/fa-flow-pages/types';
import React, { CSSProperties, useMemo } from 'react';

export interface FaFormItemDecoHrProps {
  formItem: Flow.FlowFormItem
}

/**
 * deco_hr水平分割线展示
 * @author xu.pengfei
 * @date 2026-01-26 16:07:00
 */
export default function FaFormItemDecoHr({ formItem }: FaFormItemDecoHrProps) {
  const style: CSSProperties = useMemo(() => {
    const baseStyle: CSSProperties = {
      border: 'none',
      borderTop: '1px solid #d9d9d9',
      margin: '16px 0',
    };

    // 分割线颜色
    if (formItem.decoHrColor) {
      baseStyle.borderTopColor = formItem.decoHrColor;
    }

    // 分割线粗细
    if (formItem.decoHrThickness) {
      baseStyle.borderTopWidth = `${formItem.decoHrThickness}px`;
    }

    // 分割线样式
    if (formItem.decoHrStyle) {
      baseStyle.borderTopStyle = formItem.decoHrStyle;
    }

    // 上边距
    if (formItem.decoHrMarginTop !== undefined) {
      baseStyle.marginTop = `${formItem.decoHrMarginTop}px`;
    }

    // 下边距
    if (formItem.decoHrMarginBottom !== undefined) {
      baseStyle.marginBottom = `${formItem.decoHrMarginBottom}px`;
    }

    return baseStyle;
  }, [
    formItem.decoHrColor,
    formItem.decoHrThickness,
    formItem.decoHrStyle,
    formItem.decoHrMarginTop,
    formItem.decoHrMarginBottom,
  ]);

  return <hr style={style} />;
}
