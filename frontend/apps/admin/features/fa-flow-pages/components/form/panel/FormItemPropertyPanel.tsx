import React, { useEffect, useMemo, useState } from 'react';
import { useFaFormStore } from '../stores/useFaFormStore';
import { findParentFormItem } from '../utils';
import { cloneDeep, isNil } from 'lodash';
import { Button, Empty, Form, Input, Select, Space, Tag } from 'antd';
import FormItemInputProperty from './item/FormItemInputProperty';
import { SyncOutlined } from '@ant-design/icons';
import { FaUtils } from '@fa/ui';
import { FaFormItemsFieldTypes, FaFormItemTypeOptions } from '../config';
import FormItemDecoTextProperty from './item/FormItemDecoTextProperty';
import FormItemDecoHrefProperty from './item/FormItemDecoHrefProperty';
import FormItemDecoHrProperty from './item/FormItemDecoHrProperty';
import FormItemDecoAlertProperty from './item/FormItemDecoAlertProperty';
import FormItemHighSubtableProperty from './item/FormItemHighSubtableProperty';
import { flowFormApi } from '@features/fa-flow-pages/services';

/**
 * @author xu.pengfei
 * @date 2025-12-17 15:01:10
 */
export default function FormItemPropertyPanel() {
  const [form] = Form.useForm();
  const flowForm = useFaFormStore((state) => state.flowForm);
  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const updateSelectedFormItem = useFaFormStore((state) => state.updateSelectedFormItem);
  const config = useFaFormStore((state) => state.config);
  
  // 监听 tableName 字段的值
  const tableName = Form.useWatch('tableName', form);

  // 查找父节点
  const parentFormItem = useMemo(() => {
    if (!selectedFormItem?.id || !config.items) return undefined;
    return findParentFormItem(config.items, selectedFormItem.id);
  }, [selectedFormItem?.id, config.items]);

  // 判断父节点是否为设计子表
  const isParentSubtable = parentFormItem?.type === 'high_subtable';
  
  // 如果父节点是设计子表,则 tableName 为父节点的 subtable_tableName
  const subtableTableName = isParentSubtable ? parentFormItem?.subtable_tableName : undefined;

  useEffect(() => {
    console.log('FormItemPropertyPanel selectedFormItem changed', selectedFormItem);
    if (!selectedFormItem) return;
    let tableName = selectedFormItem?.tableName;
    if (isParentSubtable && subtableTableName) {
      tableName = subtableTableName;
    }
    form.setFieldsValue({
      tableName: tableName,
      name: selectedFormItem?.name,
      label: selectedFormItem?.label,
      ...selectedFormItem,
    });
    // 同步到 store
    if (selectedFormItem?.tableName !== subtableTableName) {
      updateSelectedFormItem({ tableName: subtableTableName });
    }
  }, [selectedFormItem, isParentSubtable, subtableTableName]);

  const tableOptions = useMemo(() => {
    const options = [];
    if (flowForm && flowForm.dataConfig && flowForm?.dataConfig?.main) {
      options.push({ label: flowForm.dataConfig.main.comment, value: flowForm.dataConfig.main.tableName });
    }
    return options;
  }, [flowForm]);

  // 动态获取列信息
  const [columnOptions, setColumnOptions] = useState<Array<{label: string, value: string}>>([]);

  // 监听 tableName 变化,调用接口获取列信息
  useEffect(() => {
    if (tableName) {
      flowFormApi.queryTableStructure({ tableName }).then(res => {
        if (res.data && res.data.columns) {
          const options = res.data.columns.map(col => ({
            label: col.comment,
            value: col.field,
          }));
          
          // 将系统字段移到尾部
          const systemFields = ['crt_time', 'crt_user', 'upd_time', 'upd_user', 'deleted'];
          const sortedOptions = options.sort((a, b) => {
            const aIsSystem = systemFields.includes(a.value);
            const bIsSystem = systemFields.includes(b.value);
            
            if (aIsSystem && !bIsSystem) return 1;  // a 是系统字段,排后面
            if (!aIsSystem && bIsSystem) return -1; // b 是系统字段,排后面
            return 0; // 保持原有顺序
          });
          
          setColumnOptions(sortedOptions);
        } else {
          setColumnOptions([]);
        }
      }).catch(() => {
        setColumnOptions([]);
      });
    } else {
      setColumnOptions([]);
    }
  }, [tableName]);

  if (isNil(selectedFormItem)) {
    return <Empty description="未选择表单项" className='fa-mt12' />;
  }

  // 判断是否绑定数据库的字段
  const isFieldItem = FaFormItemsFieldTypes.includes(selectedFormItem?.type);

  return (
    <div className='fa-flex-column fa-p12 fa-scroll-auto-y'>
      <div className='fa-mb12'>
        <Tag style={{fontSize: '13px'}} color='success' variant='solid' className='fa-hover' onClick={() => FaUtils.copyToClipboard(selectedFormItem.id)}>{selectedFormItem.id}</Tag>
      </div>

      <div>
        <Form form={form} styles={{ label: { width: 80 }}}
          // 1. 用户交互修改 → onValuesChange 自动同步 store
          onValuesChange={(cv, av) => {
            console.log('FormItemPanel form values changed', cv, av);
            const avCopy = cloneDeep(av);
            // update label from name
            if ((!av.label || av.label.startsWith('新组件')) && cv.name) {
              const col = columnOptions.find(c => c.value === cv.name);
              if (col) {
                avCopy.label = col.label;
                form.setFieldsValue({ label: col.label });
              }
            }
            updateSelectedFormItem(avCopy);
          }}
        >
          <Form.Item name="type" label="控件类型" rules={[{ required: true }]}>
            <Select options={FaFormItemTypeOptions} allowClear disabled />
          </Form.Item>
          {isFieldItem && (
            <>
              <Form.Item name="tableName" label="数据库表" rules={[{ required: true }]}>
                <Select options={tableOptions} allowClear disabled={isParentSubtable} />
              </Form.Item>
              <Form.Item name="name" label="控件字段" rules={[{ required: true }]}>
                <Select options={columnOptions} disabled={!tableName} allowClear />
              </Form.Item>
              <Space.Compact>
                <Form.Item name="label" label="控件标题" rules={[{ required: true }]}>
                  <Input allowClear />
                </Form.Item>
                <Button icon={<SyncOutlined />} onClick={() => {
                  const col = columnOptions.find(c => c.value === form.getFieldValue('name'));
                  console.log('Sync label from name', col);
                  if (col) {
                    form.setFieldsValue({ label: col.label });
                    updateSelectedFormItem(form.getFieldsValue()); // 关键：手动同步，这里不会触发 onValuesChange
                  }
                }}></Button>
              </Space.Compact>
            </>
          )}

          {selectedFormItem.type === 'input' && (<FormItemInputProperty />)}

          {selectedFormItem.type === 'high_subtable' && (<FormItemHighSubtableProperty />)}

          {selectedFormItem.type === 'deco_text' && (<FormItemDecoTextProperty />)}
          {selectedFormItem.type === 'deco_href' && (<FormItemDecoHrefProperty />)}
          {selectedFormItem.type === 'deco_hr' && (<FormItemDecoHrProperty />)}
          {selectedFormItem.type === 'deco_alert' && (<FormItemDecoAlertProperty />)}
        </Form>
      </div>
    </div>
  );
}
