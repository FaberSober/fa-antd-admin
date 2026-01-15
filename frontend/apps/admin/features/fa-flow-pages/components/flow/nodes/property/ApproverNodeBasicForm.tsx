import { DepartmentCascade, RbacRoleSelect } from '@/components';
import { departmentApi, rbacRoleApi, userApi } from '@/services';
import { Flw, FlwEnums } from '@/types';
import { FaUtils, FormNumber, UserSearchSelect } from '@fa/ui';
import { Checkbox, Divider, Form, Input, InputNumber, Radio } from 'antd';
import { cloneDeep, get } from 'lodash';
import { useEffect } from 'react';
import { NodeSetTypeRadio } from '../../cubes';
import { useWorkFlowStore } from '../../stores/useWorkFlowStore';


const { NodeSetType } = FlwEnums;

export interface ApproverNodeBasicFormProps {
  node: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2026-01-09 15:20:31
 */
export default function ApproverNodeBasicForm({ node }: ApproverNodeBasicFormProps) {
  const [form] = Form.useForm();

  const updateNode = useWorkFlowStore(state => state.updateNode);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  useEffect(() => {
    const initValues: any = {
      ...node,
      nodeAssigneeIds: node.nodeAssigneeList ? node.nodeAssigneeList.map(item => item.id) : [],
    }
    if (initValues.setType === NodeSetType.code) {
      initValues.nodeAssigneeCodePath = get(node, 'extendConfig.nodeAssigneeCodePath')
    }
    form.setFieldsValue(initValues)
  }, []);

  async function onChange(fieldsValue: any) {
    try {
      const { nodeAssigneeIds, ...restFv } = fieldsValue;

      let nodeAssigneeList: Flw.FlowActor[] = []
      if (nodeAssigneeIds && nodeAssigneeIds.length > 0) {
        if (restFv.setType === NodeSetType.specifyMembers) {
          const res = await userApi.getByIds(fieldsValue.nodeAssigneeIds);
          nodeAssigneeList = res.data.map(i => ({ id: i.id, name: i.name }))
        } else if (restFv.setType === NodeSetType.role) {
          const res = await rbacRoleApi.getByIds(fieldsValue.nodeAssigneeIds);
          nodeAssigneeList = res.data.map(i => ({ id: i.id, name: i.name }))
        } else if (restFv.setType === NodeSetType.department) {
          const res = await departmentApi.getByIds(fieldsValue.nodeAssigneeIds);
          nodeAssigneeList = res.data.map(i => ({ id: i.id, name: i.name }))
        }
      }

      const nodeNew = {
        ...node,
        ...restFv,
        nodeAssigneeList,
      }
      updateNode(nodeNew);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Form form={form} layout="vertical" disabled={readOnly} className='fa-p12'
      onValuesChange={(cv, av) => {
        console.log('cv, av', cv, av)
        const avClone = cloneDeep(av)
        if (FaUtils.hasAnyProp(cv, ['setType'])) {
          form.setFieldsValue({ nodeAssigneeIds: [] })
          avClone.nodeAssigneeIds = []
        }
        onChange(avClone)
      }}
    >
      <Form.Item name="setType" label="审批人员类型" rules={[{ required: true }]}>
        <NodeSetTypeRadio />
      </Form.Item>
      {node.setType === NodeSetType.specifyMembers && (
        <Form.Item name="nodeAssigneeIds" label="审批人员" rules={[{ required: true }]}>
          <UserSearchSelect mode="multiple" />
        </Form.Item>
      )}
      {node.setType === NodeSetType.supervisor && (
        <Form.Item name="examineLevel" label="指定主管" rules={[{ required: true }]}>
          <InputNumber style={{ width: 230 }} addonBefore="发起人的第" addonAfter="级主管" min={1} max={100} changeOnWheel />
        </Form.Item>
      )}
      {node.setType === NodeSetType.role && (
        <Form.Item name="nodeAssigneeIds" label="选择角色" rules={[{ required: true }]}>
          <RbacRoleSelect mode="multiple" />
        </Form.Item>
      )}
      {node.setType === NodeSetType.department && (
        <Form.Item name="nodeAssigneeIds" label="选择部门" rules={[{ required: true }]}>
          <DepartmentCascade multiple changeOnSelect={false} />
        </Form.Item>
      )}
      {node.setType === NodeSetType.initiatorSelected && (
        <Form.Item name="selectMode" label="发起人自选">
          <Radio.Group
            options={[
              { label: '自选一个人', value: 1 },
              { label: '自选多个人', value: 2 },
            ]}
          />
        </Form.Item>
      )}
      {node.setType === NodeSetType.multiLevelSupervisors && (
        <>
          <Form.Item name="directorMode" label="连续主管审批终点">
            <Radio.Group
              options={[
                { label: '直到最上层主管', value: 0 },
                { label: '自定义审批终点', value: 1 },
              ]}
            />
          </Form.Item>
          {node.directorMode === 1 && (
            <Form.Item name="directorLevel" label="指定主管" rules={[{ required: true }]}>
              <FormNumber style={{ width: 230 }} addonBefore="直到发起人的第" addonAfter="级主管" min={1} max={100} changeOnWheel />
            </Form.Item>
          )}
        </>
      )}
      {node.setType === NodeSetType.code && (
        <Form.Item name="nodeAssigneeCodePath" label="代码接口" rules={[{ required: true }]}>
          <Input placeholder='请输入代码接口地址' />
        </Form.Item>
      )}

      <Divider />

      <Form.Item name="termAuto" valuePropName="checked">
        <Checkbox>超时自动审批</Checkbox>
      </Form.Item>
      {node.termAuto && (
        <>
          <Form.Item name="term" label="审批期限" tooltip="为 0 则不生效" rules={[{ required: true }]}>
            <FormNumber style={{ width: 230 }} addonAfter="小时" min={0} max={1000} changeOnWheel />
          </Form.Item>
          <Form.Item name="termMode" label="审批期限超时后执行">
            <Radio.Group
              options={[
                { label: '自动通过', value: 0 },
                { label: '自动拒绝', value: 1 },
              ]}
            />
          </Form.Item>
        </>
      )}

      <Divider />

      <Form.Item name="examineMode" label="多人审批时审批方式" rules={[{ required: true }]}>
        <Radio.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          options={[
            { label: '按顺序依次审批', value: 1 },
            { label: '会签 (可同时审批，每个人必须审批通过)', value: 2 },
            { label: '或签 (有一人审批通过即可)', value: 3 },
          ]}
        />
      </Form.Item>
    </Form>
  );
}
