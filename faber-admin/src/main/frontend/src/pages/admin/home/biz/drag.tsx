import React, {useState} from 'react';
import {Card} from "antd";
import {FaDragHandle, FaSortableContainer, FaSortableItem, FaSortList} from "@/components/base-drag";
import {arrayMove} from "@/utils/utils";


function genList(i: number): { id: number, name: string }[] {
  return Array.from({length: i}, (v, k) => ({ id: k + 1, name: `第${k + 1}个数据` }))
}

/**
 * 拖动排序
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function drag() {
  const [array, setArray] = useState(genList(5))
  const [array2, setArray2] = useState(genList(5))

  /** 排序变更 */
  function onSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    if (oldIndex === newIndex) return;

    const newItems = arrayMove(array, oldIndex, newIndex);
    setArray2(newItems)
  }

  return (
    <div>
      <Card title="拖动排序-整体拖动" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortList
            list={array}
            renderItem={(i) => <div>{i.name}</div>}
            itemStyle={{ padding: 8, borderBottom: '1px solid #ccc' }}
            onSortEnd={(l) => setArray(l)}
            vertical
          />
        </div>

        <p>value: {JSON.stringify(array.map(i => i.id))}</p>
      </Card>

      <Card title="拖动排序-带有拖动把手" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortableContainer onSortEnd={onSortEnd} useDragHandle>
            {array2.map((value, index) => (
              <FaSortableItem key={value.id} index={index}>
                <div className="fa-flex-row-center" style={{ padding: '0', borderBottom: '1px solid #ccc' }}>
                  <div style={{ flex: 1 }}>{value.name}</div>
                  <FaDragHandle />
                </div>
              </FaSortableItem>
            ))}
          </FaSortableContainer>
        </div>

        <p>value: {JSON.stringify(array2.map(i => i.id))}</p>
      </Card>

    </div>
  )
}
