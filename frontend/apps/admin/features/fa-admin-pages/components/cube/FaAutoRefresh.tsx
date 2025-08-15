import React from 'react';
import { useAutoRefresh } from "@features/fa-admin-pages/hooks";
import { Select, SelectProps, Tooltip } from "antd";


export interface FaAutoRefreshProps extends SelectProps {
  refresh: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025/7/29 10:54
 */
export default function FaAutoRefresh({refresh, ...props}: FaAutoRefreshProps) {
  const {autoRefreshSec, setAutoRefreshSec} = useAutoRefresh(-1, refresh)

  return (
    <Tooltip title="定时刷新数据">
      <Select
        options={[
          { label: '不刷新', value: -1 },
          { label: '5s', value: 5 },
          { label: '10s', value: 10 },
          { label: '30s', value: 30 },
          { label: '60s', value: 60 },
        ]}
        style={{width: 85}}
        value={autoRefreshSec}
        onChange={(v) => setAutoRefreshSec(v)}
        {...props}
      />
    </Tooltip>
  )
}
