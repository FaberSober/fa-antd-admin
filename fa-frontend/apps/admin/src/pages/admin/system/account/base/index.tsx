import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Form, Input} from 'antd';
import Admin from '@/props/admin';
import userService from '@/services/admin/user';
import {PageLoading} from '@/components/antd-pro';
import {showResponse} from '@/utils/utils';
import {UploadImgLocal} from "@/components/base-uploader";
import {UserLayoutContext} from "@/layout/UserLayout";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import {DictEnumApiSelector} from "@/components/base-dict";

const formItemFullLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const tailLayout = { wrapperCol: { offset: 8, span: 16 } };

/**
 * @author xu.pengfei
 * @date 2020/12/26
 */
export default function AccountBase() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { refreshUser } = useContext(UserLayoutContext);
  const [form] = Form.useForm();

  const [userDetail, setUserDetail] = useState<Admin.User>();

  useEffect(() => {
    userService.getLoginUser().then((res) => {
      const user = res.data;
      setUserDetail(user)
      form.setFieldsValue({
        img: user.img,
        username: user.username,
        name: user.name,
        tel: user.tel,
        sex: user.sex,
        email: user.email,
        address: user.address,
        description: user.description,
      })
    });
  }, []);

  function onFinish(fieldValues: any) {
    userService.updateMine(fieldValues).then((res) => {
      showResponse(res, '更新账户基本信息');
      refreshUser();
    })
  }

  if (userDetail === undefined) return <PageLoading />;

  const loading = loadingEffect[userService.getUrl('updateMine')]
  return (
    <Card title="基本信息">
      <div>
        <Form style={{ width: 600 }} form={form} onFinish={onFinish}>
          <Form.Item name="img" label="头像" {...formItemFullLayout}>
            <UploadImgLocal />
          </Form.Item>
          <Form.Item name="username" label="账户" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="tel" label="手机号" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别" {...formItemFullLayout}>
            <DictEnumApiSelector enumName="SexEnum" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="个人简介" {...formItemFullLayout}>
            <Input.TextArea maxLength={255} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={loading}>
              更新信息
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}
