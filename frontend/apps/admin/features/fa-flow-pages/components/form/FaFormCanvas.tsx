import { Flow } from '@features/fa-flow-pages/types';
import React from 'react';
import { useFaFormStore } from './stores/useFaFormStore';
import useFormConfig from './hooks/useFormConfig';
import FaFormDragLayout from './FaFormDragLayout';
import { FaUtils } from '@fa/ui';

export interface FaFormCanvasProps {
  /** 表单布局 */
  // items: Flow.FlowFormItem[];
  // onChange?: (items: Flow.FlowFormItem[]) => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-27 20:24:34
 */
export default function FaFormCanvas({ }: FaFormCanvasProps) {
  const config = useFaFormStore((state) => state.config);
  const updateFormItems = useFaFormStore((state) => state.updateFormItems);
  const {items} = useFormConfig(config);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    FaUtils.preventEvent(e);
    // 设置拖放效果
    e.dataTransfer.dropEffect = 'copy';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    FaUtils.preventEvent(e);
    // 获取从 FormItemDragPanel 拖动过来的组件类型
    const componentType = e.dataTransfer.getData('componentType') as Flow.FlowFormItemType;
    console.log('handleDrop - componentType:', componentType);
    
    // 在这里处理添加新组件的逻辑
    let md = 12;
    if (['deco_hr', 'deco_alert', 'deco_text'].includes(componentType)) {
      md = 24;
    }
    updateFormItems([
      {
        id: componentType + '_' + items.length + '_' + FaUtils.generateId(4),
        type: componentType,
        label: '新组件',
        md,
      },
      ...items,
    ]);
  }
  
  return (
    <div
      className='fa-full-content fa-form-canvas'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <FaFormDragLayout items={items} onChange={updateFormItems} />
    </div>
  );
}