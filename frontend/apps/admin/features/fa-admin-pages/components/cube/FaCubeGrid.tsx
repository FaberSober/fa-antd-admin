import React from 'react';
import { isNil } from 'lodash';
import './FaCubeGrid.scss';

export interface FaCubeGridItem {
  i: string;  // 组件唯一key
}

export interface FaCubeGridProps {
  /** 所有可用组件列表 */
  allLayout: FaCubeGridItem[];
  /** cubes 模块，key 对应 FaCubeGridItem.i */
  cubes: Record<string, any>;
  /** 已选中的组件 key 列表 */
  selectedIds: string[];
  /** 点击添加 */
  onAdd: (id: string) => void;
  /** 点击移除 */
  onRemove: (id: string) => void;
}

/**
 * 工作台组件选择网格
 * @author xu.pengfei
 * @date 2026-03-03
 */
export default function FaCubeGrid({ allLayout, cubes, selectedIds, onAdd, onRemove }: FaCubeGridProps) {
  return (
    <div className="fa-cube-grid">
      {allLayout.map((item) => {
        const Component = cubes[item.i];
        if (isNil(Component)) return null;
        const sel = selectedIds.indexOf(item.i) > -1;
        return (
          <div
            key={item.i}
            className={`fa-cube-grid-item${sel ? ' selected' : ''}`}
            onClick={() => {
              if (sel) {
                onRemove(item.i);
              } else {
                onAdd(item.i);
              }
            }}
          >
            {sel && <span className="fa-cube-grid-item-check">✓</span>}
            <div className={`fa-cube-grid-item-title${sel ? ' has-check' : ''}`}>
              {Component.title}
            </div>
            {Component.description && (
              <div className="fa-cube-grid-item-desc">
                {Component.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}