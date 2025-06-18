import React, { useEffect, useState } from 'react';
import { logApiApi, jobLogApi } from '@features/fa-admin-pages/services';
import dayjs from 'dayjs';
import { FaUtils } from '@fa/ui';
import { useInterval } from 'ahooks';
import NumBlock from '@features/fa-admin-pages/components/base-card/NumBlock';

export type ApiCountProps = {};

export function ApiCount() {
  const [apiCount, setApiCount] = useState<number>(0);
  const [apiErrorCount, setApiErrorCount] = useState<number>(0);
  const [jobApiErrorCount, setJobApiErrorCount] = useState<number>(0);

  function refresh() {
    const dayStart = FaUtils.getDateStrBeginOfDay(dayjs());
    const dayEnd = FaUtils.getDateStrEndOfDay(dayjs());

    // 今日API访问数
    logApiApi
      .count({
        query: {
          'crtTime#$min': dayStart,
          'crtTime#$max': dayEnd,
        },
      })
      .then((res) => setApiCount(res.data));

    // 今日API异常数
    logApiApi
      .count({
        query: {
          'crtTime#$min': dayStart,
          'crtTime#$max': dayEnd,
          'retStatus#$notIn': [200, 401],
        },
      })
      .then((res) => setApiErrorCount(res.data));

    // 定时任务异常数
    jobLogApi
      .count({
        query: {
          'beginTime#$min': dayStart,
          'beginTime#$max': dayEnd,
          status: 9,
        },
      })
      .then((res) => setJobApiErrorCount(res.data));
  }

  useEffect(() => {
    refresh();
  }, []);

  useInterval(refresh, 60 * 1000);

  return (
    <div className="fa-full fa-p12">
      <NumBlock title="今日API访问数" value={apiCount} valueStyle={{ color: '#33DE7F' }} unitStyle={{ color: '#33DE7F' }} />
      <NumBlock title="今日API异常数" value={apiErrorCount} valueStyle={{ color: '#ED5F62' }} unitStyle={{ color: '#ED5F62' }} style={{ marginTop: 12 }} />
      <NumBlock title="定时任务异常数" value={jobApiErrorCount} valueStyle={{ color: '#ED5F62' }} unitStyle={{ color: '#ED5F62' }} style={{ marginTop: 12 }} />
    </div>
  );
}

ApiCount.displayName = 'ApiCount'; // 必须与方法名称一致
ApiCount.title = 'API统计';
ApiCount.description = 'API访问数量统计';
ApiCount.showTitle = true; // 是否展示Card的Title
ApiCount.permission = ''; // 需要的权限
ApiCount.w = 4; // 宽度-max=16
ApiCount.h = 12; // 高度
