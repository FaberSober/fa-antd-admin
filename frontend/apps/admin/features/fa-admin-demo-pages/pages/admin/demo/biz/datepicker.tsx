import React from 'react';
import { Card, DatePicker } from "antd";


export type datepickerProps = {}

/**
 * @author xu.pengfei
 * @date 2023/1/31 10:47
 */
export default function datepicker({}: datepickerProps) {
  return (
    <div className="fa-full-content fa-p12">
      <Card title="日期选择组件" className="fa-mb12">
        <DatePicker />
      </Card>
    </div>
  )
}