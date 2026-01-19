import { BaseDrawer, FaFlexRestLayout, useOpen } from "@fa/ui";
import { NodeCloseBtn } from "@features/fa-flow-pages/components/flow/cubes";
import { Flw } from "@features/fa-flow-pages/types";
import { Form, Input } from "antd";
import clsx from 'clsx';
import { ReactNode } from 'react';
import { useWorkFlowStore } from '../stores/useWorkFlowStore';

export interface ParallelNodeProps {
  parentNode: Flw.Node;
  node: Flw.ConditionNode;
  index: number;
  onDel?: () => void;
  conditionText: string | ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2026-01-19 14:10:20
 */
export default function ParallelNode({ node, index, onDel, conditionText }: ParallelNodeProps) {
  const readOnly = useWorkFlowStore(state => state.readOnly);
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()

  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);

  function showDrawer() {
    show()
  }

  return (
    <>
      <div className="fa-flex-column" onClick={showDrawer}>
        <div className="branch-title">
          <span className="node-title">{node.nodeName}</span>
          <NodeCloseBtn onClick={onDel} />
        </div>

        <div className="content">
          {conditionText ? <span>{conditionText}</span> : <span className="placeholder">请设置条件</span>}
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={node.nodeName} variant="filled" onChange={e => updateNodeProps(node, 'nodeName', e.target.value)} />
        )}
      >
        <Form
          form={form}
          layout="vertical"
          className={clsx('fa-flex-column fa-full', readOnly && 'sc-workflow-design-readonly')}
          // onFinish={onFinish}
          disabled={readOnly}
        >
          <FaFlexRestLayout>
            <div className="fa-flex-column">
            </div>
          </FaFlexRestLayout>
        </Form>
      </BaseDrawer>
    </>
  )
}
