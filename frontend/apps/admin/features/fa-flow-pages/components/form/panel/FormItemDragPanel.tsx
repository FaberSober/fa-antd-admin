import React from 'react';
import { FaFormItems } from '../config';

/**
 * @author xu.pengfei
 * @date 2025-12-26 14:05:31
 */
export default function FormItemDragPanel() {

  return (
    <div className='fa-card'>
      <div className='fa-h3 fa-mb12'>基础控件</div>
      <div className='fa-grid2 fa-gap12'>
        {FaFormItems.map((item) => (
          <div
            key={item.type}
            draggable
            unselectable="on"
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', item.type); // 携带字段类型
            }}
            className='fa-form-item-drag'
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
