import React from 'react';
import {Card} from "antd";
import TreeCascade from "@/pages/admin/demo/tree/helper/TreeCascade";


/**
 * 级联选择
 * @author xu.pengfei
 * @date 2022/11/30
 */
export default function cascader() {

  return (
    <div className="fa-full-content fa-padding-12">
      <Card title="级联选择-带一个根节点" style={{ marginBottom: 12 }}>
        <p>说明：1. 从接口获取数据；2. 远程数据返回Tree型数据；</p>

        <TreeCascade />
      </Card>

      <Card title="级联选择-不带根节点" style={{ marginBottom: 12 }}>
        <p>说明：1. 从接口获取数据；2. 远程数据返回Tree型数据；</p>

        <TreeCascade showRoot={false} />
      </Card>

    </div>
  )

}
