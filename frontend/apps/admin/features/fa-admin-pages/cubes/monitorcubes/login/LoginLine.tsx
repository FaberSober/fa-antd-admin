import React, { useEffect, useState } from 'react';
import type { Fa } from '@/types';
import { FaUtils } from '@fa/ui';
import dayjs from 'dayjs';
import EchartsLine from '@features/fa-admin-pages/components/echarts/EchartsLine';
import { logLoginApi } from '@features/fa-admin-pages/services';

export type LoginLineProps = {};

export function LoginLine() {
  const [array, setArray] = useState<Fa.ChartSeriesVo[]>([]);
  const [options] = useState({ toolbox: { show: false } })

  useEffect(() => {
    logLoginApi
      .countByDay({
        startDate: FaUtils.getDateStrBeginOfDay(dayjs().add(-10, 'day'))!,
        endDate: FaUtils.getDateStrEndOfDay(dayjs())!,
      })
      .then((res) => setArray(res.data));
  }, []);

  return (
    <div className="fa-full fa-p12">
      <EchartsLine
        dataX={array.map((i) => i.name)}
        dataY={[
          {
            name: '登录用户数',
            data: array.map((i) => i.value),
          },
        ]}
        // restOption={{ toolbox: { show: false } }}
        restOption={options}
      />
    </div>
  );
}

LoginLine.displayName = 'LoginLine'; // 必须与方法名称一致
LoginLine.title = '每日登录统计';
LoginLine.description = '每日登录统计折线图';
LoginLine.showTitle = true; // 是否展示Card的Title
LoginLine.permission = ''; // 需要的权限
LoginLine.w = 12; // 宽度-max=16
LoginLine.h = 12; // 高度
