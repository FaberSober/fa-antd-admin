import { mediaVideoApi as api } from '@/services';
import { Media } from '@/types';
import { PlusOutlined } from "@ant-design/icons";
import { CommonModalProps, DragModal, FaUtils, UploadFileQiniu, useApiLoading } from '@fa/ui';
import { Button, Form } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';


/**
 * 媒体-视频信息表实体新增、编辑弹框
 */
export default function MediaVideoModal({ children, title, record, fetchFinish, ...props }: CommonModalProps<Media.MediaVideo>) {
  const loading = useApiLoading([ api.getUrl('create')]);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.create(params).then((res) => {
      FaUtils.showResponse(res, '新增媒体-视频信息表');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: FaUtils.getDateStr000(fieldsValue.birthday),
    };
    invokeInsertTask({ ...values });
  }

  function getInitialValues() {
    return {
      originFileId: get(record, 'originFileId'),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  return (
    <span>
      <span onClick={showModal}>
        <Button icon={<PlusOutlined />} type="primary">新增</Button>
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={800}
        {...props}
      >
        <Form form={form} onFinish={onFinish} className='fa-grid2 fa-mt12' {...FaUtils.formItemHalfLayout}>
          <Form.Item name="originFileId" label="视频上传" rules={[{ required: true }]} style={{ gridColumn: 'span 2' }} {...FaUtils.formItemFullLayout}>
            <UploadFileQiniu prefix="media" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
