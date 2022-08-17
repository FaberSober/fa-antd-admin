import React, { useContext, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Button, Card, Form, Input, message } from 'antd';
import userService from '@/services/admin/user';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import { UserContext } from '@/layout/UserSimpleLayout';

const formItemFullLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const tailLayout = { wrapperCol: { offset: 8, span: 16 } };

/**
 * @author xu.pengfei
 * @date 2020/12/26
 */
export default function AccountPwdUpdate(props: RouteComponentProps) {
  const { logout } = useContext(UserContext);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  function onFinish(fieldValues: any) {
    setLoading(true);
    userService
      .accountBaseUpdatePwd(fieldValues)
      .then((res) => {
        setLoading(false);
        if (res && res.status === RES_CODE.OK) {
          message.info('更新密码成功，即将退出重新登录').then(() => {
            logout();
          });
        } else {
          showResponse(res, '更新密码');
        }
      })
      .catch(() => setLoading(false));
  }

  async function validateNewPwd(rule: any, value: any) {
    form.setFieldsValue({ newPwdConfirm: undefined });
    const oldPwd = form.getFieldValue('oldPwd');
    if (oldPwd === value) {
      throw new Error('新旧密码不能一样');
    }
  }

  async function validateNewPwdConfirm(rule: any, value: any) {
    const newPwd = form.getFieldValue('newPwd');
    if (newPwd !== value) {
      throw new Error('两次输入密码不一致');
    }
  }

  return (
    <Card title="基本信息">
      <div>
        <Form style={{ width: 600 }} form={form} onFinish={onFinish}>
          <Form.Item name="oldPwd" label="原密码" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>
          <Form.Item name="newPwd" label="新密码" rules={[{ required: true }, { validator: validateNewPwd }]} {...formItemFullLayout}>
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item name="newPwdConfirm" label="新密码确认" rules={[{ required: true }, { validator: validateNewPwdConfirm }]} {...formItemFullLayout}>
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={loading}>
              更新密码
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}
