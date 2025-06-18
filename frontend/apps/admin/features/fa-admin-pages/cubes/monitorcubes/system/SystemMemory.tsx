import React, { useEffect, useState } from 'react';
import { useInterval } from 'ahooks';
import { FaUtils } from '@fa/ui';
import type { Admin } from '@features/fa-admin-pages/types';
import { systemApi } from '@features/fa-admin-pages/services';
import EchartsGaugeStep from '@features/fa-admin-pages/components/echarts/EchartsGaugeStep';

export type SystemMemoryProps = {};

export function SystemMemory() {
  const [data, setData] = useState<Admin.ServerInfo>();

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(fetchData, 5000);

  function fetchData() {
    systemApi.server().then((res) => setData(res.data));
  }

  let value: any = 0;
  let totalStr: any = '';
  let usedStr: any = '';
  if (data && data.memory && data.memory.total > 0) {
    const used = data.memory.total - data.memory.available;
    value = ((used / data.memory.total) * 100).toFixed(0);

    usedStr = FaUtils.sizeToHuman(used);
    totalStr = FaUtils.sizeToHuman(data.memory.total);
  }

  return (
    <div className="fa-full fa-p12">
      <EchartsGaugeStep
        min={0}
        max={100}
        value={value}
        unit="%"
        // style={{width: 500, height: 300}}
        subTitle={`${usedStr} / ${totalStr}`}
      />
    </div>
  );
}

SystemMemory.displayName = 'SystemMemory'; // 必须与方法名称一致
SystemMemory.title = '内存';
SystemMemory.description = '内存运行状态指标图';
SystemMemory.showTitle = true; // 是否展示Card的Title
SystemMemory.permission = ''; // 需要的权限
SystemMemory.w = 4; // 宽度-max=16
SystemMemory.h = 12; // 高度
