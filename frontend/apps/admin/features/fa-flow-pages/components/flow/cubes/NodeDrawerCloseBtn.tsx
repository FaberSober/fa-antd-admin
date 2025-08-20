import React, { useContext } from 'react';
import { RollbackOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { BaseDrawerContext } from "@fa/ui";

/**
 * @author xu.pengfei
 * @date 2025/8/20 14:23
 */
export default function NodeDrawerCloseBtn() {
  const {closeDrawer} = useContext(BaseDrawerContext)
  return (
    <Button onClick={closeDrawer} icon={<RollbackOutlined />}>取消</Button>
  )
}
