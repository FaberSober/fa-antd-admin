import React, {useEffect, useState} from 'react';
import {getDateStr, optionsToLabel, toLine, tryToFixed} from '@ui/utils/utils';
import { Badge, Tooltip } from 'antd';
import { find, isBoolean, isEmpty, isNil, trim } from 'lodash';
import {
  renderDatePicker,
  renderDateRangerPicker,
  renderTimePicker,
  renderTimeRangePicker,
} from '@ui/components/condition-query/ConditionQueryUtils';
import {BaseTableUtils, FaberTable} from '@ui/components/base-table/index';
import {BaseBoolSelector, DictDataSelector, DictEnumSelector} from '@ui/components/base-dict';
import {SortOrder} from 'antd/es/table/interface';
import {UserSearchSelect} from '@ui/components/biz-user-select';
import {useSize} from 'ahooks';
import {Fa} from "@ui/types";

/**
 * 将dataIndex 数组转换为字符串
 * @param dataIndex
 */
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
export function getSorter(sorter: boolean | Fa.Sorter) {
  if (!sorter || isBoolean(sorter)) {
    return null;
  }
  if (isNil(sorter.field) || trim(sorter.field) === '') return null;
  const order = sorter.order === 'descend' ? 'DESC' : 'ASC';
  const column = toLine(sorter.field);
  return `${column} ${order}`;
}

/**
 * antd Table column 获取排序
 */
export function getSortOrder(sorter: boolean | Fa.Sorter, field: string | string[]): SortOrder {
  if (!sorter || isBoolean(sorter)) {
    return null;
  }
  if (isEmpty(sorter)) {
    return null;
  }
  if (field === sorter.field) {
    return sorter.order;
  }
  return null;
}

/**
 * 解析生成通用查询入参
 * @param params
 */
export function getQueryParams(queryParams: Fa.QueryParams): any {
  const { _search, ...restFormValues } = queryParams.formValues;
  const params = {
    sorter: getSorter(queryParams.sorter),
    sceneId: queryParams.sceneId,
    conditionList: queryParams.conditionList,
    search: _search,
    query: {
      ...restFormValues,
      // 外部补充查询条件
      ...queryParams.extraParams,
    },
  };
  return params;
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

/**
 * 生成从1开始自增序号列
 * @param paginationProps
 */
export function genIndexColumn(paginationProps: { current?: number; pageSize?: number; total?: number }): FaberTable.ColumnsProp<any> {
  const current = paginationProps.current || 1;
  const pageSize = paginationProps.pageSize || 20;
  const startIndex = (current - 1) * pageSize + 1;
  return {
    title: '序号',
    dataIndex: 'index',
    width: 70,
    fixed: 'left',
    render: (_, r, i) => startIndex + i,
    tcChecked: true,
    tcConditionHide: true,
  }
}

/**
 * 生成ID列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param tcChecked
 * @param fixLeft
 */
export function genIdColumn(
  title: string,
  dataIndex: string,
  width: number,
  sorter: boolean | Fa.Sorter,
  tcChecked = true,
  fixLeft = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcRequired: false,
    width,
    fixed: fixLeft ? 'left' : undefined,
    tcChecked,
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成简单文本列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param tcChecked
 * @param tcConditionHide
 */
export function genSimpleSorterColumn(
  title: string,
  dataIndex: string | string[],
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  tcChecked = true,
  tcConditionHide = false,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: !sorter ? sorter : true,
    sortOrder: !sorter ? null : getSortOrder(sorter, dataIndex),
    tcChecked,
    tcConditionHide,
    width,
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成过长文本会自动截断的文本列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param tcChecked
 */
export function genEllipsisSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    ellipsis: true,
    render: (v) => (
      <Tooltip placement="topLeft" title={<div className="fa-break-word">{v}</div>}>
        {v}
      </Tooltip>
    ),
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成数字列表，可以指定数字的精度
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param fixNum
 * @param tcChecked
 */
export function genNumSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  fixNum = 2,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    render: (val: any) => tryToFixed(val, fixNum),
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成布尔列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param tcChecked
 */
export function genBoolSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: any) => (val ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />),
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <BaseBoolSelector value={value} onChange={(v, option) => callback(v, index, optionsToLabel(option))} {...props} />
    ),
    width,
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成用户列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param userNameKey
 */
export function genUserSorterColumn(title: string, dataIndex: string, width: number, sorter: boolean | Fa.Sorter, userNameKey: string): FaberTable.ColumnsProp<any> {
  return {
    ...genSimpleSorterColumn(title, dataIndex, width, sorter),
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <UserSearchSelect value={value} onChange={(v: any, item: any) => callback(v, index, optionsToLabel(item))} {...props} />
    ),
    render: (_, v) => v[userNameKey],
  };
}

/**
 * 生成字典列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param dicts
 * @param dictLabel
 * @param tcChecked
 */
