import React, { useEffect, useState } from 'react';
import { useInterval } from 'ahooks';
import type { Admin } from '@features/fa-admin-pages/types';
import { systemApi } from '@features/fa-admin-pages/services';
import EchartsGaugeStep from '@features/fa-admin-pages/components/echarts/EchartsGaugeStep';

// export type SystemCpuProps = {}

export function SystemCpu() {
  const [data, setData] = useState<Admin.ServerInfo>();

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(fetchData, 5000);

  function fetchData() {
    systemApi.server().then((res) => setData(res.data));
  }

  let value = 0;
  if (data && data.cpuInfo) {
    value = data.cpuInfo.used;
  }

  return (
    <div className="fa-full fa-p12">
      <EchartsGaugeStep
        min={0}
        max={100}
        value={value}
        unit="%"
        // style={{width: 500, height: 300}}
      />
    </div>
  );
}

SystemCpu.displayName = 'SystemCpu'; // 必须与方法名称一致
SystemCpu.title = 'CPU';
SystemCpu.description = 'CPU运行状态指标图';
SystemCpu.showTitle = true; // 是否展示Card的Title
SystemCpu.permission = ''; // 需要的权限
SystemCpu.w = 4; // 宽度-max=16
SystemCpu.h = 12; // 高度
