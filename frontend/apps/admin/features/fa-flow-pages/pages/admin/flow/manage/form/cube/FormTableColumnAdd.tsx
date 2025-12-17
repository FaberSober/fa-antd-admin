import { flowFormApi } from '@/services';
import { FaUtils } from '@fa/ui';
import { Checkbox, Form, Input, InputNumber, Select } from 'antd';


export interface FormTableColumnEditProps {
  tableName: string;
  onSuccess?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 16:34:38
 */
export default function FormTableColumnAdd({ tableName, onSuccess }: FormTableColumnEditProps) {
  const [form] = Form.useForm();

  function onFinish(fieldsValue: any) {
    flowFormApi.createColumn({
      tableName,
      column: {
        ...fieldsValue,
        nullable: fieldsValue.nullable ? 'NO' : 'YES',
      },
    }).then(res => {
      FaUtils.showResponse(res, '新增字段');
      onSuccess && onSuccess();
      form.resetFields();
    })
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <div className='fa-flex-row-center fa-gap6' style={{ padding: 4, borderBottom: '1px solid var(--fa-border-color)' }}>
        {/* field */}
        <div style={{ width: 120 }}>
          <Form.Item name="field" noStyle rules={[{ required: true }]}>
            <Input variant="filled" />
          </Form.Item>
        </div>
        {/* dataType */}
        <div style={{ width: 120 }}>
          <Form.Item name="dataType" noStyle rules={[{ required: true }]}>
            <Select style={{ width: '100%' }}
              options={[
                { label: 'int', value: 'int' },
                { label: 'float', value: 'float' },
                { label: 'double', value: 'double' },
                { label: 'decimal', value: 'decimal' },
                { label: 'varchar', value: 'varchar' },
                { label: 'text', value: 'text' },
                { label: 'datetime', value: 'datetime' },
              ]}
            />
          </Form.Item>
        </div>
        {/* length */}
        <div style={{ width: 80 }}>
          <Form.Item name="length" noStyle>
            <InputNumber variant="filled" style={{width: '100%'}} />
          </Form.Item>
        </div>
        {/* precision */}
        <div style={{ width: 80 }}>
          <Form.Item name="precision" noStyle>
            <InputNumber variant="filled" style={{width: '100%'}} />
          </Form.Item>
        </div>
        {/* scale */}
        <div style={{ width: 80 }}>
          <Form.Item name="scale" noStyle>
            <InputNumber variant="filled" style={{width: '100%'}} />
          </Form.Item>
        </div>
        {/* nullable */}
        <div style={{ width: 40 }}>
          <Form.Item name="nullable" valuePropName="checked" noStyle>
            <Checkbox />
          </Form.Item>
        </div>
        {/* default value */}
        <div style={{ width: 200 }}>
          <Form.Item name="defaultValue" noStyle>
            <Input variant="filled" />
          </Form.Item>
        </div>
        {/* key */}
        <div style={{ width: 40 }}>
        </div>
        {/* extra */}
        <div style={{ width: 40 }}>
        </div>
        {/* comment */}
        <div style={{ flex: 1 }}>
          <Form.Item name="comment" noStyle>
            <Input variant="filled" />
          </Form.Item>
        </div>
        <div style={{ width: 30 }}>
          <a onClick={() => form.submit()}>新增</a>
        </div>
      </div>
    </Form>
  );
}
