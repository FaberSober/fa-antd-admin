import React, {useState} from 'react';
import {FaLabel, FaSortGrid} from "@fa/ui";
import {Button, Card} from "antd";

function genList(i: number): { id: number; name: string }[] {
  return Array.from({ length: i }, (_, k) => ({ id: k + 1, name: `第${k + 1}个数据` }));
}

export default function App() {
  const [array, setArray] = useState(genList(11));

  return (
    <div className="px-8">
      <p>Hello</p>
      <Button type='primary'>Hello</Button>

      <FaLabel title="Hello, ui" />

      <Card title="拖动排序-网格" style={{ marginBottom: 12 }}>
        <p>说明：1. 使用dnd-kit组件；2. 二次封装后使用更简单；</p>

        <div style={{ width: 400 }}>
          <FaSortGrid
            list={array}
            renderItem={(i) => <div>{i.name}</div>}
            itemStyle={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, height: 100, width: 100 }}
            onSortEnd={(l) => setArray(l)}
          />
        </div>

        <p>value: {JSON.stringify(array.map((i) => i.id))}</p>
      </Card>

      <p>更多组件查看<code>packages/ui</code>目录</p>
    </div>
  );
}
