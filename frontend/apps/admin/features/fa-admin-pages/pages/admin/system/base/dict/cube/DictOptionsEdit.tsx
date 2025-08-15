import React from 'react';
import { FaFlexRestLayout, FaSortList, FaUtils } from '@fa/ui';
import type { Admin } from '@/types';
import { dictApi } from '@features/fa-admin-pages/services';
import DictForm from './DictForm';

export interface DictOptionsEditProps {
  dict: Admin.Dict;
  onChange?: (v: Admin.Dict) => void;
  onRefresh?: () => void;
}

/**
 * 字典编辑
 * @author xu.pengfei
 * @date 2023/7/14 15:44
 */
export default function DictOptionsEdit({ dict, onChange, onRefresh }: DictOptionsEditProps) {
  function handleChangeDicts(list: any) {
    const options = [...list, ...dict.options.filter((i) => i.deleted)].map((v: any, i: any) => ({
      ...v,
      id: i + 1,
    }));
    const newDict = { ...dict, options };
    if (onChange) {
      onChange(newDict);
    }
    dictApi.update(dict.id, newDict).then((res) => {
      FaUtils.showResponse(res, '更新字典排序');
    });
  }

  function handleAddDict(v: any) {
    const options = dict.options || [];
    const newDict = {
      ...dict,
      options: [...options, { id: options.length + 1, ...v, deleted: false }],
    };
    dictApi.update(dict.id, newDict).then((res) => {
      FaUtils.showResponse(res, '新增字典');
      if (onRefresh) onRefresh();
    });
  }

  function handleEditDict(v: any) {
    const options = dict.options.map((d) => (d.id === v.id ? v : d));
    dictApi.update(dict.id, { ...dict, options }).then((res) => {
      FaUtils.showResponse(res, '更新字典');
      if (onRefresh) onRefresh();
    });
  }

  function handleDelDict(v: any) {
    const options = dict.options.map((d) => (d.id === v.id ? { ...v, deleted: true } : d));
    dictApi.update(dict.id, { ...dict, options }).then((res) => {
      FaUtils.showResponse(res, '删除字典');
      if (onRefresh) onRefresh();
    });
  }

  const showDicts = (dict?.options || []).filter((i) => !i.deleted);
  return (
    <FaFlexRestLayout className="fa-bg-white">
      <div className="fa-flex-row-center fa-bg-grey">
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{ flex: 1 }}>
          字典名称
        </div>
        <div className="fa-dict-data-title fa-border-b fa-border-r" style={{ flex: 1 }}>
          字典值
        </div>
        <div className="fa-dict-data-title fa-border-b " style={{ width: 80 }}>
          操作
        </div>
      </div>
      <FaSortList
        list={showDicts}
        renderItem={(i) => <DictForm dict={i} onChange={handleEditDict} onDelete={handleDelDict} />}
        itemStyle={{ borderBottom: '1px solid var(--fa-border-color)', position: 'relative', cursor: 'default' }}
        onSortEnd={(l) => handleChangeDicts(l)}
        vertical
        handle
        handleStyle={{ position: 'absolute', right: 10, top: 7 }}
      />
      <DictForm onChange={handleAddDict} />
    </FaFlexRestLayout>
  );
}
