import React, { useState } from 'react';
import { Button, Card, Switch } from 'antd';
import { AuthDelBtn, FaDragItem, FaSortGrid, FaSortList } from '@fa/ui';
import { DragOutlined, PlusOutlined } from '@ant-design/icons';


function genList(i: number): { id: number; name: string }[] {
  return Array.from({ length: i }, (_, k) => ({ id: k + 1, name: `第${k + 1}个数据` }));
}

/**
 * 拖动排序
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function drag() {
  const [array, setArray] = useState(genList(5));
  const [array2, setArray2] = useState(genList(5));
  const [arrayDel2, setArrayDel2] = useState(genList(5));
  const [array3, setArray3] = useState(genList(11));
  const [array4, setArray4] = useState(genList(11));
  const [disabled, setDisabled] = useState(false);

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

        <p>value: {JSON.stringify(array.map((i) => i.id))}</p>
      </Card>

      <Card title="拖动排序-带有拖动把手" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortList
            list={array2}
            renderItem={(i) => <div style={{ flex: 1 }}>{i.name}</div>}
            itemStyle={{ borderBottom: '1px solid #ccc' }}
            onSortEnd={(l) => setArray2(l)}
            vertical
            handle
          />
        </div>

        <p>value: {JSON.stringify(array2.map((i) => i.id))}</p>
      </Card>


      <Card title="拖动排序-带有拖动把手、删除按钮" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortList
            list={arrayDel2}
            renderItem={(i) => (
              <div className="fa-flex-row-center" style={{ flex: 1 }}>
                <div className="fa-flex-1">{i.name}</div>
                <AuthDelBtn handleDelete={() => {}} />
              </div>
            )}
            itemStyle={{ borderBottom: '1px solid #ccc' }}
            onSortEnd={(l) => setArrayDel2(l)}
            vertical
            handle
          />
        </div>

        <p>value: {JSON.stringify(arrayDel2.map((i) => i.id))}</p>
      </Card>

      <Card title="拖动排序-网格" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortGrid
            list={array3}
            renderItem={(i) => <div>{i.name}</div>}
            itemStyle={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, height: 100, width: 100 }}
            onSortEnd={(l) => setArray3(l)}
          />
        </div>

        <p>value: {JSON.stringify(array3.map((i) => i.id))}</p>
      </Card>

      <Card title="拖动排序-网格-带有拖动把手" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortGrid
            list={array4}
            renderItem={(i) => <div>{i.name}</div>}
            itemStyle={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, height: 100, width: 100 }}
            onSortEnd={(l) => setArray4(l)}
            handle
            handleStyle={{ position: 'absolute', top: 0, right: 0 }}
            handleNode={<DragOutlined />}
            columns={4}
          />
        </div>

        <p>value: {JSON.stringify(array4.map((i) => i.id))}</p>
      </Card>

      <Card title="拖动元素" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 拖动后回到原位置；</p>

        <div style={{ width: 400, height: 300 }}>
          <FaDragItem>
            <Button>Drag me</Button>
          </FaDragItem>
        </div>
      </Card>

      <Card title="拖动元素-带有拖动把手" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 拖动后回到原位置；</p>

        <div style={{ width: 400, height: 300 }}>
          <FaDragItem handle handleNode={<PlusOutlined />}>
            <Button>Drag me</Button>
          </FaDragItem>
        </div>
      </Card>

      <Card title="拖动元素-固定位置" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 拖动后固定在新位置；</p>

        <Switch
          checkedChildren="启用拖动"
          unCheckedChildren="禁用拖动"
          checked={!disabled}
          onChange={(e) => setDisabled(!e)}
          className="fa-mb12"
        />
        <div style={{ width: 400, height: 300, position: 'relative' }}>
          <FaDragItem disabled={disabled} hold>
            <Button>Drag me</Button>
          </FaDragItem>
        </div>
      </Card>
    </div>
  );
}
