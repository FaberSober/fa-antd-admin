import React, { useContext, useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { DragModal, Fa, FaHref, ApiEffectLayoutContext, FaUtils, CommonModalProps } from '@fa/ui';
import { flowCatagoryApi as api } from '@/services';
import { Flow } from '@/types';
import { FlowCatagoryCascader } from "@features/fa-flow-pages/components";


interface FlowCatagoryModalProps extends CommonModalProps<Flow.FlowCatagory> {
  parentId?: number;
}

/**
 * FLOW-流程分类实体新增、编辑弹框
 */
export default function FlowCatagoryModal({ children, title, record, fetchFinish, addBtn, editBtn, parentId = Fa.Constant.TREE_SUPER_ROOT_ID, ...props }: CommonModalProps<Flow.FlowCatagory>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增FLOW-流程分类');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新FLOW-流程分类');
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
      parentId: get(record, 'parentId', parentId),
      name: get(record, 'name'),
      sort: get(record, 'sort'),
      icon: get(record, 'icon'),
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
          <Form.Item name="parentId" label="上级节点" rules={[{ required: true }]}>
            <FlowCatagoryCascader showRoot />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          {/*<Form.Item name="icon" label="图标">*/}
          {/*  <Input placeholder="请输入图标" />*/}
          {/*</Form.Item>*/}
        </Form>
      </DragModal>
    </span>
  )
}
