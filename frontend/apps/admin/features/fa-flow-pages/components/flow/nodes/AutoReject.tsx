import { FaIconPro } from "@/components";
import { BaseDrawer, useOpen } from '@fa/ui';
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";
import { Flw } from "@features/fa-flow-pages/types";
import { Input } from "antd";
import { NodeCloseBtn } from '../cubes';
import { useDelNode } from "../hooks";
import AddNode from './AddNode';


/**
 * @author xu.pengfei
 * @date 2026/01/20 11:00
 */
export default function AutoReject({ node, parentNode }: Flw.BasicNodeProps) {
  const [open, show, hide] = useOpen()

  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);
  const { delNode } = useDelNode(node, parentNode);

  function showDrawer() {
    show()
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
          自动拒绝
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={node.nodeName} variant="filled" onChange={e => updateNodeProps(node, 'nodeName', e.target.value)} />
        )}
      >
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}
