import React, { useState } from 'react';
import { Card } from 'antd';
import { DictDataRadio, DictDataSelector } from '@fa/ui';

/**
 * 字典选择器
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function dict() {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();

  return (
    <div className="fa-full-content fa-p12">
      <Card title="字典选择器-Select" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Select组件；3. 数据在"字典管理"中配置；</p>

        <DictDataSelector dictLabel="common_area_level" value={value1} onChange={(v) => setValue1(v)} />

        <p>value: {value1}</p>
      </Card>

      <Card title="字典选择器-Radio" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Radio组件；3. 数据在"字典管理"中配置；</p>

        <DictDataRadio dictLabel="common_area_level" value={value2} onChange={(e) => setValue2(e.target.value)} />

        <p>value: {value2}</p>
      </Card>
    </div>
  );
}
