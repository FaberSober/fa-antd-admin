import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';
// 引入 dayjs（Ant Design 内置依赖，无需额外安装）
import type { Admin } from '@/types';
import { BaseBoolRadio, type CommonModalProps, DictDataSelector, DragModal, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { alertApi as api } from '@features/fa-admin-pages/services';
import dayjs from 'dayjs';

/**
 * BASE-告警信息实体新增、编辑弹框
 */
export default function AlertModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.Alert>) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增BASE-告警信息');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新BASE-告警信息');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    // 处理日期时间格式：dayjs对象 -> "YYYY-MM-DD HH:mm:ss"字符串
    const values = {
      ...fieldsValue,
      // 若选择了时间，转换为字符串；否则保持空
      dealTime: fieldsValue.dealTime ? fieldsValue.dealTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    // 回显时：字符串 -> dayjs对象（适配DatePicker要求）
    const dealTimeStr = get(record, 'dealTime');
    return {
      content: get(record, 'content'),
      type: get(record, 'type'),
      deal: get(record, 'deal'),
      dutyStaff: get(record, 'dutyStaff'),
      dealStaff: get(record, 'dealStaff'),
      dealTime: dealTimeStr ? dayjs(dealTimeStr) : null, // 使用dayjs转换
      dealDesc: get(record, 'dealDesc'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  const loading = useApiLoading([ api.getUrl('save'), api.getUrl('update')]);
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
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="type" label="告警类型" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <DictDataSelector dictLabel="alert.type" placeholder="请输入告警类型" />
          </Form.Item>
          <Form.Item name="content" label="告警内容" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入告警内容" />
          </Form.Item>
          <Form.Item name="deal" label="是否处理" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="dutyStaff" label="负责人" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item name="dealStaff" label="处理人" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入处理人" />
          </Form.Item>
          {/* 处理时间：支持年月日时分秒选择 */}
          <Form.Item name="dealTime" label="处理时间" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <DatePicker
              showTime={{  // 启用时间选择
                format: 'HH:mm:ss',
              }}
              format="YYYY-MM-DD HH:mm:ss"  // 显示格式
              placeholder="请选择处理时间"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="dealDesc" label="处理描述" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入处理描述" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
