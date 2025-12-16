import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFaFormStore } from '../stores/useFaFormStore';
import { DynItem } from '../types';
import { Droppable } from './Droppable';

export interface RowContainerProps {
  row: DynItem;
}

/**
 * 行内子项组件，支持拖动
 */
function RowItem({ item, rowId }: { item: DynItem; rowId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id, data: { type: 'RowItem', rowId } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'grab',
    flexShrink: 0,
    minWidth: 'fit-content',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {item.type === 'input' ? '输入框' : '行'}
      <span style={{ fontSize: '12px', color: '#292424ff', marginLeft: '4px' }}>- {item.id}</span>
    </div>
  );
}

/**
 * dynamic row container component
 * 1. can drop items into it
 * 2. can sort items inside it horizontally
 * @author xu.pengfei
 * @date 2025-12-13 21:33:37
 */
export default function RowContainer({ row }: RowContainerProps) {
  const reorderRowChildren = useFaFormStore((state) => state.reorderRowChildren);

  const childIds = (row.children || []).map((child) => child.id);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
        行 - {row.id}
      </div>

      <Droppable
        id={`droppable-row-${row.id}`}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          minHeight: '50px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {childIds.length === 0 ? (
          <div style={{ color: '#999', fontSize: '12px', width: '100%', textAlign: 'center', padding: '10px' }}>
            拖动组件到此行 →
          </div>
        ) : (
          <SortableContext items={childIds} strategy={horizontalListSortingStrategy}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              {row.children?.map((child) => (
                <RowItem key={child.id} item={child} rowId={row.id} />
              ))}
            </div>
          </SortableContext>
        )}
      </Droppable>
    </div>
  );
}
