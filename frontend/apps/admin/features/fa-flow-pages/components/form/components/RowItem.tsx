import { Flow } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaUtils } from '@fa/ui';
import React from 'react';
import FaFormEditorItem from '../cube/FaFormEditorItem';
import clsx from 'clsx';
import { useFaFormStore } from '../stores/useFaFormStore';

export interface RowItemProps {
  item: Flow.FlowFormItem;
  rowId: string;
  onClickItem?: (item: Flow.FlowFormItem) => void;
}

/**
 * 行内子项组件，支持拖动
 * @author xu.pengfei
 * @date 2025-12-17 14:31:06
 */
export default function RowItem({ item, rowId, onClickItem }: RowItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id, data: { type: 'RowItem', rowId } });
    const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // padding: '8px 12px',
    // backgroundColor: '#fff',
    // border: '1px solid #ddd',
    // borderRadius: '4px',
    cursor: 'grab',
    flexShrink: 0,
    minWidth: 'fit-content',
  };

  return (
    <div ref={setNodeRef} style={style} onClick={(e) => {
      FaUtils.preventEvent(e)
      onClickItem?.(item)
    }}
    className={clsx('fa-form-editor-item', item.id === selectedFormItem?.id && 'fa-form-editor-item-selected')}
    {...attributes}
    {...listeners}>
      <FaFormEditorItem formItem={item} />
    </div>
  );
}
