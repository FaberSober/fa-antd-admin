import React, { useContext, useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { ApiEffectLayoutContext, type CommonModalProps, DictEnumApiSelector, DragModal, FaHref, FaUtils } from '@fa/ui';
import type { Admin } from '@/types';
import { areaApi } from '@features/fa-admin-pages/services';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const serviceName = '';

/**
 * 中国行政地区表实体新增、编辑弹框
 */
export default function AreaModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.Area>) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    areaApi.save(params).then((res) => {
      FaUtils.showResponse(res, `新增${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    areaApi.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, `更新${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    if (record) {
      invokeUpdateTask({ ...record, ...fieldsValue });
    } else {
      invokeInsertTask({ ...fieldsValue });
    }
  }

  function getInitialValues() {
    return {
      level: get(record, 'level'),
      parentCode: get(record, 'parentCode'),
      areaCode: get(record, 'areaCode'),
      zipCode: get(record, 'zipCode'),
      cityCode: get(record, 'cityCode'),
      name: get(record, 'name'),
      shortName: get(record, 'shortName'),
      mergerName: get(record, 'mergerName'),
      pinyin: get(record, 'pinyin'),
      lng: get(record, 'lng'),
      lat: get(record, 'lat'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  const loading = loadingEffect[areaApi.getUrl('save')] || loadingEffect[areaApi.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && (
          <Button icon={<PlusOutlined />} type="primary">
            新增
          </Button>
        )}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal title={title} open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="level" label="层级" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <DictEnumApiSelector enumName="AreaLevelEnum" />
          </Form.Item>
          <Form.Item name="parentCode" label="父级行政代码" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="areaCode" label="行政代码" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="zipCode" label="邮政编码" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="cityCode" label="区号" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
            <Form.Item name="name" label="名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="shortName" label="简称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="mergerName" label="组合名" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="pinyin" label="拼音" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="lng" label="经度" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="lat" label="纬度" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
