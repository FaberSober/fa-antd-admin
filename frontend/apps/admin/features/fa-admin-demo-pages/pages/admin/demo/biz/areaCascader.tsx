import React, { useState } from 'react';
import type { Admin } from '@/types';
import { Card } from 'antd';
import { AreaCascader } from '@/components';


/**
 * 业务组件-地区选择
 * @author xu.pengfei
 * @date 2022/10/8
 */
export default function areaCascader() {
  const [value1, setValue1] = useState();
  const [value1Area, setValue1Area] = useState<Admin.Area>();

  const [value2, setValue2] = useState([]);
  const [value3, setValue3] = useState();
  const [value4, setValue4] = useState();

  return (
    <div className="fa-full-content fa-p12">
      <Card title="只获取最后选中的地区ID" className="fa-mb12">
        <div>选中值：{value1}</div>
        <div>选中值(完整属性)：{value1Area && JSON.stringify(value1Area)}</div>
        <AreaCascader
          style={{ minWidth: 200, width: 'auto' }}
          value={value1}
          onChange={(v, item) => {
            setValue1(v);
            setValue1Area(item);
          }}
        />
      </Card>

      <Card title="获取完整的地区ID数组" className="fa-mb12">
        <div>选中值：{JSON.stringify(value2)}</div>
        <AreaCascader style={{ minWidth: 200, width: 'auto' }} value={value2} onChange={(v) => setValue2(v)} leafPath />
      </Card>

      <Card title="只选择省市区前三级" className="fa-mb12">
        <div>选中值：{value3}</div>
        <AreaCascader style={{ minWidth: 200, width: 'auto' }} value={value3} onChange={(v) => setValue3(v)} leafLevel={2} />
      </Card>

      <Card title="只选择省市前两级" className="fa-mb12">
        <div>选中值：{value4}</div>
        <AreaCascader style={{ minWidth: 200, width: 'auto' }} value={value4} onChange={(v) => setValue4(v)} leafLevel={1} />
      </Card>
    </div>
  );
}
