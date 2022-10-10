import React from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/es/select';
import FaEnums from "@/props/base/FaEnums";

interface IProps extends SelectProps<any> {}

/**
 * @author xu.pengfei
 * @date 2021/3/11
 */
export default function BaseSexSelector(props: IProps) {
  const options = [
    { label: '女', value: FaEnums.SexEnum.FEMALE },
    { label: '男', value: FaEnums.SexEnum.MALE },
    { label: '保密', value: FaEnums.SexEnum.UNKNOWN },
  ];

  return (
    // @ts-ignore
    <Select allowClear options={options} style={{ minWidth: 70 }} {...props} />
  );
}
