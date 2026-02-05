import { flowFormApi } from '@/services';
import { FaUtils } from '@fa/ui';
import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import { useState } from 'react';
import { SHOW_PRECISION, SHOW_SCALE } from '../utils';


export interface FormTableColumnEditProps {
  tableName: string;
  onSuccess?: (newField: string) => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 16:34:38
 */
export default function FormTableColumnAdd({ tableName, onSuccess }: FormTableColumnEditProps) {
  const [form] = Form.useForm();
  const [dataType, setDataType] = useState('');

  function onFinish(fieldsValue: any) {
    flowFormApi.createColumn({
      tableName,
      column: {
        ...fieldsValue,
        nullable: fieldsValue.nullable ? 'NO' : 'YES',
      },
    }).then(res => {
      FaUtils.showResponse(res, '新增字段');
      onSuccess && onSuccess(fieldsValue.field);
      form.resetFields();
      setDataType('')
    })
  }

  const showPrecision = SHOW_PRECISION.includes(dataType);
  const showScale = SHOW_SCALE.includes(dataType);

  return (
    <Form form={form} onFinish={onFinish} initialValues={{
      nullable: false,
    }}
      onValuesChange={(cv, av) => {
        if (av.dataType && av.dataType !== dataType) {
          setDataType(av.dataType);
          if (av.dataType === 'decimal') {
            form.setFieldsValue({ length: 10, precision: 2 });
          } else if (av.dataType === 'float' || av.dataType === 'double') {
            form.setFieldsValue({ length: 16, precision: 4 });
          } else if (av.dataType === 'varchar') {
            form.setFieldsValue({ length: 255 });
          } else if (av.dataType === 'int') {
            form.setFieldsValue({ length: 11 });
          } else if (av.dataType === 'bigint') {
            form.setFieldsValue({ length: 20 });
          } else {
            form.setFieldsValue({ length: undefined, precision: undefined, scale: undefined });
          }
        }
      }}
    >
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
                { label: 'varchar', value: 'varchar' },
                { label: 'int', value: 'int' },
                { label: 'bigint', value: 'bigint' },
                { label: 'float', value: 'float' },
                { label: 'double', value: 'double' },
                { label: 'decimal', value: 'decimal' },
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
          {showPrecision && (
            <Form.Item name="precision" noStyle>
              <InputNumber variant="filled" style={{width: '100%'}} />
            </Form.Item>
          )}
        </div>
        {/* scale */}
        <div style={{ width: 80 }}>
          {showScale && (
            <Form.Item name="scale" noStyle>
              <InputNumber variant="filled" style={{width: '100%'}} />
            </Form.Item>
          )}
        </div>
        {/* nullable */}
        <div style={{ width: 40, textAlign: 'center' }}>
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
          <Form.Item name="comment" noStyle rules={[{ required: true }]}>
            <Input variant="filled" />
          </Form.Item>
        </div>
        <div style={{}}>
          <a onClick={() => form.submit()}>新增</a>
        </div>
        <div style={{ width: 24 }}>
        </div>
      </div>
    </Form>
  );
}
