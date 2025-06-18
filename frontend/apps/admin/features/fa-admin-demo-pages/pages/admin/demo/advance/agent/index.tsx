import React from 'react';
import {Card} from "antd";
import {isMobile} from "react-device-detect";


/**
 * @author xu.pengfei
 * @date 2023/7/15 16:32
 */
export default function DemoAdvanceAgent() {
  return (
    <div className="fa-full-content fa-bg-white fa-p12 fa-flex-column">
      <Card title="判断浏览器类型" className="fa-mb12">
        {isMobile ? '手机' : 'Web'}
      </Card>
    </div>
  )
}
