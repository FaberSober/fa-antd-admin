import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

/**
 * @author xu.pengfei
 * @date 2025-12-22 20:26:02
 */
export default function TableDetailPanel() {
  const [form] = Form.useForm();
  const { flowForm, updateFlowFormTableConfigTableDetail } = useFlowFormEditStore()

  useEffect(() => {
    console.log('TableDetailPanel flowForm changed', flowForm)
    form.setFieldsValue(flowForm?.tableConfig?.table?.detail);
  }, [flowForm]);

  return (
    <Form form={form} className='fa-p12'
      onValuesChange={(cv, av) => {
        updateFlowFormTableConfigTableDetail({...flowForm!.tableConfig!.table!.detail, ...av});
      }}
    >
      <Form.Item name="type" label="表格形式" rules={[{ required: true }]}>
        <Select
          options={[
            { label: '普通表格', value: 'normal' },
            { label: '左侧树表格', value: 'leftTree' },
            { label: '编辑表格', value: 'editTable' },
            { label: '分组表格', value: 'groupTable' },
            { label: '树形表格', value: 'treeTable' },
          ]}
        />
      </Form.Item>
    </Form>
  );
}
