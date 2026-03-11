import { FaIconPro } from "@/components";
import { BaseDrawer, FaFlexRestLayout, useOpen } from '@fa/ui';
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";
import { Flw } from "@features/fa-flow-pages/types";
import { Checkbox, Form, Input } from "antd";
import { useMemo } from 'react';
import { NodeCloseBtn } from '../cubes';
import { useDelNode } from "../hooks";
import AddNode from './AddNode';


/**
 * 子流程
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function CallProcess({ node, parentNode }: Flw.BasicNodeProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()

  const updateNode = useWorkFlowStore(state => state.updateNode);
  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  const { delNode } = useDelNode(node, parentNode);

  async function handleValuesChange(av: any) {
    const nodeNew = {
      ...node,
      callProcess: av.callProcess,
      callAsync: av.callAsync,
    }
    updateNode(nodeNew)
  }

  function showDrawer() {
    show()
    form.setFieldsValue({
      callProcess: node.callProcess,
      callAsync: node.callAsync,
    })
  }

  const text = useMemo(() => {
    return undefined;
  }, [node])

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title">
          <FaIconPro icon="fa-solid fa-user-large" />
          <span>{node.nodeName}</span>
          <NodeCloseBtn onClick={() => delNode()} />
        </div>
        <div className="content">
          {text ? text : '请选择子流程'}
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={node.nodeName} variant="filled" onChange={e => updateNodeProps(node, 'nodeName', e.target.value)} />
        )}
      >
        <Form form={form} layout="vertical" className="fa-flex-column fa-full" disabled={readOnly}
          onValuesChange={(cv, av) => {
            handleValuesChange(av)
          }}
        >
          <FaFlexRestLayout>
            <Form.Item name="callProcess" label="子流程" rules={[{required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item name="callAsync" valuePropName="checked">
              <Checkbox>异步执行</Checkbox>
            </Form.Item>
          </FaFlexRestLayout>
        </Form>
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}
