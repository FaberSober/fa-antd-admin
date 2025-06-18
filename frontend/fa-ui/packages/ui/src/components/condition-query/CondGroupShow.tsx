import React from 'react';
import ConditionQuery from './ConditionQuery';
import { Tag } from 'antd';
import { remove } from 'lodash';
import './SceneManageModal.css';
import { needValue } from "@ui/components/condition-query/utils";

export interface CondGroupShowProps {
  condGroup: ConditionQuery.CondGroup;
  onChange?: (condGroup: ConditionQuery.CondGroup, triggerSave?: boolean) => void;
}

/**
 * 单组高级查询
 * @author xu.pengfei
 * @date 2022/7/15
 */
export default function CondGroupShow({ condGroup, onChange }: CondGroupShowProps) {
  /** 删除筛选项 */
  function handleRemoveCond(id: string, triggerSave?: boolean) {
    const condList = [...condGroup.condList];
    remove(condList, (cond) => cond.id === id);
    if (onChange) {
      onChange({ ...condGroup, condList }, triggerSave);
    }
  }

  return (
    <div className="fa-cond-group-show" style={{maxHeight: 100, overflow: 'auto'}}>
      {condGroup.condList.map((cond, index) => {
        const { id, key, opr, value, begin, end, name } = cond;
        let condStr;
        // 是否展示右侧筛选值
        const showValue = needValue(opr)
        if (opr === ConditionQuery.CondOpr.between) {
          if (key === undefined || begin === undefined || end === undefined) {
            return null;
          }

          condStr = `${begin} ~ ${end}`;
        } else if (!showValue) {
          if (key === undefined) {
            return null;
          }
          condStr = '';
        } else {
          if (key === undefined || value === undefined) {
            return null;
          }

          condStr = `${name || value}`;
        }
        return (
          <div key={cond.id} className="fa-flex-row-center">
            <Tag key={id} closable onClose={() => handleRemoveCond(cond.id, true)} className="fa-break-word" style={{}}>
              {cond.title} {ConditionQuery.OPR_MAP[opr]} {condStr}
            </Tag>
            {index < condGroup.condList.length - 1 && <span style={{ margin: '0 6px' }}>{condGroup.type}</span>}
          </div>
        );
      })}
    </div>
  );
}
