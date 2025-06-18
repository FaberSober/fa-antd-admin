import React from 'react';
import { Button, Card, Form, Input, Modal } from 'antd';
import {BaseTinyMCE, FaUtils} from '@fa/ui';

/**
 * @author xu.pengfei
 * @date 2022/10/12
 */
export default function tinymce() {
  const [form] = Form.useForm();

  function handleFinish(fieldValues: any) {
    Modal.confirm({
      title: `标题：${fieldValues.title}`,
      content: (
        <div>
          <div>内容：</div>
          <div dangerouslySetInnerHTML={{ __html: fieldValues.content }} />
        </div>
      ),
    });
  }

  return (
    <div className="fa-full-content fa-p12">
      <Card title="直接使用" className="fa-mb12">
        <BaseTinyMCE style={{ width: 800, height: 300 }} />
      </Card>

      <Card title="自定义的工具栏" className="fa-mb12">
        <ol>
          <li>在toolbar中新增一个自定义的按钮key，如：faDateBtn</li>
          <li>在setup方法中editor.ui.registry.addButton('faDateBtn', {})来新增自定义按钮</li>
        </ol>
        <BaseTinyMCE
          style={{ width: 800, height: 300 }}
          editorInit={{
            toolbar: 'faDateBtn',
            setup: (editor:any) => {
              /* 插入当前日期 */
              editor.ui.registry.addButton('faDateBtn', {
                text: '日期',
                tooltip: '插入当前日期',
                onAction: () => {
                  editor.insertContent(`<span>${FaUtils.getCurDate()}</span>`);
                }
              });
            },
          }}
        />
      </Card>

      <Card title="在From表单中使用" className="fa-mb12">
        <Form form={form} onFinish={handleFinish}>
          <Form.Item name="title" label="文章标题">
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item name="content" label="文章内容">
            <BaseTinyMCE style={{ width: 800, height: 300 }} />
          </Form.Item>
          <Button onClick={() => form.submit()} type="primary">
            提交
          </Button>
        </Form>
      </Card>
    </div>
  );
}
