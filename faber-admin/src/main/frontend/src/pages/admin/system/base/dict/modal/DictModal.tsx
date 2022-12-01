import React, {useContext, useEffect, useImperativeHandle, useState} from 'react';
import {get} from 'lodash';
import {Button, Form, Input, InputNumber, Radio} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {showResponse} from '@/utils/utils';
import modelService from '@/services/admin/dict';
import Admin from '@/props/admin';
import DictTypeCascade from "../helper/DictTypeCascade";
import {ClearOutlined} from '@ant-design/icons';
import {UploadFileLocal} from "@/components/base-uploader";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '字典值';

interface IProps extends DragModalProps {
  title?: string;
  record?: Admin.Dict;
  fetchFinish?: () => void;
  type?: number;
}

/**
 * 字典值实体新增、编辑弹框
 */
function DictModal({ children, title, record, fetchFinish, type, ...props }: IProps, ref: any) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState(0);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setModalVisible(true);
    },
  }));

  useEffect(() => {
    if (form && record !== undefined) {
      form.setFieldsValue({ type });
    }
  }, [type]);

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
      // birthday: getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  async function validateCategory(rules: any, value: any) {
    if (value !== category) {
      setCategory(value);
    }
  }

  const initialValues = {
    type: get(record, 'type', type),
    category: get(record, 'category'),
    text: get(record, 'text'),
    value: get(record, 'value'),
    sort: get(record, 'sort'),
    description: get(record, 'description'),
  };

  function showModal() {
    setModalVisible(true);
    if (record) {
      setCategory(record.category);
    }
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }

  const loading = loadingEffect[modelService.getUrl('add')] || loadingEffect[modelService.getUrl('update')]
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
        bodyStyle={{ paddingRight: 24, position: 'relative' }}
        {...props}
      >
        <Form form={form} onFinish={onFinish} initialValues={initialValues}>
          <Button onClick={() => form.resetFields()} icon={<ClearOutlined />} style={{ position: 'absolute', bottom: -56, right: 145 }}>
            重置表单
          </Button>

          <Form.Item name="type" label="字典分组" rules={[{ required: true }]} {...formItemFullLayout}>
            <DictTypeCascade />
          </Form.Item>
          <Form.Item name="category" label="字典类型" rules={[{ required: true }, { validator: validateCategory }]} {...formItemFullLayout}>
            <Radio.Group
              options={[
                { label: '文本', value: 0 },
                { label: '文件', value: 1 },
              ]}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item name="text" label="字典文本" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          {category === 0 && (
            <Form.Item name="value" label="字典值" rules={[{ required: true }]} {...formItemFullLayout}>
              <Input />
            </Form.Item>
          )}
          {category === 1 && (
            <Form.Item name="value" label="字典值" rules={[{ required: true }]} {...formItemFullLayout}>
              <UploadFileLocal prefix="dict/file/dict" />
            </Form.Item>
          )}
          <Form.Item name="sort" label="排序" rules={[{ required: true }]} {...formItemFullLayout}>
            <InputNumber step={1} min={0} />
          </Form.Item>
          <Form.Item name="description" label="描述" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}

export default React.forwardRef(DictModal);
