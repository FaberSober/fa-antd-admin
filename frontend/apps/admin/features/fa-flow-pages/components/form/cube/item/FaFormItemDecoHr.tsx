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
    if (formItem.deco_hrColor) {
      baseStyle.borderTopColor = formItem.deco_hrColor;
    }

    // 分割线粗细
    if (formItem.deco_hrThickness) {
      baseStyle.borderTopWidth = `${formItem.deco_hrThickness}px`;
    }

    // 分割线样式
    if (formItem.deco_hrStyle) {
      baseStyle.borderTopStyle = formItem.deco_hrStyle;
    }

    // 上边距
    if (formItem.deco_hrMarginTop !== undefined) {
      baseStyle.marginTop = `${formItem.deco_hrMarginTop}px`;
    }

    // 下边距
    if (formItem.deco_hrMarginBottom !== undefined) {
      baseStyle.marginBottom = `${formItem.deco_hrMarginBottom}px`;
    }

    return baseStyle;
  }, [
    formItem.deco_hrColor,
    formItem.deco_hrThickness,
    formItem.deco_hrStyle,
    formItem.deco_hrMarginTop,
    formItem.deco_hrMarginBottom,
  ]);

  return <hr style={style} />;
}
