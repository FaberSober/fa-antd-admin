import { Flow } from '@/types';
import { Checkbox, Form, Input, InputNumber, Popconfirm, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { SHOW_PRECISION, SHOW_SCALE } from '../utils';
import { flowFormApi } from '@/services';
import { FaUtils } from '@fa/ui';


const SYSTEM_FIELDS = ['id', 'crt_time', 'crt_user', 'upd_time', 'upd_user', 'deleted', 'flow_instance_id', 'tenant_id'];

export interface FormTableColumnEditProps {
  column: Flow.TableColumnVo;
  tableName: string;
  onSuccess?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 16:34:38
 */
export default function FormTableColumnEdit({ column, tableName, onSuccess }: FormTableColumnEditProps) {
  const [form] = Form.useForm();
  const [dataType, setDataType] = useState(column.dataType);

  useEffect(() => {
    setDataType(column.dataType);
    form.setFieldsValue({
      ...column,
      nullable: column.nullable === 'NO',
    });
  }, []);

  function onFinish(fieldsValue: any) {
    flowFormApi.updateColumn({
      tableName,
      column: {
        ...fieldsValue,
        nullable: fieldsValue.nullable ? 'NO' : 'YES',
      },
    }).then(res => {
      FaUtils.showResponse(res, '更新字段');
      onSuccess && onSuccess();
    })
  }

  const isSystemField = SYSTEM_FIELDS.includes(column.field);

  const isPk = column.key === 'PRI';
  const showPrecision = SHOW_PRECISION.includes(dataType);
  const showScale = SHOW_SCALE.includes(dataType);

  return (
    <Form form={form} onFinish={onFinish} disabled={isSystemField} style={{flex: 1}}
      onValuesChange={(cv, av) => {
        if (av.dataType && av.dataType !== dataType) {
          setDataType(av.dataType);
        }
      }}
    >
      <div className='fa-flex-1 fa-flex-row-center fa-gap6' style={{  }}>
        <div style={{ width: 120 }}>
          {isSystemField ? <span style={{ color: 'rgba(200, 0, 0, 1)' }}>{column.field}</span> : (
            <Form.Item name="field" noStyle rules={[{ required: true }]}>
              <Input variant="filled" />
            </Form.Item>
          )}
        </div>
        <div style={{ width: 120 }}>
          <Form.Item name="dataType" noStyle rules={[{ required: true }]}>
            <Select style={{ width: '100%' }}
              options={[
                { label: 'int', value: 'int' },
                { label: 'bigint', value: 'bigint' },
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
        <div style={{ width: 80 }}>
          <Form.Item name="length" noStyle>
            <InputNumber variant="filled" style={{width: '100%'}} />
          </Form.Item>
        </div>
        <div style={{ width: 80 }}>
          {showPrecision && (
            <Form.Item name="precision" noStyle>
              <InputNumber variant="filled" style={{width: '100%'}} />
            </Form.Item>
          )}
        </div>
        <div style={{ width: 80 }}>
          {showScale && (
            <Form.Item name="scale" noStyle>
              <InputNumber variant="filled" style={{width: '100%'}} />
            </Form.Item>
          )}
        </div>
        <div style={{ width: 40, textAlign: 'center' }}>
          <Form.Item name="nullable" valuePropName="checked" noStyle>
            <Checkbox disabled={isPk} />
          </Form.Item>
        </div>
        <div style={{ width: 200 }}>
          <Form.Item name="defaultValue" noStyle>
            <Input variant="filled" />
          </Form.Item>
        </div>
        <div style={{ width: 40, textAlign: 'center' }}>
          {isPk && <Checkbox checked={column.key === 'PRI'} />}
        </div>
        <div style={{ width: 40, textAlign: 'center' }}>
          {isPk && <Checkbox checked={column.extra === 'auto_increment'} />}
        </div>
        <div style={{ flex: 1 }}>
          <Form.Item name="comment" noStyle>
            <Input variant="filled" />
          </Form.Item>
        </div>
        <div style={{ width: 64 }}>
          {!isSystemField && (
            <Space>
              <a onClick={() => form.submit()}>更新</a>
              <Popconfirm
                title="确定删除该字段吗？"
                description="删除后数据将不可恢复，请谨慎操作！"
                okButtonProps={{ danger: true }}
                okText="删除"
                onConfirm={() => {
                  return flowFormApi.deleteColumn({
                    tableName,
                    column: column.field,
                  }).then(res => {
                    FaUtils.showResponse(res, '删除字段');
                    onSuccess && onSuccess();
                  });
                }}
              >
                <a style={{color: 'red'}}>删除</a>
              </Popconfirm>
            </Space>
          )}
        </div>
      </div>
    </Form>
  );
}
