import React, { CSSProperties, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import './index.css';
import { MenuOutlined } from '@ant-design/icons';

export interface FaSortItemProps {
  id: any;
  handle?: boolean;
  handleNode?: ReactNode;
  style?: CSSProperties;
  className?: string | undefined;
  handleStyle?: CSSProperties;
  children?: ReactNode;
  /** true-只变更x坐标，固定y坐标 */
  vertical?: boolean;
  /** true-只变更y坐标，固定x坐标 */
  horizontal?: boolean;
  dragging?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2022/12/3 9:54
 */
export default function FaSortItem({
  id,
  style,
  className,
  handle,
  handleNode,
  handleStyle,
  children,
  vertical,
  horizontal,
  dragging,
}: FaSortItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const styleTrans: CSSProperties = {
    // transform: CSS.Transform.toString(transform),
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
    transition,
    cursor: handle ? 'default' : 'grab',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: dragging ? 999 : undefined,
    boxShadow: dragging ? '8px 8px 8px rgba(0, 21, 41, 0.08)' : undefined,
    backgroundColor: 'var(--fa-bg-color)',
    position: 'relative',
  };
  if (vertical) {
    styleTrans.transform = transform
      ? `translate3d(${vertical ? 0 : transform.x}px, ${vertical ? transform.y : 0}px, 0)`
      : '';
  }
  if (horizontal) {
    styleTrans.transform = transform
      ? `translate3d(${horizontal ? transform.x : 0}px, ${horizontal ? 0 : transform.y}px, 0)`
      : '';
  }

  return (
    <div ref={setNodeRef} className={className} style={{ ...styleTrans, ...style }} {...(handle ? {} : listeners)} {...attributes}>
      {children}
      {handle && (
        <div className="fa-drag-handle" style={handleStyle} {...listeners}>
          {handleNode ? handleNode : <MenuOutlined />}
        </div>
      )}
    </div>
  );
}
