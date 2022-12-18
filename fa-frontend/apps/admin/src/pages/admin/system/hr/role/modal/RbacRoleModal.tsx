import React, {useContext, useState} from 'react';
import {get} from 'lodash';
import {Form, Input} from 'antd';
import DragModal from '@/components/modal/DragModal';
import {formItemFullLayout, showResponse} from '@/utils/utils';
import modelService from '@/services/rbac/rbacRole';
import * as Rbac from '@/props/rbac';
import {BaseBoolRadio} from "@/components/base-dict";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import * as Fa from "@/props/base/Fa";


const serviceName = '角色';

/**
 * BASE-角色表实体新增、编辑弹框
 */
export default function RbacRoleModal({ children, title, record, fetchFinish, ...props }: Fa.CommonModalProps<Rbac.RbacRole>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    modelService.save(params).then((res) => {
      showResponse(res, `新增${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    modelService.update(params.id, params).then((res) => {
      showResponse(res, `更新${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      name: get(record, 'name'),
      remarks: get(record, 'remarks'),
      status: get(record, 'status', true),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = loadingEffect[modelService.getUrl('save')] || loadingEffect[modelService.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" label="角色名称" rules={[{ required: true }, { max: 10 }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="remarks" label="角色描述" rules={[{ required: true }, { max: 100 }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="是否启用" rules={[{ required: true }]} {...formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
