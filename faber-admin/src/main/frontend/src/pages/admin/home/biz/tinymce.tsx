import React from 'react';
import BaseTinyMCE from "@/components/base-editor/BaseTinyMCE";
import {Button, Card, Form, Input, Modal} from "antd";

/**
 * @author xu.pengfei
 * @date 2022/10/12
 */
export default function tinymce() {
  const [form] = Form.useForm();

  function handleFinish(fieldValues:any) {
    Modal.confirm({
      title: `标题：${fieldValues.title}`,
      content: (
        <div>
          <div>内容：</div>
          <div dangerouslySetInnerHTML={{ __html: fieldValues.content }} />
        </div>
      ),
    })
  }

  return (
    <div className="fa-full-content fa-p12">
      <Card title="直接使用" style={{ marginBottom: 12 }}>
        <BaseTinyMCE style={{ width: 800, height: 500 }} />
      </Card>

      <Card title="在From表单中使用" style={{ marginBottom: 12 }}>
        <Form form={form} onFinish={handleFinish}>
          <Form.Item name="title" label="文章标题">
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item name="content" label="文章内容">
            <BaseTinyMCE style={{ width: 800, height: 500 }} />
          </Form.Item>
          <Button onClick={() => form.submit()} type="primary">提交</Button>
        </Form>
      </Card>
    </div>
  )
}
