import React, { useEffect, useState } from 'react';
import { getDateStr, optionsToLabel, toLine, tryToFixed } from '@/utils/utils';
import { Badge } from 'antd';
import { find, isEmpty, trim } from 'lodash';
import {
  renderDatePicker,
  renderDateRangerPicker,
  renderTimePicker,
  renderTimeRangePicker,
} from '@/components/condition-query/ConditionQueryUtils';
import { FaberTable } from '@/components/base-table/index';
import { BaseBoolSelector, DictDataSelector, DictEnumSelector } from '@/components/base-dict';
import { SortOrder } from 'antd/es/table/interface';
import { Fa } from '@/types';
import UserSearchSelect from '@/pages/admin/system/hr/user/helper/UserSearchSelect';
import { useSize } from 'ahooks';

export function dataIndexToString(dataIndex: string | string[]) {
  if (dataIndex instanceof Array) {
    return dataIndex.join(',');
  }
  return dataIndex;
}

/**
 * antd Table 排序
 * 1. filed驼峰转下划线；
 * 2. order返回 'DESC' : 'ASC';
 * @param {*} sorter
 */
export function getSorter(sorter: Fa.Sorter) {
  const order = sorter.order === 'descend' ? 'DESC' : 'ASC';
  const column = toLine(sorter.field);
  return `${column} ${order}`;
}

/**
 * antd Table column 获取排序
 */
export function getSortOrder(sorter: Fa.Sorter, field: string): SortOrder {
  if (isEmpty(sorter)) {
    return null;
  }
  if (field === sorter.field) {
    return sorter.order;
  }
  return null;
}

/**
 * 解析字典值
 * @param value
 * @param dicts
 * @param column
 */
export function getValueFromDicts(value: string, dicts: Fa.PageDict, column: string) {
  if (dicts[column]) {
    const dict = find(dicts[column], (d) => trim(d.value) === trim(value));
    if (dict) return dict.label;
  }
  return value;
}

export function genIdColumn(
  title: string,
  dataIndex: string,
  width: number,
  sorter: Fa.Sorter,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcRequired: false,
    width,
    fixed: 'left',
    tcChecked,
  } as FaberTable.ColumnsProp<any>;
}

export function genSimpleSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: Fa.Sorter,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
  } as FaberTable.ColumnsProp<any>;
}

export function genNumSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: Fa.Sorter,
  fixNum = 2,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    render: (val: any) => tryToFixed(val, fixNum),
  } as FaberTable.ColumnsProp<any>;
}

export function genBoolSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: Fa.Sorter,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: any) => (val ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />),
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <BaseBoolSelector value={value} onChange={(v, option) => callback(v, index, optionsToLabel(option))} {...props} />
    ),
    width,
  } as FaberTable.ColumnsProp<any>;
}

export function genUserSorterColumn(
  title: string,
  dataIndex: string,
  width: number,
  sorter: Fa.Sorter,
): FaberTable.ColumnsProp<any> {
  return {
    ...genSimpleSorterColumn(title, dataIndex, width, sorter),
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <UserSearchSelect
        value={value}
        onChange={(v: any, item: any) => callback(v, index, optionsToLabel(item))}
        {...props}
      />
    ),
  };
}

export function genDictSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: Fa.Sorter,
  dicts: Fa.PageDict,
  dictLabel: string,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => <span>{getValueFromDicts(val, dicts, dataIndex)}</span>,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <DictDataSelector
        dictLabel={dictLabel}
        value={value}
        onChange={(v, o) => callback(v, index, optionsToLabel(o))}
        {...props}
      />
    ),
    width,
  } as FaberTable.ColumnsProp<any>;
}

export function genEnumSorterColumn(
  title: string,
  dataIndex: string,
  width: number,
  sorter: Fa.Sorter,
  dicts: Fa.PageDict,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => <span>{getValueFromDicts(val, dicts, dataIndex)}</span>,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <DictEnumSelector
        dicts={dicts[dataIndex]}
        value={value}
        onChange={(v, o) => callback(v, index, optionsToLabel(o))}
        {...props}
      />
    ),
    width,
  } as FaberTable.ColumnsProp<any>;
}

export function genDateSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: Fa.Sorter,
  format: string | undefined = undefined,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => getDateStr(val, format),
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    tcCondComponent: renderDatePicker,
    tcCondBetweenComponent: renderDateRangerPicker,
  } as FaberTable.ColumnsProp<any>;
}

export function genTimeSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: Fa.Sorter,
  format = 'YYYY-MM-DD HH:mm:ss',
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => getDateStr(val, format),
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    tcCondComponent: renderTimePicker,
    tcCondBetweenComponent: renderTimeRangePicker,
  } as FaberTable.ColumnsProp<any>;
}

export function genCtrColumns(sorter: Fa.Sorter, tcChecked = true): FaberTable.ColumnsProp<any>[] {
  return [
    {
      title: '创建时间',
      dataIndex: 'crtTime',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'crtTime'),
      tcChecked,
      width: 170,
      tcCondComponent: renderTimePicker,
      tcCondBetweenComponent: renderTimeRangePicker,
    },
    {
      title: '创建用户ID',
      dataIndex: 'crtUser',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'crtUser'),
      width: 120,
      // tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
      //   <UserSearchSelect value={value} onChange={(v: any, item: any) => callback(v, index, get(item, 'label'))} {...props} />
      // ),
    },
    {
      title: '创建用户',
      dataIndex: 'crtName',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'crtName'),
      tcChecked: false,
      width: 100,
    },
    {
      title: '创建IP',
      dataIndex: 'crtHost',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'crtHost'),
      width: 150,
    },
  ] as FaberTable.ColumnsProp<any>[];
}

export function genUpdateColumns(sorter: Fa.Sorter): FaberTable.ColumnsProp<any>[] {
  return [
    {
      title: '更新时间',
      dataIndex: 'updTime',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'updTime'),
      width: 170,
      tcCondComponent: renderTimePicker,
      tcCondBetweenComponent: renderTimeRangePicker,
    },
    {
      title: '更新用户ID',
      dataIndex: 'updUser',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'updUser'),
      width: 120,
      // tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
      //   <UserSearchSelect value={value} onChange={(v: any, item: any) => callback(v, index, get(item, 'label'))} {...props} />
      // ),
    },
    {
      title: '更新用户',
      dataIndex: 'updName',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'updName'),
      width: 100,
    },
    {
      title: '更新IP',
      dataIndex: 'updHost',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'updHost'),
      width: 100,
    },
  ] as FaberTable.ColumnsProp<any>[];
}

export function useScrollY(id: string): [scrollY: number | undefined] {
  const size = useSize(document.getElementById(id));
  const [innerScrollY, setInnerScrollY] = useState<number | undefined>(undefined);

  useEffect(() => {
    const y = size ? size.height - 87 : undefined;
    if (innerScrollY !== y) {
      setInnerScrollY(y);
    }
  }, [size]);

  return [innerScrollY];
}
