import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';

interface IProps extends SelectProps<any> {}

/**
 * 通用审核结果-Bool
 * @author xu.pengfei
 * @date 2021/3/11
 */
export default function BaseAuditBoolSelector(props: IProps) {
  const options: any[] = [
    { label: '通过', value: true },
    { label: '不通过', value: false },
  ];

  return <Select allowClear options={options} style={{ minWidth: 70 }} placeholder="请选择审核结果" {...props} />;
}
