import React, { useContext, useState } from 'react';
import { get } from 'lodash';
import {Form, Input, DatePicker, Button} from 'antd';
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import {FaHref} from "@/components/decorator";
import DragModal from '@/components/modal/DragModal';
import BaseBoolRadio from "@/components/base-dict/BaseBoolRadio";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import { getDateStr000, getInitialKeyTimeValue, showResponse, formItemFullLayout } from '@/utils/utils';
import api from '@/services/demo/student';
import Fa from '@/props/base/Fa';
import Demo from '@/props/demo';
import {DictEnumApiSelector} from "@/components/base-dict";


/**
 * Demo-学生表实体新增、编辑弹框
 */
export default function StudentModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: Fa.CommonModalProps<Demo.Student>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      showResponse(res, '新增学生');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      showResponse(res, '更新学生');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      birthday: getDateStr000(fieldsValue.birthday),
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
      age: get(record, 'age'),
      sex: get(record, 'sex'),
      email: get(record, 'email'),
      birthday: getInitialKeyTimeValue(record, 'birthday'),
      valid: get(record, 'valid'),
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
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" label="学生名" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别" rules={[{ required: true }]} {...formItemFullLayout}>
            <DictEnumApiSelector enumName="SexEnum" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="生日" rules={[{ required: true }]} {...formItemFullLayout}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="valid" label="账户是否有效" rules={[{ required: true }]} {...formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
