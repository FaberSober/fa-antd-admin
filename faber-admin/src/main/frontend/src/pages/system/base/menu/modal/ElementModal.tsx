import React, {useContext, useEffect, useImperativeHandle, useState} from 'react';
import { get } from 'lodash';
import { Form, Input, Radio } from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/admin/element';
import Admin from '@/props/admin';
import MenuCascade from "@/pages/system/base/menu/helper/MenuCascade";
import MenuManageContext from "@/pages/system/base/menu/context/MenuManageContext";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '权限资源';

interface IProps extends DragModalProps {
  title?: string;
  record?: Admin.Element;
  fetchFinish?: () => void;
}

/**
 * 权限实体新增、编辑弹框
 */
function ElementModal({ children, title, record, fetchFinish, ...props }: IProps, ref: any) {
  const [form] = Form.useForm();
  const { viewBlock, viewMenu } = useContext(MenuManageContext)

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setModalVisible(true);
    },
  }));

  useEffect(() => {
    if (form && record !== undefined) {
      form.setFieldsValue({ menuId: viewMenu?.id });
    }
  }, [viewMenu]);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    setLoading(true);
    modelService.add(params).then((res) => {
      showResponse(res, `新增${serviceName}`);
      if (res && res.status === RES_CODE.OK) {
        setModalVisible(false);
        if (fetchFinish) fetchFinish();
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    setLoading(true);
    modelService.update(params.id, params).then((res) => {
      showResponse(res, `更新${serviceName}`);
      if (res && res.status === RES_CODE.OK) {
        setModalVisible(false);
        if (fetchFinish) fetchFinish();
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      menuId: viewMenu?.id,
      blockId: viewBlock?.id,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      menuId: get(record, 'menuId', viewMenu?.id),
      code: get(record, 'code'),
      type: get(record, 'type'),
      name: get(record, 'name'),
      uri: get(record, 'uri'),
      method: get(record, 'method'),
      description: get(record, 'description'),
    }
  }

  function showModal() {
    setModalVisible(true);
    form.setFieldsValue(getInitialValues());
  }

  return (
    <span>
      <span onClick={() => showModal()}>{children}</span>
      <DragModal
        title={title}
        visible={modalVisible}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <>
          {modalVisible && (
            <Form form={form} onFinish={onFinish} initialValues={getInitialValues()}>
              <Form.Item name="menuId" label="资源关联菜单" rules={[{ required: true }]} {...formItemFullLayout}>
                <MenuCascade blockId={viewBlock!.id} />
              </Form.Item>
              <Form.Item name="name" label="资源名称" rules={[{ required: true }]} {...formItemFullLayout}>
                <Input />
              </Form.Item>
              <Form.Item name="code" label="资源编码" rules={[{ required: true }]} {...formItemFullLayout}>
                <Input />
              </Form.Item>
              <Form.Item name="type" label="资源类型" rules={[{ required: true }]} {...formItemFullLayout}>
                <Radio.Group
                  options={[
                    { label: 'button', value: 'button' },
                    { label: 'uri', value: 'uri' },
                  ]}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
              <Form.Item name="uri" label="资源路径" rules={[{ required: false }]} {...formItemFullLayout}>
                <Input />
              </Form.Item>
              <Form.Item name="method" label="资源请求类型" rules={[{ required: false }]} {...formItemFullLayout}>
                <Radio.Group
                  options={[
                    { label: 'GET', value: 'GET' },
                    { label: 'POST', value: 'POST' },
                    { label: 'PUT', value: 'PUT' },
                    { label: 'DELETE', value: 'DELETE' },
                  ]}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
              <Form.Item name="description" label="描述" {...formItemFullLayout}>
                <Input.TextArea />
              </Form.Item>
            </Form>
          )}
        </>
      </DragModal>
    </span>
  );
}

export default React.forwardRef(ElementModal);
