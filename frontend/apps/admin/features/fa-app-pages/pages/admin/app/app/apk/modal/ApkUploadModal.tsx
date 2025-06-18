import React, { useContext, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import { ApiEffectLayoutContext, type CommonModalProps, DragModal, FaUtils, UploadFileLocal, UploadImgLocal } from '@fa/ui';
import { apkApi as api } from '@/services';
import type { App } from '@/types';


/**
 * APP-APK表实体新增、编辑弹框
 */
export default function ApkUploadModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<App.Apk>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    api.create(fieldsValue).then((res) => {
      FaUtils.showResponse(res, '新增APK');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  function getInitialValues() {
    return {
      fileId: undefined,
      name: undefined,
      shortCode: undefined,
      applicationId: undefined,
      versionCode: undefined,
      versionName: undefined,
      iconId: undefined,
      remark: undefined,
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = loadingEffect[api.getUrl('add')] || loadingEffect[api.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>
        <Button icon={<UploadOutlined />} type="primary">上传</Button>
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
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={(cv) => {
            if (cv.fileId) {
              // 调用接口获取上传apk的文件信息
              api.getApkInfo(cv.fileId).then(res => {
                form.setFieldsValue(res.data)
              })
            }
          }}
        >
          <Form.Item name="fileId" label="选择APK" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <UploadFileLocal accept=".apk" />
          </Form.Item>
          <Form.Item name="name" label="应用名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="shortCode" label="短链地址" rules={[{ required: true, len: 4 }, { pattern: FaUtils.REGEX_CHAR_NUM, message: '只可输入数字或字母' }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="applicationId" label="应用包名" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="versionCode" label="当前版本号" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="versionName" label="当前版本名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="iconId" label="图标文件" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <UploadImgLocal disabled />
          </Form.Item>
          <Form.Item name="remark" label="版本信息" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input.TextArea autoSize />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
