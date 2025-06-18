import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import { trim } from 'lodash';
import type { CascaderProps } from 'antd/es/cascader';
import useRoutesTree from '@features/fa-admin-pages/hooks/useRoutesTree';

export interface RouteCascaderProps extends Omit<CascaderProps<any>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (v: string) => void;
}

/**
 * @author xu.pengfei
 * @date 2023/1/4 14:48
 */
export default function RouteCascader({ value, onChange, ...props }: RouteCascaderProps) {
  const routeTree = useRoutesTree();
  const [innerValue, setInnerValue] = useState<any[]>(valueToInner(value));

  useEffect(() => {
    setInnerValue(valueToInner(value));
  }, [value]);

  function valueToInner(v: any) {
    return trim(v)
      .split('/')
      .filter((i) => i !== '');
  }

  function handleValueChange(v: any[]) {
    setInnerValue(v);
    if (onChange) {
      const path = '/' + (v || []).join('/');
      onChange(path);
    }
  }

  return <Cascader options={routeTree} value={innerValue} onChange={handleValueChange} changeOnSelect {...props} />;
}