export function genDictSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  dicts: Fa.PageDict,
  dictLabel: string,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => <span>{getValueFromDicts(val, dicts, dataIndex)}</span>,
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <DictDataSelector dictLabel={dictLabel} value={value} onChange={(v, o) => callback(v, index, optionsToLabel(o))} {...props} />
    ),
    width,
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成枚举列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param dicts
 * @param tcChecked
 */
export function genEnumSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  dicts: Fa.PageDict,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => <span>{getValueFromDicts(val, dicts, dataIndex)}</span>,
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    tcCondComponent: ({ index, value, callback, mode, ...props }: FaberTable.TcCondProp) => (
      <DictEnumSelector dicts={dicts[dataIndex]} value={value} onChange={(v, o) => callback(v, index, optionsToLabel(o))} {...props} />
    ),
    width,
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成日期列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param format
 * @param tcChecked
 */
export function genDateSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  format: string | undefined = undefined,
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => getDateStr(val, format),
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    tcCondComponent: renderDatePicker,
    tcCondBetweenComponent: renderDateRangerPicker,
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成时间列
 * @param title
 * @param dataIndex
 * @param width
 * @param sorter
 * @param format
 * @param tcChecked
 */
export function genTimeSorterColumn(
  title: string,
  dataIndex: string,
  width: number | undefined,
  sorter: boolean | Fa.Sorter,
  format = 'YYYY-MM-DD HH:mm:ss',
  tcChecked = true,
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => getDateStr(val, format),
    sorter: !sorter ? sorter : true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    tcCondComponent: renderTimePicker,
    tcCondBetweenComponent: renderTimeRangePicker,
  } as FaberTable.ColumnsProp<any>;
}

/**
 * 生成创建时间、创建用户列
 * @param sorter
 * @param tcChecked
 * @param crtNameTcChecked
 */
export function genCtrColumns(sorter: boolean | Fa.Sorter, tcChecked = true, crtNameTcChecked = false): FaberTable.ColumnsProp<any>[] {
  return [
    {
      title: '创建时间',
      dataIndex: 'crtTime',
      sorter: !sorter ? sorter : true,
      sortOrder: getSortOrder(sorter, 'crtTime'),
      tcChecked,
      width: 165,
      tcCondComponent: renderTimePicker,
      tcCondBetweenComponent: renderTimeRangePicker,
    },
    {
      title: '创建用户',
      dataIndex: 'crtName',
      sorter: !sorter ? sorter : true,
      sortOrder: getSortOrder(sorter, 'crtName'),
      tcChecked: crtNameTcChecked,
      width: 100,
    },
    {
      title: '创建用户ID',
      dataIndex: 'crtUser',
      sorter: !sorter ? sorter : true,
      sortOrder: getSortOrder(sorter, 'crtUser'),
      width: 120,
      // tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
      //   <UserSearchSelect value={value} onChange={(v: any, item: any) => callback(v, index, get(item, 'label'))} {...props} />
      // ),
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

/**
 * 生成更新时间、更新用户列
 * @param sorter
 */
export function genUpdateColumns(sorter: boolean | Fa.Sorter): FaberTable.ColumnsProp<any>[] {
  return [
    {
      title: '更新时间',
      dataIndex: 'updTime',
      sorter: !sorter ? sorter : true,
      sortOrder: getSortOrder(sorter, 'updTime'),
      width: 165,
      tcCondComponent: renderTimePicker,
      tcCondBetweenComponent: renderTimeRangePicker,
    },
    {
      title: '更新用户',
      dataIndex: 'updName',
      sorter: !sorter ? sorter : true,
      sortOrder: getSortOrder(sorter, 'updName'),
      width: 100,
    },
    {
      title: '更新用户ID',
      dataIndex: 'updUser',
      sorter: !sorter ? sorter : true,
      sortOrder: getSortOrder(sorter, 'updUser'),
      width: 120,
      // tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
      //   <UserSearchSelect value={value} onChange={(v: any, item: any) => callback(v, index, get(item, 'label'))} {...props} />
      // ),
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

/**
 * 滚动Y轴
 * @param id
 */
export function useScrollY(id: string): [scrollY: number | undefined] {
  const size = useSize(document.getElementById(id));
  const [innerScrollY, setInnerScrollY] = useState<number | undefined>(undefined);

  useEffect(() => {
    let delta = 18;
    try {
      const headerDoms = document.getElementsByClassName('ant-table-header');
      if (headerDoms && headerDoms[0]) {
        const rect = headerDoms[0].getBoundingClientRect();
        delta += rect.height;
      }
      const paginationDoms = document.getElementsByClassName('ant-table-pagination');
      if (paginationDoms && paginationDoms[0]) {
        const rect = paginationDoms[0].getBoundingClientRect();
        delta += rect.height;
      }
    } catch (e) {
      console.log(e)
    }
    const y = size ? size.height - delta : undefined;
    if (innerScrollY !== y) {
      setInnerScrollY(y);
    }
  }, [size]);

  return [innerScrollY];
}
