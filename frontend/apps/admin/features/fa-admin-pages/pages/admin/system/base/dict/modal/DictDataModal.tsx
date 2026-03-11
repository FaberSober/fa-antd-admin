import { dictDataApi as api } from '@/services';
import { Admin } from '@/types';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { BaseBoolRadio, CommonModalProps, DragModal, Fa, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { Button, Form, Input } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';
import DictDataCascade from "../helper/DictDataCascade";


interface DictDataModalProps extends CommonModalProps<Admin.DictData> {
  dictId: number;
  parentId?: number;
  type: 'list'|'tree'
}

/**
 * BASE-字典值实体新增、编辑弹框
 */
export default function DictDataModal({ children, title, record, fetchFinish, addBtn, editBtn, dictId, parentId, type, ...props }: DictDataModalProps) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增字典值');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新字典值');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      dictId,
      // birthday: FaUtils.getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      parentId: get(record, 'parentId', parentId || Fa.Constant.TREE_SUPER_ROOT_ID),
      sortId: get(record, 'sortId'),
      label: get(record, 'label'),
      value: get(record, 'value'),
      isDefault: get(record, 'isDefault', false),
      valid: get(record, 'valid', true),
      description: get(record, 'description'),
      // birthday: FaUtils.getInitialKeyTimeValue(record, 'birthday'),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = useApiLoading([ api.getUrl('save'), api.getUrl('update')]);
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && <Button icon={<PlusOutlined />} type="primary">新增</Button>}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
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
        <Form form={form} onFinish={onFinish} {...FaUtils.formItemFullLayout}>
          {type === 'tree' && (
            <Form.Item name="parentId" label="上级节点" rules={[{ required: false }]}>
              <DictDataCascade dictId={dictId} placeholder="请输入上级节点" />
            </Form.Item>
          )}
          <Form.Item name="label" label="字典键" rules={[{ required: true }]}>
            <Input placeholder="请输入字典键" />
          </Form.Item>
          <Form.Item name="value" label="字典值" rules={[{ required: true }]}>
            <Input placeholder="请输入字典值" />
          </Form.Item>
          <Form.Item name="isDefault" label="是否默认值" rules={[{ required: true }]}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="valid" label="是否生效" rules={[{ required: true }]}>
            <BaseBoolRadio />
          </Form.Item>
          {/*<Form.Item name="sortId" label="排序" rules={[{ required: true }]}>*/}
          {/*  <InputNumber min={1} max={999999} placeholder="请输入排序" />*/}
          {/*</Form.Item>*/}
          <Form.Item name="description" label="描述" rules={[{ required: false }]}>
            <Input.TextArea autoSize placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
