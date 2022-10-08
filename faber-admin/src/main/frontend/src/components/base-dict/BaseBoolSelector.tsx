import React from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/es/select';

interface IProps extends SelectProps<any> {}

/**
 * @author xu.pengfei
 * @date 2021/3/11
 */
export default function BaseBoolSelector(props: IProps) {
  const options = [
    { label: '是', value: true },
    { label: '否', value: false },
  ];

  return (
    // @ts-ignore
    <Select allowClear options={options} style={{ minWidth: 70 }} {...props} />
  );
}
