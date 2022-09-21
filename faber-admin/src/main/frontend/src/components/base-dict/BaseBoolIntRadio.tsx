import React from 'react';
import { Radio } from 'antd';
import { RadioGroupProps } from 'antd/es/radio';

/**
 * @author xu.pengfei
 * @date 2021/1/18
 */
export default function BaseBoolIntRadio(props: RadioGroupProps) {
  const options = [
    { label: '是', value: 1 },
    { label: '否', value: 0 },
  ];
  return <Radio.Group options={options} optionType="button" buttonStyle="solid" {...props} />;
}
