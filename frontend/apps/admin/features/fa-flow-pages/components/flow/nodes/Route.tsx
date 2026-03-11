import { FaIconPro } from "@/components";
import { PlusOutlined } from "@ant-design/icons";
import { BaseDrawer, useOpen } from '@fa/ui';
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { Button, Input } from "antd";
import { cloneDeep } from "lodash";
import { useMemo } from 'react';
import { NodeCloseBtn } from '../cubes';
import { useDelNode } from "../hooks";
import AddNode from './AddNode';
import RouteNode from "./RouteNode";


/**
 * 路由分支
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Route({ node, parentNode }: Flw.BasicNodeProps) {
  const [open, show, hide] = useOpen()

  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);
  const updateNode = useWorkFlowStore(state => state.updateNode);

  const { delNode } = useDelNode(node, parentNode);

  function showDrawer() {
    show()
  }

  const text = useMemo(() => {
    if (!node.routeNodes || node.routeNodes.length === 0) {
      return '暂无分支';
    }
    return '路由节点';
  }, [node])

  function handleAddRoute() {
    const nodeNew = cloneDeep(node)
    let len = nodeNew.routeNodes!.length + 1
    nodeNew.routeNodes!.push({
      nodeName: '路由' + len,
      nodeKey: undefined!,
      type: FlwEnums.NodeType.routeJump,
      priorityLevel: len,
      conditionMode: 1,
      conditionList: [],
    })
    updateNode(nodeNew);
  }

  function handleDelRoute(index: number) {
    const nodeNew = cloneDeep(node)
    nodeNew.routeNodes!.splice(index, 1)
    updateNode(nodeNew);
  }

  function handleRouteNodeChange(index: number, newRouteNode: Flw.ConditionNode) {
    const nodeNew = cloneDeep(node)
    nodeNew.routeNodes![index] = newRouteNode;
    updateNode(nodeNew);
  }

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title">
          <FaIconPro icon="fa-solid fa-user-large" />
          <span>{node.nodeName}</span>
          <NodeCloseBtn onClick={() => delNode()} />
        </div>
        <div className="content">
          {text}
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={node.nodeName} variant="filled" onChange={e => updateNodeProps(node, 'nodeName', e.target.value)} />
        )}
      >
        <div className="fa-flex-column fa-gap12">
          <div className="fa-flex-column fa-gap12">
            {node.routeNodes && node.routeNodes.map((routeNode, index) => {
              return (
                <div key={index}>
                  <RouteNode routeNode={routeNode} onDel={() => handleDelRoute(index)} onChange={(v) => handleRouteNodeChange(index, v)} />
                </div>
              )
            })}
          </div>
          <Button onClick={handleAddRoute} icon={<PlusOutlined />}>添加路由分支</Button>
        </div>
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}
