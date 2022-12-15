import React, {useState} from 'react';
import {Card} from "antd";
import TreeCascade from "@/pages/admin/demo/tree/helper/TreeCascade";


/**
 * 级联选择
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function cascader() {
  const [data, setData] = useState<number>()
  const [data1, setData1] = useState<number>()
  const [disableIds, setDisableIds] = useState<number>()

  return (
    <div className="fa-full-content fa-p12">
      <Card title="级联选择-带一个根节点" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. 远程数据返回Tree型数据；</p>

        <TreeCascade value={data} onChange={setData} />

        <p>选中：{data}</p>
      </Card>

      <Card title="级联选择-不带根节点" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. 远程数据返回Tree型数据；</p>

        <TreeCascade value={data1} onChange={setData1} showRoot={false} />

        <p>选中：{data1}</p>
      </Card>

      <Card title="级联选择-禁止某节点" className="fa-mb12">
        <p>说明：1. 从接口获取数据；2. 远程数据返回Tree型数据；3. 禁止某节点；</p>

        <div className="fa-mb12">
          <span>选择禁止的节点：</span>
          <TreeCascade value={disableIds} onChange={setDisableIds} showRoot={false} />
        </div>

        <div>
          <span>查看禁止的节点：</span>
          <TreeCascade disabledIds={disableIds ? [disableIds] : undefined} showRoot={false} />
        </div>

        <p>选中：{data1}</p>
      </Card>

    </div>
  )

}
