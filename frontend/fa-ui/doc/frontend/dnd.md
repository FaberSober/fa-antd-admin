# 拖动排序

## 列表排序
代码路径：faber-admin/src/main/frontend/src/pages/admin/home/biz/drag.tsx

```javascript
import React, {useState} from 'react';
import {Button, Card, Switch} from "antd";
import {FaSortList} from "@/components/base-drag";
import FaDragItem from "@/components/base-drag/FaDragItem";
import {PlusOutlined} from "@ant-design/icons";

function genList(i: number): { id: number, name: string }[] {
    return Array.from({length: i}, (v, k) => ({id: k + 1, name: `第${k + 1}个数据`}))
}

export default function drag() {
    const [array, setArray] = useState(genList(5))

    return (
        <FaSortList
            list={array}
            renderItem={(i) => <div>{i.name}</div>}
            itemStyle={{padding: 8, borderBottom: '1px solid #ccc'}}
            onSortEnd={(l) => setArray(l)}
            vertical
        />
    )
}

```

