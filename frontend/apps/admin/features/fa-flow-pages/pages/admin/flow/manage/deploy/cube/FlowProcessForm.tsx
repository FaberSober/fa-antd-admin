import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, FormInstance } from 'antd';
import { DictEnumApiSelector, FaUtils } from '@fa/ui';
import { FlowCatagoryCascader, FlowFormSelect } from "@features/fa-flow-pages/components";
import { Flow, FlowEnums } from '@/types';

interface FlowProcessFormProps {
  form?: FormInstance;
  initialValues?: Partial<Flow.FlowProcess>;
  onFinish?: (values: any) => void;
  readOnly?: boolean;
  type: 'create' | 'edit';
}

/**
 * 流程基础信息表单组件
 */
export default function FlowProcessForm({ form, initialValues, onFinish, readOnly, type }: FlowProcessFormProps) {
  const [formType, setFormType] = useState<any>();

  useEffect(() => {
    setFormType(initialValues?.formType)
  }, [initialValues]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      disabled={readOnly}
      onValuesChange={(cv, av) => {
        if (av.formType !== formType) {
          setFormType(av.formType)
        }
      }}
      {...FaUtils.formItemFullLayout}
    >
      <Form.Item name="catagoryId" label="流程分类" rules={[{ required: true }]}>
        <FlowCatagoryCascader />
      </Form.Item>
      <Form.Item name="processKey" label="流程定义" tooltip="流程定义 key 唯一标识，已发起的流程实例不会随之变化" rules={[{ required: true }]}>
        <Input placeholder="请输入流程定义 key 唯一标识" disabled={type === 'edit'} />
      </Form.Item>
      <Form.Item name="processName" label="流程名称" rules={[{ required: true }]}>
        <Input placeholder="请输入名称" />
      </Form.Item>
      <Form.Item name="processIcon" label="图标" rules={[{ required: false }]}>
        <Input placeholder="请输入图标" />
      </Form.Item>
      <Form.Item name="processType" label="类型" rules={[{ required: false }]}>
        <Input placeholder="请输入类型" />
      </Form.Item>
      <Form.Item name="instanceUrl" label="实例地址" rules={[{ required: false }]}>
        <Input placeholder="请输入实例地址" />
      </Form.Item>

      <Form.Item name="formType" label="表单类型" rules={[{ required: true }]}>
        <DictEnumApiSelector enumName='FlowProcessFormTypeEnum' placeholder="请选择表单类型" />
      </Form.Item>
      {formType === FlowEnums.FlowProcessFormType.CUSTOM && (
        <Form.Item name="formId" label="自定义表单" rules={[{ required: false }]}>
          <FlowFormSelect />
        </Form.Item>
      )}

      <Form.Item name="remark" label="备注说明" rules={[{ required: false }]}>
        <Input placeholder="请输入备注说明" />
      </Form.Item>
      <Form.Item name="useScope" label="使用范围" rules={[{ required: true }]}>
        <Select placeholder="请选择使用范围">
          <Select.Option value={0}>全员</Select.Option>
          <Select.Option value={1}>指定人员（业务关联）</Select.Option>
          <Select.Option value={2}>均不可提交</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="processState" label="流程状态" rules={[{ required: true }]}>
        <Select placeholder="请选择流程状态">
          <Select.Option value={0}>不可用</Select.Option>
          <Select.Option value={1}>可用</Select.Option>
          <Select.Option value={2}>历史版本</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="sort" label="排序ID" rules={[{ required: false }]}>
        <InputNumber min={0} max={999999} placeholder="请输入排序ID" />
      </Form.Item>
    </Form>
  );
}
