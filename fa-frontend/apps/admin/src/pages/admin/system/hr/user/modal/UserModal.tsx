import React, {useContext, useState} from 'react';
import {get} from 'lodash';
import {Form, Input, Switch} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {formItemFullLayout, showResponse} from '@/utils/utils';
import modelService from '@/services/admin/user';
import rbacUserRoleApi from '@/services/rbac/rbacUserRole';
import Admin from '@/props/admin';
import {DictEnumApiRadio} from '@/components/base-dict';
import DepartmentCascade from "../helper/DepartmentCascade";
import {UploadImgLocal} from "@/components/base-uploader";
import RbacRoleSelect from "@/pages/admin/system/hr/role/components/RbacRoleSelect";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import useBus from "use-bus";


const serviceName = '用户';

interface IProps extends DragModalProps {
  title?: string;
  record?: Admin.User;
  fetchFinish?: () => void;
}

/**
 * 用户实体新增、编辑弹框
 */
export default function UserModal({ children, title, record, fetchFinish, ...props }: IProps) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  useBus(
    ['@@UserModal/SHOW_ADD'],
    ({ type, payload }) => {
      if (record === undefined) {
        form.setFieldsValue({ departmentId: payload.departmentId})
        setOpen(true)
      }
    },
    [record],
  )

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
      username: get(record, 'username'),
      tel: get(record, 'tel'),
      email: get(record, 'email'),
      password: get(record, 'password'),
      departmentId: get(record, 'departmentId'),
      sex: get(record, 'sex'),
      status: get(record, 'status', true),
      description: get(record, 'description'),
      post: get(record, 'post'),
      img: get(record, 'img'),
      roleIds: [],
    }
  }

  function showModal() {
    setOpen(true)

    form.setFieldsValue(getInitialValues())
    if (record !== undefined) {
      rbacUserRoleApi.getUserRoles(record.id).then((res) => {
        form.setFieldsValue({ roleIds: res.data.map((i) => i.id) })
      })
    }
  }

  const loading = loadingEffect[modelService.getUrl('save')] || loadingEffect[modelService.getUrl('update')]
  return (
    <span>
      <span onClick={() => showModal()}>{children}</span>
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
          <Form.Item name="departmentId" label="部门" rules={[{ required: true }]} {...formItemFullLayout}>
            <DepartmentCascade />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="账户" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="tel" label="手机号" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          {record === undefined && (
            <Form.Item name="password" label="密码" rules={[{ required: true }]} {...formItemFullLayout}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="roleIds" label="角色" rules={[{ required: true }]} {...formItemFullLayout}>
            <RbacRoleSelect mode="multiple" />
          </Form.Item>
          <Form.Item name="status" label="账户有效" rules={[{ required: true }]} {...formItemFullLayout} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="email" label="邮箱" {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别" {...formItemFullLayout}>
            <DictEnumApiRadio enumName="SexEnum" />
          </Form.Item>
          <Form.Item name="img" label="头像" {...formItemFullLayout}>
            <UploadImgLocal />
          </Form.Item>
          <Form.Item name="description" label="备注" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
