import { Input, Space } from 'antd';
import type { InputProps } from 'antd';
import { forwardRef } from 'react';

export interface FormInputProps extends Omit<InputProps, 'addonBefore' | 'addonAfter'> {
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  compact?: boolean; // 是否紧凑模式（默认 true）
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ addonAfter, addonBefore, compact = true, style, ...rest }, ref:any) => {
    const input = <Input ref={ref} style={{ width: '100%', ...style }} {...rest} />;

    if (!addonAfter && !addonBefore) {
      return input;
    }

    return (
      <Space.Compact block>
        {addonBefore && <div className="ant-input-group-addon">{addonBefore}</div>}
        {input}
        {addonAfter && <div className="ant-input-group-addon">{addonAfter}</div>}
      </Space.Compact>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
