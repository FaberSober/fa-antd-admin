import React, {useContext, useImperativeHandle, useState} from 'react';
import {get} from 'lodash';
import {Form, Input} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {showResponse, formItemFullLayout} from '@/utils/utils';
import modelService from '@/services/admin/user';
import rbacUserRoleApi from '@/services/rbac/rbacUserRole';
import Admin from '@/props/admin';
import {DictDataRadio} from '@/components/base-dict';
import DepartmentCascade from "../helper/DepartmentCascade";
import {UploadImgQiniu} from "@/components/base-uploader";
import RbacRoleSelect from "@/pages/admin/system/hr/role/components/RbacRoleSelect";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import FaEnums from "@/props/base/FaEnums";


const serviceName = '用户';

interface IProps extends DragModalProps {
  // parentId?: string;
  title?: string;
  record?: Admin.User;
  fetchFinish?: () => void;
  departmentId?: string;
  addLoc?: { lng: number, lat: number },
}

/**
 * 用户实体新增、编辑弹框
 */
function UserModal({ children, title, record, fetchFinish, departmentId, addLoc, ...props }: IProps, ref: any) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      showModal();
    },
  }));

  // useEffect(() => {
  //   if (record !== undefined) {
  //     form.setFieldsValue({ departmentId });
  //   }
  // }, [departmentId]);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    modelService.save(params).then((res) => {
      showResponse(res, `新增${serviceName}`);
      setModalVisible(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    modelService.update(params.id, params).then((res) => {
      showResponse(res, `更新${serviceName}`);
      setModalVisible(false);
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
      departmentId: get(record, 'departmentId', departmentId),
      sex: get(record, 'sex', FaEnums.SexEnum.UNKNOWN),
      status: get(record, 'status', true),
      description: get(record, 'description'),
      post: get(record, 'post'),
      img: get(record, 'img'),
      lng: get(record, 'lng', addLoc?.lng),
      lat: get(record, 'lat', addLoc?.lat),
      roleIds: [],
    }
  }

  function showModal() {
    setModalVisible(true)

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
        open={modalVisible}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
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
          <Form.Item name="status" label="状态" rules={[{ required: true }]} {...formItemFullLayout}>
            <DictDataRadio dictLabel="common_user_status" transValue={(v) => Number(v)} />
          </Form.Item>
          <Form.Item name="email" label="邮箱" {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别" {...formItemFullLayout}>
            <DictDataRadio dictLabel="common_sex" transValue={(v) => Number(v)} />
          </Form.Item>
          <Form.Item name="img" label="头像" {...formItemFullLayout}>
            <UploadImgQiniu prefix="/head/img" />
          </Form.Item>
          <Form.Item name="description" label="备注" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}

export default React.forwardRef(UserModal);
