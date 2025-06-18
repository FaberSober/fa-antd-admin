import React, { CSSProperties, useCallback } from "react";
import { FaUtils } from "@ui/utils";


let drag = false;
let deltaX = 0;
let startX = 0;
let initWidth = 0;
let dom:HTMLElement|null = null;
let domTransition = '';

export interface FaResizeHorizontalProps {
  domId: string;
  /** handle在拉升组件的左侧还是右侧 */
  position: 'left' | 'right';
  minWidth?: number;
  maxWidth?: number;
  children?: React.ReactNode;
  onWidthChange?: (v:number) => void;
  style?: CSSProperties;
}

/**
 * resize element horizontal
 * @param domId
 * @param position
 * @param minWidth
 * @param maxWidth
 * @param children
 * @constructor
 */
export default function FaResizeHorizontal({ domId, position, minWidth, maxWidth, onWidthChange, style, children }: FaResizeHorizontalProps) {

  const mouseMoveListener:any = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!drag) return;
    e.preventDefault();
    e.stopPropagation();
    // console.log('onMouseMove', e)
    deltaX = (e.clientX - startX);
    if (position === 'left') { // 在组件左侧，取负值
      deltaX = -deltaX;
    }
    let width = initWidth + deltaX;
    if (minWidth && width < minWidth) {
      width = minWidth
    }
    if (maxWidth && width > maxWidth) {
      width = maxWidth;
    }
    if (dom) {
      dom.style.width = width + 'px'
    }
    if (onWidthChange) {
      onWidthChange(width)
    }
  }, [minWidth, maxWidth])

  const mouseUpListener = useCallback(() => {
    drag = false
    window.removeEventListener('mousemove', mouseMoveListener)
    window.removeEventListener('mouseup', mouseUpListener)
    if (dom) {
      // 恢复元素的transition
      dom.style.transition = domTransition
      dom.classList.remove('fa-drag-area-no-select'); // 恢复选中
    }
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: position === 'left' ? -14 : undefined,
        right: position === 'right' ? -14 : undefined,
        resize: 'horizontal',
        cursor: 'col-resize',
        width: '.75rem',
        height: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        ...style,
    }}
      onMouseDown={(e) => {
        drag = true
        startX = e.clientX;
        deltaX = 0
        dom = document.getElementById(domId)
        if (dom) {
          // 计算并保存元素的transition
          domTransition = window.getComputedStyle(dom).transition
          dom.style.transition = 'none'
          dom.classList.add('fa-drag-area-no-select'); // 启用禁止选中
        }
        initWidth = FaUtils.getDomRectById(domId)!.width
        window.addEventListener('mousemove', mouseMoveListener)
        window.addEventListener('mouseup', mouseUpListener)
      }}
    >
      {children ? children : (<div className="fa-resize-indicator" />)}
    </div>
  )
}
