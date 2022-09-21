import React from 'react';
import {getDateStr, toLine, tryToFixed} from '@/utils/utils';
import Ajax from '@/props/base/Ajax';
import {Popconfirm} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {ShiroPermissionContainer} from '@/components/auth';
import {find, isEmpty, trim} from 'lodash';
import {
  renderDatePicker,
  renderDateRangerPicker,
  renderTimePicker,
  renderTimeRangePicker
} from '@/components/condition-query/ConditionQueryUtils';
import {FaberTable} from '@/components/base-table/index';
import {DictDataSelector} from "@/components/base-dict";
import {SortOrder} from "antd/es/table/interface";


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
export function getSorter(sorter: Ajax.Sorter) {
  const order = sorter.order === 'descend' ? 'DESC' : 'ASC';
  const column = toLine(sorter.field);
  return `${column} ${order}`;
}

/**
 * antd Table column 获取排序
 */
export function getSortOrder(sorter: Ajax.Sorter, field: string): SortOrder {
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
export function getValueFromDicts(value: string, dicts: Ajax.PageDict, column: string) {
  if (dicts[column]) {
    const dict = find(dicts[column], (d) => trim(d.value) === trim(value));
    if (dict) return dict.text;
  }
  return value;
}

export function genIdColumn(title: string, dataIndex: string, width: number, sorter: Ajax.Sorter, tcChecked: boolean = true): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcRequired: false,
    width,
    fixed: 'left',
    tcChecked,
  };
}

export function genSimpleSorterColumn(title: string, dataIndex: string, width: number | undefined, sorter: Ajax.Sorter, tcChecked: boolean = true): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
  };
}

export function genNumSorterColumn(title: string, dataIndex: string, width: number | undefined, sorter: Ajax.Sorter, fixNum = 2, tcChecked: boolean = true) {
  return {
    title,
    dataIndex,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
    render: (val: any) => tryToFixed(val, fixNum),
  };
}

export function genBoolSorterColumn(title: string, dataIndex: string, width: number | undefined, sorter: Ajax.Sorter, tcChecked: boolean = true) {
  return {
    title,
    dataIndex,
    render: (val: any) => (val ? '是' : '否'),
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    width,
  };
}

export function genUserSorterColumn(title: string, dataIndex: string, width: number, sorter: Ajax.Sorter) {
  return {
    ...genSimpleSorterColumn(title, dataIndex, width, sorter),
    // tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
    //   <UserSearchSelect value={value} onChange={(v: any, item: any) => callback(v, index, get(item, 'label'))} {...props} />
    // ),
  };
}

export function genDictSorterColumn(
  title: string,
  dataIndex: string,
  width: number,
  sorter: Ajax.Sorter,
  dicts: Ajax.PageDict,
  dictLabel: string,
  tcChecked: boolean = true
): FaberTable.ColumnsProp<any> {
  return {
    title,
    dataIndex,
    render: (val: string) => <span>{getValueFromDicts(val, dicts, dataIndex)}</span>,
    sorter: true,
    sortOrder: getSortOrder(sorter, dataIndex),
    tcChecked,
    tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
      <DictDataSelector dictLabel={dictLabel} value={value} onChange={(v, label) => callback(v, index, label)} {...props} />
    ),
    width,
  };
}

export function genDateSorterColumn(title: string, dataIndex: string, width: number | undefined, sorter: Ajax.Sorter, format:string|undefined = undefined, tcChecked: boolean = true): FaberTable.ColumnsProp<any> {
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
  };
}

export function genTimeSorterColumn(title: string, dataIndex: string, width: number | undefined, sorter: Ajax.Sorter, format = 'YYYY-MM-DD HH:mm:ss', tcChecked = true): FaberTable.ColumnsProp<any> {
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
  };
}

export function genCtrColumns(sorter: Ajax.Sorter, tcChecked: boolean = true) {
  return [
    {
      title: '创建时间',
      dataIndex: 'crtTime',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'crtTime'),
      tcChecked,
      width: 180,
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
  ];
}

export function genUpdateColumns(sorter: Ajax.Sorter) {
  return [
    {
      title: '更新时间',
      dataIndex: 'updTime',
      sorter: true,
      sortOrder: getSortOrder(sorter, 'updTime'),
      width: 180,
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
  ];
}

/**
 * 返回加权限校验的删除按钮
 * @param record
 * @param handleDelete
 * @param elements
 * @param permission
 */
export function AuthDelBtn<T>({
  record,
  handleDelete,
  permission,
}: {
  record: T;
  handleDelete: (v: T) => void;
  permission?: string;
}) {
  return (
    <ShiroPermissionContainer permission={permission}>
      <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record)} getPopupContainer={() => document.body}>
        <a style={{ color: 'red' }}>
          <DeleteOutlined /> 删除
        </a>
      </Popconfirm>
    </ShiroPermissionContainer>
  );
}
