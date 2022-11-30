import React, {useState} from 'react';
import {Card} from "antd";
import {FaDragHandle, FaSortableContainer, FaSortableItem} from "@/components/base-drag";
import {arrayMove} from "@/utils/utils";


/**
 * 拖动排序
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function drag() {
  const [array, setArray] = useState([
    { id: 1, name: '第1个数据' },
    { id: 2, name: '第2个数据' },
    { id: 3, name: '第3个数据' },
    { id: 4, name: '第4个数据' },
    { id: 5, name: '第5个数据' },
  ])

  /** 排序变更 */
  function onSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    if (oldIndex === newIndex) return;

    const newItems = arrayMove(array, oldIndex, newIndex);
    setArray(newItems)
  }

  return (
    <div>
      <Card title="拖动排序-带有拖动把手" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用react-sortable-hoc组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortableContainer onSortEnd={onSortEnd} useDragHandle>
            {array.map((value, index) => (
              <FaSortableItem key={value.id} index={index}>
                <div className="fa-flex-row-center" style={{ padding: '0', borderBottom: '1px solid #ccc' }}>
                  <div style={{ flex: 1 }}>{value.name}</div>
                  <FaDragHandle />
                </div>
              </FaSortableItem>
            ))}
          </FaSortableContainer>
        </div>

        <p>value: {JSON.stringify(array.map(i => i.id))}</p>
      </Card>

      <Card title="拖动排序-整体拖动" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用react-sortable-hoc组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortableContainer onSortEnd={onSortEnd}>
            {array.map((value, index) => (
              <FaSortableItem key={value.id} index={index}>
                <div className="fa-flex-row-center" style={{ padding: '6px 0', borderBottom: '1px solid #ccc', cursor: 'move' }}>
                  <div style={{ flex: 1 }}>{value.name}</div>
                </div>
              </FaSortableItem>
            ))}
          </FaSortableContainer>
        </div>

        <p>value: {JSON.stringify(array.map(i => i.id))}</p>
      </Card>

    </div>
  )
}
