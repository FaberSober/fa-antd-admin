import React from 'react';
import {Radio} from 'antd';
import {RadioGroupProps} from 'antd/es/radio';
import FaberEnums from "@/props/base/FaEnums";

/**
 * @author xu.pengfei
 * @date 2021/1/18
 */
export default function BaseSexRadio(props: RadioGroupProps) {
  const options = [
    { label: '女', value: FaberEnums.SexEnum.FEMALE },
    { label: '男', value: FaberEnums.SexEnum.MALE },
    { label: '保密', value: FaberEnums.SexEnum.UNKNOWN },
  ];
  return <Radio.Group options={options} optionType="button" buttonStyle="solid" {...props} />;
}
