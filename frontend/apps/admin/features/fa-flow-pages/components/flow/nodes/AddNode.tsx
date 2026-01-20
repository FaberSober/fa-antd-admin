import React, { useState } from 'react';
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { Button, Popover } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { FaIcon } from "@fa/icons";
import { getNodeKey } from "@features/fa-flow-pages/components/flow/utils";
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";

const NodeType = FlwEnums.NodeType
const NodeSetType = FlwEnums.NodeSetType


export interface AddNodeProps {
  /** 流程配置节点Node JSON */
  parentNode: Flw.ParentNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 21:03
 */
export default function AddNode({parentNode}: AddNodeProps) {
  const updateNode = useWorkFlowStore(state => state.updateNode);
  const [open, setOpen] = useState(false);

  function addType(type: FlwEnums.NodeType) {
    let node: Flw.Node;
    switch (type) {
      case NodeType.approval: {
        node = {
          nodeName: "审核人",
          nodeKey: getNodeKey(),
          type: NodeType.approval,			//节点类型
          setType: NodeSetType.specifyMembers,			//审核人类型 1，选择成员 3，选择角色
          nodeAssigneeList: [],	//审核人员，根据 setType 确定成员还是角色
          examineLevel: 1,	//指定主管层级
          directorLevel: 1,	//自定义连续主管审批层级
          selectMode: 1,		//发起人自选类型
          termAuto: false,	//审批期限超时自动审批
          term: 0,			//审批期限
          termMode: 1,		//审批期限超时后执行类型
          examineMode: 1,		//多人审批时审批方式
          directorMode: 0,	//连续主管审批方式
          childNode: parentNode.childNode,
          extendConfig: {
            btnSubmitValid: true,
          },
        };
      } break
      case NodeType.cc: {
        node = {
          nodeName: "抄送人",
          nodeKey: getNodeKey(),
          type: NodeType.cc,
          userSelectFlag: true,
          nodeAssigneeList: [],
          childNode: parentNode.childNode,
          extendConfig: {},
        };
      } break
      case NodeType.conditionBranch: {
        node = {
          nodeName: "条件路由",
          nodeKey: getNodeKey(),
          type: NodeType.conditionBranch,
          conditionNodes: [
            {
              nodeName: "条件1",
              nodeKey: getNodeKey(),
              type: NodeType.conditionNode,
              priorityLevel: 1,
              conditionMode: 1,
              conditionList: [],
            },
            {
              nodeName: "条件2",
              nodeKey: getNodeKey(),
              type: NodeType.conditionNode,
              priorityLevel: 2,
              conditionMode: 2,
              conditionList: [],
            }
          ],
          childNode: parentNode.childNode,
          extendConfig: {},
        }
      } break
      case NodeType.parallelBranch: {
        node = {
          nodeName: "并行分支",
          nodeKey: getNodeKey(),
          type: NodeType.parallelBranch,
          parallelNodes: [
            {
              nodeName: "分支1",
              nodeKey: getNodeKey(),
              type: NodeType.conditionNode,
              priorityLevel: 1,
              conditionMode: 1,
            },
            {
              nodeName: "分支2",
              nodeKey: getNodeKey(),
              type: NodeType.conditionNode,
              priorityLevel: 2,
              conditionMode: 1,
            }
          ],
          childNode: parentNode.childNode,
          extendConfig: {},
        }
      } break
      case NodeType.inclusiveBranch: {
        node = {
          nodeName: "包容分支",
          nodeKey: getNodeKey(),
          type: NodeType.inclusiveBranch,
          inclusiveNodes: [
            {
              nodeName: "包容条件1",
              nodeKey: getNodeKey(),
              type: NodeType.conditionNode,
              priorityLevel: 1,
              conditionMode: 1,
              conditionList: [],
            },
            {
              nodeName: "包容条件2",
              nodeKey: getNodeKey(),
              type: NodeType.conditionNode,
              priorityLevel: 2,
              conditionMode: 2,
              conditionList: [],
            }
          ],
          childNode: parentNode.childNode,
          extendConfig: {},
        }
      } break
      case NodeType.timer: {
        node = {
          nodeName: "延迟等待",
          nodeKey: getNodeKey(),
          type: NodeType.timer,
          delayType: FlwEnums.NodeDelayType.FIXED,
          childNode: parentNode.childNode,
          extendConfig: {
            time: "1:m",
          },
        }
      } break
      case NodeType.autoPass: {
        node = {
          nodeName: "自动通过",
          nodeKey: getNodeKey(),
          type: NodeType.autoPass,
          childNode: parentNode.childNode,
          extendConfig: {},
        }
      } break
      case NodeType.autoReject: {
        node = {
          nodeName: "自动拒绝",
          nodeKey: getNodeKey(),
          type: NodeType.autoReject,
          childNode: parentNode.childNode,
          extendConfig: {},
        }
      } break
      case NodeType.end: {
        node = {
          nodeName: "结束",
          nodeKey: getNodeKey(),
          type: NodeType.end,
          extendConfig: {},
        }
      } break
    }
    updateNode({ ...parentNode, childNode: node! });
    setOpen(false);
  }

  return (
    <div className="add-node-btn-box">
      <div className="add-node-btn">
        <Popover
          content={(
            <div className="add-node-popover-body fa-grid4">
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.approval)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#ff943e'}} />} />
                <div>审批节点</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.cc)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#3296fa'}} />} />
                <div>抄送节点</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.conditionBranch)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#15BC83'}} />} />
                <div>条件分支</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.parallelBranch)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#ec1b08'}} />} />
                <div>并行分支</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.inclusiveBranch)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#ec1b08'}} />} />
                <div>包容分支</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.timer)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#F5222D'}} />} />
                <div>延迟等待</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.autoPass)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#78C06E'}} />} />
                <div>自动通过</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.autoReject)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#e02020'}} />} />
                <div>自动拒绝</div>
              </div>
              <div className="fa-flex-column-center fa-hover fa-p6" onClick={() => addType(FlwEnums.NodeType.end)}>
                <Button shape="circle" icon={<FaIcon icon="fa-solid fa-stamp" style={{color: '#e02020'}} />} />
                <div>结束</div>
              </div>
            </div>
          )}
          title="添加节点"
          trigger="click"
          placement="rightTop"
          open={open}
          onOpenChange={setOpen}
        >
          <Button shape="circle" icon={<PlusOutlined />} />
        </Popover>
      </div>
    </div>
  )
}
