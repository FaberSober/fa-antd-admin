import React, { useContext } from 'react';
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { Button, Popover } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { FaIcon } from "@fa/icons";
import { getNodeKey } from "@features/fa-flow-pages/components/flow/utils";
import FaWorkFlowContext from "@features/fa-flow-pages/components/flow/context/FaWorkFlowContext";

const NodeType = FlwEnums.NodeType
const NodeSetType = FlwEnums.NodeSetType

export interface AddNodeProps {
  /** 流程配置节点Node JSON */
  parentNode: Flw.Node | Flw.ConditionNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 21:03
 */
export default function AddNode({parentNode}: AddNodeProps) {
  const {refreshNode} = useContext(FaWorkFlowContext)

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
        };
      } break
      case NodeType.cc: {
        node = {
          nodeName: "抄送人",
          nodeKey: getNodeKey(),
          type: NodeType.cc,
          userSelectFlag: true,
          nodeAssigneeList: [],
          childNode: parentNode.childNode
        };
      } break
      case NodeType.conditionBranch: {
        node = {
          nodeName: "条件路由",
          nodeKey: getNodeKey(),
          type: 4,
          conditionNodes: [
            {
              nodeName: "条件1",
              nodeKey: getNodeKey(),
              type: 3,
              priorityLevel: 1,
              conditionList: []
            },
            {
              nodeName: "条件2",
              nodeKey: getNodeKey(),
              type: 3,
              priorityLevel: 2,
              conditionList: []
            }
          ],
          childNode: parentNode.childNode
        }
      } break
    }
    parentNode.childNode = node!;
    const nodeNew = { ...parentNode }
    Object.assign(parentNode, nodeNew); // Object.assign(a, b); 会把 b 的属性复制到 a 上，不会改变 a 的引用。
    refreshNode();
  }

  return (
    <div className="add-node-btn-box">
      <div className="add-node-btn">
        <Popover
          content={(
            <div className="add-node-popover-body fa-flex-row">
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
