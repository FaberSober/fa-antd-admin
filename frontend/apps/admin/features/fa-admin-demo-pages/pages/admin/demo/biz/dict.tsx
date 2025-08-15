import React, { useState } from 'react';
import { Card } from 'antd';
import { DictDataRadio, DictDataSelector } from '@fa/ui';

/**
 * 字典选择器
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function DictDemo() {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [value3, setValue3] = useState();
  const [value4, setValue4] = useState();

  return (
    <div className="fa-full-content fa-p12">
      <Card title="字典选择器-Select-关联列表" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Select组件；3. 数据在"字典管理"中配置；</p>

        <DictDataSelector dictLabel="base_dict_test_link_options" value={value1} onChange={(v) => setValue1(v)} />

        <p>value: {value1}</p>
      </Card>


      <Card title="字典选择器-Tree-关联树" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Cascader级联选择组件、TreeSelect树选择组件；3. 数据在"字典管理"中配置；</p>

        <div className="fa-flex-row">
          <div className="fa-mr12">
            <div>Cascader</div>
            <DictDataSelector dictLabel="base_dict_test_link_tree" value={value2} onChange={(v) => setValue2(v)}/>
          </div>
          <div>
            <div>TreeSelect</div>
            <DictDataSelector dictLabel="base_dict_test_link_tree" value={value2} onChange={(v) => setValue2(v)} treeShowType='treeSelect'/>
          </div>
        </div>

        <p>value: {value2}</p>
      </Card>

      <Card title="字典选择器-Select" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Select组件；3. 数据在"字典管理"中配置；</p>

        <DictDataSelector dictLabel="common_area_level" value={value3} onChange={(v) => setValue3(v)} />

        <p>value: {value3}</p>
      </Card>

      <Card title="字典选择器-Radio" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Radio组件；3. 数据在"字典管理"中配置；</p>

        <DictDataRadio dictLabel="common_area_level" value={value4} onChange={(e) => setValue4(e.target.value)} />

        <p>value: {value4}</p>
      </Card>

      <Card title="字典选择器-异常-文本类型" className="fa-mb12">
        <p>说明：文本类型字典不支持选择器</p>

        <DictDataSelector dictLabel="base_dict_test_text" />
      </Card>
    </div>
  );
}
