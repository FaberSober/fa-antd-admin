import React, { useContext, useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { DragModal, FaHref, ApiEffectLayoutContext, FaUtils, CommonModalProps } from '@fa/ui';
import { flowProcessApi as api } from '@/services';
import { FlowCatagoryCascader } from "@features/fa-flow-pages/components";
import { Flow } from '@/types';


/**
 * FLOW-流程定义实体新增、编辑弹框
 */
export default function FlowProcessModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Flow.FlowProcess>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增FLOW-流程定义');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新FLOW-流程定义');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: FaUtils.getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      catagoryId: get(record, 'catagoryId'),
      processKey: get(record, 'processKey'),
      processName: get(record, 'processName'),
      processIcon: get(record, 'processIcon'),
      processType: get(record, 'processType'),
      processVersion: get(record, 'processVersion'),
      instanceUrl: get(record, 'instanceUrl'),
      remark: get(record, 'remark'),
      useScope: get(record, 'useScope'),
      processState: get(record, 'processState'),
      modelContent: get(record, 'modelContent'),
      sort: get(record, 'sort'),
      // birthday: FaUtils.getInitialKeyTimeValue(record, 'birthday'),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = loadingEffect[api.getUrl('save')] || loadingEffect[api.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && <Button icon={<PlusOutlined />} type="primary">新增</Button>}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish} {...FaUtils.formItemFullLayout}>
          <Form.Item name="catagoryId" label="流程分类" rules={[{ required: true }]}>
            <FlowCatagoryCascader />
          </Form.Item>
          <Form.Item name="processKey" label="流程定义" tooltip="流程定义 key 唯一标识" rules={[{ required: true }]}>
            <Input placeholder="请输入流程定义 key 唯一标识" />
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
          {/*<Form.Item name="processVersion" label="流程版本，默认 1" rules={[{ required: true }]}>*/}
          {/*  <Input placeholder="请输入流程版本，默认 1" />*/}
          {/*</Form.Item>*/}
          <Form.Item name="instanceUrl" label="实例地址" rules={[{ required: false }]}>
            <Input placeholder="请输入实例地址" />
          </Form.Item>
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
          {/* <Form.Item name="modelContent" label="流程模型定义JSON内容" rules={[{ required: true }]}>
            <Input placeholder="请输入流程模型定义JSON内容" />
          </Form.Item> */}
          <Form.Item name="sort" label="排序ID" rules={[{ required: false }]}>
            <InputNumber min={0} max={999999} placeholder="请输入排序ID" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
