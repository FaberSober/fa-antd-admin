import React, {CSSProperties, useContext, useRef} from 'react';
import {FaberTable} from '@/components/base-table';
import {Button, Space} from 'antd';
import {FilterOutlined} from '@ant-design/icons';
import ConditionQueryModal from './ConditionQueryModal';
import SceneDropMenu from './SceneDropMenu';
import ConditionQuery from '@/components/condition-query/interface';

interface IProps<T> {
  buzzModal: string
  columns: FaberTable.ColumnsProp<T>[];
  onSceneChange: (key: string, label: string) => void; // 场景变化
  onConditionChange: (conditionList: ConditionQuery.CondGroup[]) => void; // 组合查询条件变更
  style?: CSSProperties;
}

/**
 * 场景查询&高级筛选联合组件
 */
export default function ComplexQuery<T>({ columns, buzzModal, onSceneChange, onConditionChange, style }: IProps<T>) {
  const sceneDropMenuRef = useRef<any | null>(null);

  /** 高级查询-筛选条件变更 */
  function handleConditionChange(conditionList: ConditionQuery.CondGroup[], saveAsScene: boolean) {
    if (onConditionChange) {
      onConditionChange(conditionList);
    }
    if (saveAsScene) {
      sceneDropMenuRef.current.refreshConfigList();
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <Space style={{ flex: 1 }}>
        <SceneDropMenu
          ref={sceneDropMenuRef}
          buzzModal={buzzModal}
          // @ts-ignore
          columns={columns}
          onChange={onSceneChange}
        />
        <ConditionQueryModal showSuffix buzzModal={buzzModal} columns={columns} onConditionChange={handleConditionChange}>
          <Button icon={<FilterOutlined />} type="text" style={{ color: '#666' }}>
            高级筛选
          </Button>
        </ConditionQueryModal>
      </Space>
    </div>
  );
}
