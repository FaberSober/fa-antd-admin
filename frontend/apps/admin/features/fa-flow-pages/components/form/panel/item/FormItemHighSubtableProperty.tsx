import { Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useFaFormStore } from '../../stores/useFaFormStore';
import { flowFormTableApi } from '@features/fa-flow-pages/services';
import { Flow } from '@/types';

/**
 * @author xu.pengfei
 * @date 2026-01-31 20:02:57
 */
export default function FormItemHighSubtableProperty() {
  const flowForm = useFaFormStore((state) => state.flowForm);
  const [linkTables, setLinkTables] = useState<Flow.FlowFormTable[]>([]);
  
  useEffect(() => {
    // 加载关联子表列表
    if (flowForm?.id) {
      flowFormTableApi.list({ query: { flowFormId: flowForm.id }, sorter: "sort asc" })
        .then((res) => {
          setLinkTables(res.data || []);
        });
    }
  }, [flowForm?.id]);
  
  // 将关联子表转换为 Select 的 options 格式
  const subtableOptions = linkTables.map((table) => ({
    label: table.tableName + (table.remark ? ` (${table.remark})` : ''),
    value: table.tableName,
  }));
  
  return (
    <div>
      <Form.Item name="label" label="控件标题" rules={[{ required: true }]}>
        <Input allowClear />
      </Form.Item>
      <Form.Item name="subtable_tableName" label="关联子表" rules={[{ required: true }]}>
        <Select
          placeholder="选择关联子表"
          allowClear
          options={subtableOptions}
        />
      </Form.Item>
    </div>
  );
}