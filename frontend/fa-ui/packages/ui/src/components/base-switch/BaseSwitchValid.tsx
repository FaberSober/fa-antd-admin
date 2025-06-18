import React, { useState } from 'react';
import { BaseApi } from "@ui/services";
import { Switch } from "antd";


export interface BaseSwitchValidProps {
  id: string;
  value: boolean;
  validKey?: string;
  api: BaseApi<any, any>;
}

/**
 * @author xu.pengfei
 * @date 2024/9/9 21:00
 */
export default function BaseSwitchValid({id, value, api, validKey = 'valid'}: BaseSwitchValidProps) {
  const [loading, setLoading] = useState(false)

  function handleChange(valid: boolean) {
    setLoading(true)
    api.update(id, { [validKey]: valid }).then(_res => {
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  return <Switch defaultChecked={value} onChange={handleChange} loading={loading} />
}
