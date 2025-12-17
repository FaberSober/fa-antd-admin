import { Flow } from '@/types';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Droppable } from './Droppable';
import RowItem from './RowItem';

export interface RowContainerProps {
  row: Flow.FlowFormItem;
  onClickRowItem?: (item: Flow.FlowFormItem) => void;
}

/**
 * dynamic row container component
 * 1. can drop items into it
 * 2. can sort items inside it horizontally
 * @author xu.pengfei
 * @date 2025-12-13 21:33:37
 */
export default function RowContainer({ row, onClickRowItem }: RowContainerProps) {
  const childIds = (row.children || []).map((child) => child.id);


  function handleClickRowItem(item: Flow.FlowFormItem) {
    onClickRowItem?.(item);
  }

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
                <RowItem key={child.id} item={child} rowId={row.id} onClickItem={() => handleClickRowItem(child)} />
              ))}
            </div>
          </SortableContext>
        )}
      </Droppable>
    </div>
  );
}
