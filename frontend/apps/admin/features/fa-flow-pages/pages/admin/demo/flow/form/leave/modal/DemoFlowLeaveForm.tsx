import { demoFlowLeaveApi as api } from '@/services';
import { Flow } from '@/types';
import { FaUtils, UserSearchSelect } from '@fa/ui';
import { DatePicker, Form, FormInstance, Input, InputNumber } from 'antd';
import { get } from 'lodash';
import { useEffect } from 'react';


interface DemoFlowLeaveFormProps {
  form: FormInstance<any>;
  record?: Flow.DemoFlowLeave;
  onSuccess?: (record: Flow.DemoFlowLeave) => void;
  disabled?: boolean;
}

/**
 * DEMO-请假流程实体新增、编辑弹框
 */
export default function DemoFlowLeaveForm({ form, record, onSuccess, disabled }: DemoFlowLeaveFormProps) {

  useEffect(() => {
    form.setFieldsValue(getInitialValues())
  }, [record]);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增DEMO-请假流程');
      if (onSuccess) onSuccess(res.data);
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新DEMO-请假流程');
      if (onSuccess) onSuccess(res.data);
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      applyDate: FaUtils.getDateStr000(fieldsValue.applyDate),
      leaveStartTime: FaUtils.getDateStr000(fieldsValue.leaveStartTime, 'YYYY-MM-DD HH:mm:00'),
      leaveEndTime: FaUtils.getDateStr000(fieldsValue.leaveEndTime, 'YYYY-MM-DD HH:mm:00'),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      applyUserId: get(record, 'applyUserId'),
      applyDate: FaUtils.getInitialKeyTimeValue(record, 'applyDate'),
      applyReason: get(record, 'applyReason'),
      leaveDayCount: get(record, 'leaveDayCount'),
      leaveStartTime: FaUtils.getInitialKeyTimeValue(record, 'leaveStartTime'),
      leaveEndTime: FaUtils.getInitialKeyTimeValue(record, 'leaveEndTime'),
    }
  }

  return (
    <span>
      <Form form={form} onFinish={onFinish} {...FaUtils.formItemFullLayout} disabled={disabled}>
        <Form.Item name="applyUserId" label="请假员工" rules={[{ required: true }]}>
          <UserSearchSelect />
        </Form.Item>
        <Form.Item name="applyDate" label="申请日期" rules={[{ required: true }]}>
          <DatePicker placeholder="请输入申请日期" />
        </Form.Item>
        <Form.Item name="applyReason" label="请假原因" rules={[{ required: true }]}>
          <Input placeholder="请输入请假原因" />
        </Form.Item>
        <Form.Item name="leaveDayCount" label="请假天数" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} placeholder="请输入请假天数" />
        </Form.Item>
        <Form.Item name="leaveStartTime" label="开始时间" rules={[{ required: true }]}>
          <DatePicker showTime={{ format: 'HH:mm' }} placeholder="请输入开始时间" />
        </Form.Item>
        <Form.Item name="leaveEndTime" label="结束时间" rules={[{ required: true }]}>
          <DatePicker showTime={{ format: 'HH:mm' }} placeholder="请输入结束时间" />
        </Form.Item>
      </Form>
    </span>
  )
}
