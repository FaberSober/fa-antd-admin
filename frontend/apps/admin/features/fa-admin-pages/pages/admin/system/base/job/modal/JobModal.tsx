import React, { useContext, useState } from 'react';
import { find, get } from 'lodash';
import { Button, Form, Input, Select } from 'antd';
import { ApiEffectLayoutContext, type CommonModalProps, CronModal, DragModal, FaHref, FaUtils } from '@fa/ui';
import type { Admin } from '@/types';
import { jobApi } from '@features/fa-admin-pages/services';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const serviceName = '';

/**
 * 系统定时任务实体新增、编辑弹框
 */
export default function JobModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.Job>) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    jobApi.save(params).then((res) => {
      FaUtils.showResponse(res, `新增${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    jobApi.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, `更新${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
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
      jobName: get(record, 'jobName'),
      cron: get(record, 'cron', '0 * * * * ?'),
      clazzPath: get(record, 'clazzPath'),
      jobDesc: get(record, 'jobDesc'),
    };
  }

  function showModal() {
    setOpen(true);
    jobApi.getAllJobs().then((res) => setJobs(res.data.map((i) => ({ ...i, name: i.label, label: `${i.label}_${i.value}` }))));
    form.setFieldsValue(getInitialValues());
  }

  const loading = loadingEffect[jobApi.getUrl('save')] || loadingEffect[jobApi.getUrl('update')];
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
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={(v) => {
            // 同步设置任务名称
            if (v.clazzPath) {
              const job = find(jobs, (i) => i.value === v.clazzPath);
              if (job) {
                form.setFieldValue('jobName', job.name);
              }
            }
          }}
        >
          <Form.Item name="clazzPath" label="任务执行方法" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Select options={jobs} />
          </Form.Item>
          <Form.Item name="jobName" label="任务名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="cron" label="cron表达式" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input addonAfter={<CronModal initialValue={get(record, 'cron')} onChange={(v) => form.setFieldValue('cron', v)} />} />
          </Form.Item>
          <Form.Item name="jobDesc" label="任务描述" {...FaUtils.formItemFullLayout}>
            <Input.TextArea maxLength={255} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
