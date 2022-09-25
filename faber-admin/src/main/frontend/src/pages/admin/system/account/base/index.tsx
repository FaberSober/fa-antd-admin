import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Form, Input} from 'antd';
import Admin from '@/props/admin';
import userService from '@/services/admin/user';
import {RES_CODE} from '@/configs/server.config';
import {DictDataRadio} from '@/components/base-dict';
import {PageLoading} from '@/components/antd-pro';
import {showResponse} from '@/utils/utils';
import {UserContext} from '@/layout/UserSimpleLayout';
import {UploadImgQiniu} from "@/components/base-uploader";

const formItemFullLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const tailLayout = { wrapperCol: { offset: 8, span: 16 } };

/**
 * @author xu.pengfei
 * @date 2020/12/26
 */
export default function AccountBase() {
  const { refreshUser } = useContext(UserContext);
  const [form] = Form.useForm();

  const [userDetail, setUserDetail] = useState<Admin.User>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userService.accountBase().then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setUserDetail(res.data);
      }
    });
  }, []);

  function onFinish(fieldValues: any) {
    setLoading(true);
    userService
      .accountBaseUpdate(fieldValues)
      .then((res) => {
        showResponse(res, '更新账户基本信息');
        setLoading(false);
        refreshUser();
      })
      .catch(() => setLoading(false));
  }

  if (userDetail === undefined) return <PageLoading />;

  return (
    <Card title="基本信息">
      <div>
        <Form
          style={{ width: 600 }}
          form={form}
          onFinish={onFinish}
          initialValues={{
            img: userDetail?.img,
            username: userDetail?.username,
            name: userDetail?.name,
            tel: userDetail?.tel,
            sex: userDetail?.sex,
            email: userDetail?.email,
            address: userDetail?.address,
            description: userDetail?.description,
          }}
        >
          <Form.Item name="img" label="头像" {...formItemFullLayout}>
            <UploadImgQiniu prefix="/head/img" />
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
            <DictDataRadio dictLabel="common_sex" />
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
