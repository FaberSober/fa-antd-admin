/**
 * ConditionQueryModal自定义条件查询，补充查询条件值选择
 */
import React from 'react';
import {DatePicker} from 'antd';
import {getDateFullStr, getDateStr, getInitialTimeValue, parseRangeDateSuffix} from '@/utils/utils';
import {FaberTable} from '@/components/base-table';

const { RangePicker } = DatePicker;

/* eslint-disable react/jsx-props-no-spreading */

/* --------------------------------------- DatePicker --------------------------------------- */
export function renderDatePicker({ index, value, callback, ...props }: FaberTable.TcCondProp) {
  // @ts-ignore
  return <DatePicker value={getInitialTimeValue(value)} onChange={(v) => callback(getDateStr(v), index)} {...props} />;
}

export function renderDateRangerPicker({ index, value, callback, ...props }: FaberTable.TcCondBetweenProps) {
  return (
    <RangePicker
      // @ts-ignore
      value={[getInitialTimeValue(value[0]), getInitialTimeValue(value[1])]}
      // @ts-ignore
      onChange={(v) => callback([parseRangeDateSuffix(v, 0, '00:00:00'), parseRangeDateSuffix(v, 1, '23:59:59')], index)}
      {...props}
    />
  );
}

/* --------------------------------------- TimePicker --------------------------------------- */
export function renderTimePicker({ index, value, callback, ...props }: FaberTable.TcCondProp) {
  // @ts-ignore
  return <DatePicker showTime value={getInitialTimeValue(value)} onChange={(v) => callback(getDateFullStr(v), index)} {...props} />;
}

export function renderTimeRangePicker({ index, value, callback, ...props }: FaberTable.TcCondBetweenProps) {
  return (
    <RangePicker
      showTime
      // @ts-ignore
      value={[getInitialTimeValue(value[0]), getInitialTimeValue(value[1])]}
      // @ts-ignore
      onChange={(v) => callback([getDateFullStr(v[0]), getDateFullStr(v[1])], index)}
      {...props}
    />
  );
}
