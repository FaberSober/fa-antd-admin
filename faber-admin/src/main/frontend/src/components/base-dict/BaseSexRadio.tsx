import React from 'react';
import {Radio} from 'antd';
import {RadioGroupProps} from 'antd/es/radio';
import FaEnums from "@/props/base/FaEnums";

/**
 * @author xu.pengfei
 * @date 2021/1/18
 */
export default function BaseSexRadio(props: RadioGroupProps) {
  const options = [
    { label: '女', value: FaEnums.SexEnum.FEMALE },
    { label: '男', value: FaEnums.SexEnum.MALE },
    { label: '保密', value: FaEnums.SexEnum.UNKNOWN },
  ];
  return <Radio.Group options={options} optionType="button" buttonStyle="solid" {...props} />;
}
