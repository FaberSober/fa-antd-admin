import React from 'react';
import { FaFormItems, FaFormItemsBiz, FaFormItemsContainer, FaFormItemsDecorator, FaFormItemsHigh } from '../config';

/**
 * @author xu.pengfei
 * @date 2025-12-26 14:05:31
 */
export default function FormItemDragPanel() {

  // 处理从左侧面板拖动组件
  function handleDragStartFromPanel(e: React.DragEvent<HTMLElement>, componentType: string) {
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div>
      <div className='fa-card fa-mb12'>
        <div className='fa-h3 fa-mb12'>基础控件</div>
        <div className='fa-grid2 fa-gap12'>
          {FaFormItems.map((item) => (
            <div
              key={item.type}
              draggable
              unselectable="on"
              onDragStart={(e) => {
                handleDragStartFromPanel(e, item.type);
              }}
              className='fa-form-item-drag'
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='fa-card fa-mb12'>
        <div className='fa-h3 fa-mb12'>业务控件</div>
        <div className='fa-grid2 fa-gap12'>
          {FaFormItemsBiz.map((item) => (
            <div
              key={item.type}
              draggable
              unselectable="on"
              onDragStart={(e) => {
                handleDragStartFromPanel(e, item.type);
              }}
              className='fa-form-item-drag'
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='fa-card fa-mb12'>
        <div className='fa-h3 fa-mb12'>高级控件</div>
        <div className='fa-grid2 fa-gap12'>
          {FaFormItemsHigh.map((item) => (
            <div
              key={item.type}
              draggable
              unselectable="on"
              onDragStart={(e) => {
                handleDragStartFromPanel(e, item.type);
              }}
              className='fa-form-item-drag'
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='fa-card fa-mb12'>
        <div className='fa-h3 fa-mb12'>展示控件</div>
        <div className='fa-grid2 fa-gap12'>
          {FaFormItemsDecorator.map((item) => (
            <div
              key={item.type}
              draggable
              unselectable="on"
              onDragStart={(e) => {
                handleDragStartFromPanel(e, item.type);
              }}
              className='fa-form-item-drag'
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className='fa-card fa-mb12'>
        <div className='fa-h3 fa-mb12'>容器控件</div>
        <div className='fa-grid2 fa-gap12'>
          {FaFormItemsContainer.map((item) => (
            <div
              key={item.type}
              draggable
              unselectable="on"
              onDragStart={(e) => {
                handleDragStartFromPanel(e, item.type);
              }}
              className='fa-form-item-drag'
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
