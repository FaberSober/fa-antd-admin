import React, { useState } from 'react';
import { Card } from 'antd';
import { BaseSelect } from '@fa/ui';
import { studentApi } from '@/services';
import StudentSearchSelect from "../table/table/helper/StudentSearchSelect";


/**
 * 远程数据选择
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function select() {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();

  return (
    <div className="fa-full-content fa-bg-white fa-p12">
      <Card title="远程数据选择-一次加载全部数据" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Select组件；3. 只要继承了BaseController的api接口都可以使用；</p>

        <BaseSelect serviceApi={studentApi} value={value1} onChange={(v) => setValue1(v)} />

        <p>value: {value1}</p>
      </Card>

      <Card title="远程数据选择-搜索加载前20条数据" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. Select组件(支持搜索过滤)；3. 加入防抖500ms；4. 参考用户搜索选择；</p>

        <StudentSearchSelect value={value2} onChange={(v) => setValue2(v)} />

        <p>value: {value2}</p>
      </Card>
    </div>
  );
}
