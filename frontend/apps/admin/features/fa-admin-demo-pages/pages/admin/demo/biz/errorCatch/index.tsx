import React from 'react';
import { Button, Card } from "antd";

/**
 * @author xu.pengfei
 * @date 2025/2/28 19:35
 */
export default function index() {
  return (
    <div className="fa-full-content fa-p12">
      <Card title="主动触发异常" className="fa-mb12">
        <Button onClick={() => {throw new Error("This is your first error!");}}>Break the world</Button>
      </Card>
    </div>
  )
}
