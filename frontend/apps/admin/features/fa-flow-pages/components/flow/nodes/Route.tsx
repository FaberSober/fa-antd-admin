import { FaIcon } from "@fa/icons";
import { BaseDrawer, useOpen } from '@fa/ui';
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";
import { Flw } from "@features/fa-flow-pages/types";
import { Button, Input } from "antd";
import { useMemo } from 'react';
import { NodeCloseBtn } from '../cubes';
import { useDelNode } from "../hooks";
import AddNode from './AddNode';
import { PlusOutlined } from "@ant-design/icons";


/**
 * 路由分支
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Route({ node, parentNode }: Flw.BasicNodeProps) {
  const [open, show, hide] = useOpen()

  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);

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

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title">
          <FaIcon icon="fa-solid fa-user-large" />
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
        <div className="fa-flex-column">
          <Button icon={<PlusOutlined />}>添加路由分支</Button>
        </div>
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}
