import React from 'react';
import {ColorPicker, ColorPickerProps} from 'antd';

export interface InputColorProps extends Omit<ColorPickerProps, 'onChange'> {
  onChange?: (v:string) => void;
}

/**
 * 配置面板输入组件-颜色选择
 * @author xu.pengfei
 * @date 2021/1/5
 */
export default function InputColor({ value, onChange, ...props }: InputColorProps) {
  return (
    <ColorPicker
      value={value}
      onChange={(color, hex) => {
        if (onChange) {
          onChange(hex)
        }
      }}
      presets={[
        {
          label: '推荐',
          colors: [
            '#F5222D',
            '#FA8C16',
            '#FADB14',
            '#8BBB11',
            '#52C41A',
            '#13A8A8',
            '#1677FF',
            '#2F54EB',
            '#722ED1',
            '#EB2F96',
            '#FFFFFF',
            '#EEEEEE',
            '#DDDDDD',
            '#CCCCCC',
            '#BBBBBB',
            '#AAAAAA',
            '#999999',
            '#888888',
            '#777777',
            '#666666',
            '#555555',
            '#444444',
            '#333333',
            '#222222',
            '#111111',
            '#000000',
          ],
        },
        // {
        //   label: 'Recent',
        //   colors: [],
        // },
      ]}
      {...props}
    />
  );
}
