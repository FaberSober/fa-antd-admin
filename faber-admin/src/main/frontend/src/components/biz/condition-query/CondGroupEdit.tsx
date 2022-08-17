import React from 'react';
import ConditionQuery from "@/components/biz/condition-query/interface";
import {Button, Input, Select, Space, Radio} from "antd";
import {find, remove} from "lodash";
import {CloseCircleFilled, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import { BaseTableUtils, FaberTable } from '@/components/biz/base-table';
import {v1 as uuidv1} from "uuid";


export interface CondGroupEditProps<T> {
  condGroup: ConditionQuery.CondGroup;
  columns: FaberTable.ColumnsProp<T>[];
  onChange: (condGroup: ConditionQuery.CondGroup, triggerSave?: boolean) => void;
  onDelete: () => void;
}

/**
 * 单组高级查询
 * @author xu.pengfei
 * @date 2022/7/15
 */
export default function CondGroupEdit<T>({ condGroup, columns, onChange, onDelete }: CondGroupEditProps<T>) {

  /** 筛选字段变更 */
  function handleChangeKey(v: string, index: number) {
    const col:any = find(columns, (n) => BaseTableUtils.dataIndexToString(n.dataIndex) === v);
    if (col === undefined) return;
    const changeItem = {
      key: v,
      title: parseColLabel(col),
      value: undefined,
      begin: undefined,
      end: undefined,
    };
    const newCondList = condGroup.condList.map((cond, i) => (index === i ? { ...cond, ...changeItem } : cond));
    setConditionList(newCondList);
  }

  /** 筛选操作符变更 */
  function handleChangeOpt(v: ConditionQuery.CondOpr, index: number) {
    const newCondList = condGroup.condList.map((cond, i) => (index === i ? { ...cond, opr: v } : cond));
    setConditionList(newCondList);
  }

  /** 筛选值变更 */
  function handleChangeValue(v: string, index: number, name?: string) {
    const newCondList = condGroup.condList.map((cond, i) => (index === i ? { ...cond, value: v, name } : cond));
    setConditionList(newCondList);
  }

  /** 筛选值[起始, 结束]变更 */
  function handleChangeBetweenValue(beginValue: string, endValue: string, index: number, name?: string) {
    const newCondList = condGroup.condList.map((cond, i) => (index === i ? { ...cond, begin: beginValue, end: endValue } : cond));
    setConditionList(newCondList);
  }

  /** 筛选值(起始)变更 */
  function handleChangeBeginValue(value: string, index: number, name?: string) {
    const newCondList = condGroup.condList.map((cond, i) => (index === i ? { ...cond, begin: value, name } : cond));
    setConditionList(newCondList);
  }

  /** 筛选值(结束)变更 */
  function handleChangeEndValue(value: string, index: number, name?: string) {
    const newCondList = condGroup.condList.map((cond, i) => (index === i ? { ...cond, end: value, name } : cond));
    setConditionList(newCondList);
  }

  /** 添加筛选条件 */
  function handleAddCondition() {
    setConditionList([...condGroup.condList, { id: uuidv1(), opr: ConditionQuery.CondOpr.equal }]);
  }

  function setConditionList(condList) {
    onChange({ ...condGroup, condList })
  }

  /** 删除筛选项 */
  function handleRemoveCond(id: string, triggerSave?: boolean) {
    const condList = [...condGroup.condList];
    remove(condList, (cond) => cond.id === id);
    if (onChange) {
      onChange({ ...condGroup, condList }, triggerSave)
    }
  }

  function parseColLabel(col: FaberTable.ColumnsProp<T>): string {
    let label = '未定义字段';
    if (col.tcLabel !== undefined) {
      label = col.tcLabel; // 优先使用
    } else if (typeof col.title === 'string') {
      // col.title如果不是dom节点，是string的话，可以使用
      label = col.title;
    }
    return label;
  }

  function handleDelete() {
    if (onDelete) onDelete();
  }

  function handleTypeChange(type) {
    console.log('handleTypeChange', type)
    if (onChange) {
      onChange({ ...condGroup, type })
    }
  }

  return (
    <div style={{ borderBottom: '1px dashed #ccc', marginBottom: 12 }}>
      <Radio.Group
        options={[
          { label: '并', value: ConditionQuery.Type.AND },
          { label: '或', value: ConditionQuery.Type.OR },
        ]}
        onChange={(e) => handleTypeChange(e.target.value)}
        value={condGroup.type}
        optionType="button"
        buttonStyle="solid"
        style={{ marginBottom: 12 }}
      />

      <div>
        {condGroup.condList.map((cond, index) => {
          const { id, key, opr, value, begin, end } = cond;
          const colFind = find(columns, (n) => BaseTableUtils.dataIndexToString(n.dataIndex) === key);

          const tcCondComponent = colFind && colFind.tcCondComponent;
          const tcCondBetweenComponent = colFind && colFind.tcCondBetweenComponent;

          return (
            <div key={id} style={{ marginBottom: 12, display: 'flex', flexDirection: 'row' }}>
              {/* 筛选字段 */}
              <Select style={{ width: 150, marginRight: 12 }} value={key} onChange={(v) => handleChangeKey(v, index)} placeholder="请选择筛选字段">
                {columns
                  .filter((n) => n.tcType !== 'menu' && !n.tcConditionHide)
                  .map((col) => (
                    <Select.Option key={BaseTableUtils.dataIndexToString(col.dataIndex)} value={BaseTableUtils.dataIndexToString(col.dataIndex)}>
                      {parseColLabel(col)}
                    </Select.Option>
                  ))}
              </Select>
              {/* 筛选操作符 */}
              <Select style={{ width: 100, marginRight: 12 }} value={opr} onChange={(v) => handleChangeOpt(v, index)}>
                <Select.Option value={ConditionQuery.CondOpr.equal}>等于</Select.Option>
                <Select.Option value="not_equal">不等于</Select.Option>
                <Select.Option value="greater">大于</Select.Option>
                <Select.Option value="greater_equal">大于等于</Select.Option>
                <Select.Option value="less">小于</Select.Option>
                <Select.Option value="less_equal">小于等于</Select.Option>
                <Select.Option value="in">IN</Select.Option>
                <Select.Option value="contain">包含</Select.Option>
                <Select.Option value="not_contain">不包含</Select.Option>
                <Select.Option value="start_contain">开始于</Select.Option>
                <Select.Option value="end_contain">结束于</Select.Option>
                <Select.Option value="between">{ConditionQuery.OPR_MAP.between}</Select.Option>
              </Select>
              {/* 筛选值 */}
              {/* 单值输入 */}
              {opr !== 'between' ? (
                <>
                  {tcCondComponent ? (
                    tcCondComponent({
                      index,
                      value,
                      callback: (v, i, name) => handleChangeValue(v, i, name),
                      style: { width: 400, marginRight: 12 },
                      placeholder: '请输入筛选条件的值',
                    })
                  ) : (
                    <Input
                      style={{ width: 400, marginRight: 12 }}
                      value={value}
                      onChange={(e) => handleChangeValue(e.target.value, index)}
                      placeholder="请输入筛选条件的值"
                    />
                  )}
                </>
              ) : null}
              {/* 双值输入 */}
              {opr === 'between' ? (
                <>
                  {tcCondBetweenComponent ? (
                    tcCondBetweenComponent({
                      index,
                      value: [begin, end],
                      callback: (v, i, name) => {
                        handleChangeBetweenValue(v[0], v[1], i);
                      },
                      style: { width: 400, marginRight: 12 },
                    })
                  ) : (
                    <>
                      <Input style={{ width: 175 }} value={begin} onChange={(e) => handleChangeBeginValue(e.target.value, index)} placeholder="起始值" />
                      <span style={{ display: 'inline-block', width: 50, textAlign: 'center' }}>~</span>
                      <Input
                        style={{ width: 175, marginRight: 12 }}
                        value={end}
                        onChange={(e) => handleChangeEndValue(e.target.value, index)}
                        placeholder="结束值"
                      />
                    </>
                  )}
                </>
              ) : null}
              {/* 删除按钮 */}
              <Button onClick={() => handleRemoveCond(cond.id)} icon={<CloseCircleFilled />} type="link" style={{ color: '#999' }} />
            </div>
          );
        })}
      </div>

      <Space style={{ marginBottom: 12 }}>
        <a onClick={handleAddCondition}>
          <PlusOutlined /> 添加筛选条件
        </a>
        <a onClick={handleDelete} style={{ color: '#F50' }}>
          <DeleteOutlined />删除分组
        </a>
      </Space>
    </div>
  )
}
