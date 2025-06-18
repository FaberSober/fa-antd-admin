import React from 'react';
import { Radio } from 'antd';
import { RadioProps } from 'antd/es/radio';


/**
 * 通用审核结果-Bool
 * @author xu.pengfei
 * @date 2021/3/11
 */
export default function BaseAuditBoolRadio(props: RadioProps) {
  const options: any[] = [
    { label: '通过', value: true },
    { label: '不通过', value: false },
  ];

  return <Radio.Group options={options} optionType="button" buttonStyle="solid" {...props} />;
}
