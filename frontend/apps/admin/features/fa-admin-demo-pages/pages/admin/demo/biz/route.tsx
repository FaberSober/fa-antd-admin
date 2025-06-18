import React, { useState } from 'react';
import { RouteCascader } from "@/components";
import { Card } from "antd";

/**
 * @author xu.pengfei
 * @date 2023/1/4 14:52
 */
export default function route() {
  const [array, setArray] = useState<string>('');

  return (
    <div className="fa-full-content fa-p12">
      <Card title="选择项目中的路由" className="fa-mb12">
        <div>选中值：{array}</div>
        <RouteCascader value={array} onChange={(v:any) => setArray(v)} />
      </Card>

    </div>
  )
}
