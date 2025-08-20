import React from 'react';
import { Flow, FlowEnums } from "@features/fa-flow-pages/types";
import { Button, Popover } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { FaIcon } from "@fa/icons";
import { isNil } from "lodash";


export interface AddNodeProps {
  /** 流程配置节点Node JSON */
  node?: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 21:03
 */
export default function AddNode({node}: AddNodeProps) {
  if (isNil(node)) return null;

  function addType(type: FlowEnums.NodeType) {}

  return (
    <div className="add-node-btn-box">
      <div className="add-node-btn">
        <Popover
          content={(
            <div className="add-node-popover-body fa-flex-row">
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlowEnums.NodeType.approval)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#ff943e'}} />} />
                <div>审批节点</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlowEnums.NodeType.cc)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#3296fa'}} />} />
                <div>抄送节点</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6">
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#15BC83'}} />} />
                <div>条件分支</div>
              </div>
            </div>
          )}
          title="添加节点"
          trigger="click"
          placement="rightTop"
        >
          <Button shape="circle" icon={<PlusOutlined />} />
        </Popover>
      </div>
    </div>
  )
}
