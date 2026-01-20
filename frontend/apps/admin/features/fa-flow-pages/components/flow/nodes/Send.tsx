import { FaIcon } from "@fa/icons";
import { BaseDrawer, FaFlexRestLayout, useOpen, UserSearchSelect } from '@fa/ui';
import { userApi } from "@features/fa-admin-pages/services";
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";
import { Flw } from "@features/fa-flow-pages/types";
import { Form, Input } from "antd";
import { useMemo } from 'react';
import { NodeCloseBtn } from '../cubes';
import AddNode from './AddNode';
import { useDelNode } from "../hooks";


/**
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Send({ node, parentNode }: Flw.BasicNodeProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()

  const updateNode = useWorkFlowStore(state => state.updateNode);
  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  const { delNode } = useDelNode(node, parentNode);

  async function handleValuesChange(av: any) {
    try {
      const res = await userApi.getByIds(av.nodeAssigneeIds);
      const nodeAssigneeList = res.data.map(i => ({ id: i.id, name: i.name }))
      const nodeNew = {
        ...node,
        nodeAssigneeList,
      }
      updateNode(nodeNew)
    } catch (e) {
      console.error(e)
    }
  }

  function showDrawer() {
    show()
    form.setFieldsValue({
      nodeAssigneeIds: node.nodeAssigneeList ? node.nodeAssigneeList.map(item => item.id) : []
    })
  }

  const text = useMemo(() => {
    if (node.nodeAssigneeList && node.nodeAssigneeList.length > 0) {
      return node.nodeAssigneeList.map(item => item.name).join("、")
    } else {
      return "所有人"
    }
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
          {text ? text : '请选择人员'}
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
            <Form.Item name="nodeAssigneeIds" label="抄送人员" tooltip="抄送以站内信的形式发送给选定人员">
              <UserSearchSelect mode="multiple" />
            </Form.Item>
          </FaFlexRestLayout>
        </Form>
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}
