import React from 'react';
import {Radio} from 'antd';
import {RadioGroupProps} from 'antd/es/radio';

/**
 * @author xu.pengfei
 * @date 2021/1/18
 */
export default function BaseAuditRadio(props: RadioGroupProps) {
  const options = [
    { label: '同意', value: 'PASS' },
    { label: '拒绝', value: 'REJECTED' },
  ];
  return <Radio.Group options={options} optionType="button" buttonStyle="solid" {...props} />;
}
