import React from 'react';
import ConditionQuery from "@/components/biz/condition-query/interface";
import {Tag} from "antd";
import {remove} from "lodash";
import './SceneManageModal.less';


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
      onChange({ ...condGroup, condList }, triggerSave)
    }
  }

  return (
    <div className="faCondGroupShow">
      {condGroup.condList.map((cond, index) => {
        const { id, key, opr, value, begin, end, name } = cond;
        let condStr;
        if (opr === 'between') {
          if (key === undefined || begin === undefined || end === undefined) {
            return null;
          }

          condStr = `${begin} ~ ${end}`;
        } else {
          if (key === undefined || value === undefined) {
            return null;
          }

          condStr = `${name || value}`;
        }
        return (
          <div key={cond.id} className="faber-flex-row-center">
            <Tag key={id} closable onClose={() => handleRemoveCond(cond.id, true)}>
              {cond.title} {ConditionQuery.OPR_MAP[opr]} {condStr}
            </Tag>
            {index < condGroup.condList.length - 1 && (<span style={{ margin: '0 6px' }}>{condGroup.type}</span>)}
          </div>
        );
      })}
    </div>
  )
}
