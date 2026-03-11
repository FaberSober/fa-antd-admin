import { InputNumber, Space } from 'antd';
import type { InputNumberProps } from 'antd';
import { forwardRef } from 'react';

export interface FormNumberProps extends Omit<InputNumberProps, 'addonBefore' | 'addonAfter'> {
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  compact?: boolean; // 是否紧凑模式（默认 true）
}

const FormNumber = forwardRef<HTMLInputElement, FormNumberProps>(
  ({ addonAfter, addonBefore, compact = true, style, ...rest }, ref:any) => {
    const input = <InputNumber ref={ref} style={{ width: '100%', ...style }} {...rest} />;

    if (!addonAfter && !addonBefore) {
      return input;
    }

    return (
      <Space.Compact block>
        {addonAfter && <div className="ant-input-group-addon">{addonAfter}</div>}
        {input}
        {addonBefore && <div className="ant-input-group-addon">{addonBefore}</div>}
      </Space.Compact>
    );
  },
);

FormNumber.displayName = 'FormNumber';

export default FormNumber;
