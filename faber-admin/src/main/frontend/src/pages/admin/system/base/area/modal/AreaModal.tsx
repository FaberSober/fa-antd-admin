import React, {useContext, useRef, useState} from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/admin/area';
import Admin from '@/props/admin';
import { DictDataSelector } from '@/components/base-dict';
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import FaberEnums from "@/props/base/FaberEnums";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '中国行政地区表';

interface IProps extends DragModalProps {
  title?: string;
  record?: Admin.Area;
  fetchFinish?: () => void;
}

/**
 * 中国行政地区表实体新增、编辑弹框
 */
export default function AreaModal({ children, title, record, fetchFinish, ...props }: IProps) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    modelService.add(params).then((res) => {
        showResponse(res, `新增${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
          if (fetchFinish) fetchFinish();
        }
      })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    modelService.update(params.id, params).then((res) => {
        showResponse(res, `更新${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
          if (fetchFinish) fetchFinish();
        }
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
    }
  }

  function showModal() {
    setModalVisible(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = loadingEffect[modelService.getUrl('add')] || loadingEffect[modelService.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>{children}</span>
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
          <Form.Item name="level" label="层级" rules={[{ required: true }]} {...formItemFullLayout}>
            <DictDataSelector dictLabel="common_area_level" />
          </Form.Item>
          <Form.Item name="parentCode" label="父级行政代码" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="areaCode" label="行政代码" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="zipCode" label="邮政编码" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="cityCode" label="区号" rules={[{ required: false }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="shortName" label="简称" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="mergerName" label="组合名" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="pinyin" label="拼音" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="lng" label="经度" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="lat" label="纬度" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
