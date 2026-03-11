import React, { useContext, useMemo } from 'react';
import EchartsBase from '@features/fa-admin-pages/components/echarts/EchartsBase';
import { ThemeLayoutContext } from '@fa/ui';

// 6:00 ~ 23:00 时间轴
const hours = ['6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

// 模拟流量数据（蓝色：总流量，绿色：活跃流量）
const pvData    = [2000, 4000, 8000, 20000, 38000, 58000, 65000, 32000, 18000, 42000, 70000, 48000, 28000, 18000, 12000, 8000, 4000, 2000];
const activeData = [500, 1200, 2500, 6000, 10000, 14000, 20000, 9000, 5000, 12000, 22000, 14000, 8000, 4500, 3000, 2000, 1000, 500];

export function ChartTrend() {
  const { themeDark } = useContext(ThemeLayoutContext);

  const axisLabelColor  = themeDark ? '#888' : '#aaa';
  const splitLineColor  = themeDark ? '#2f3a4b' : '#e8eaf0';

  const option = useMemo(() => ({
    grid: {
      left: '1%',
      right: '1%',
      bottom: '3%',
      top: '4%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
      formatter: (params: any[]) =>
        params.map((p: any) => `${p.marker}${p.seriesName}：${p.value.toLocaleString()}`).join('<br/>'),
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hours,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: splitLineColor, type: 'solid' } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 80000,
      interval: 20000,
      axisLabel: {
        color: axisLabelColor,
        fontSize: 11,
        formatter: (v: number) => v === 0 ? '0' : `${(v / 1000).toFixed(0)},000`,
      },
      splitLine: { lineStyle: { color: splitLineColor } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: '总流量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: pvData,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(100,181,246,0.7)' },
              { offset: 1, color: 'rgba(144,202,249,0.1)' },
            ],
          },
        },
        lineStyle: { color: '#64b5f6', width: 2 },
        itemStyle: { color: '#fff', borderColor: '#64b5f6', borderWidth: 2 },
        emphasis: { focus: 'series' },
      },
      {
        name: '活跃流量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: activeData,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(38,166,154,0.8)' },
              { offset: 1, color: 'rgba(38,166,154,0.1)' },
            ],
          },
        },
        lineStyle: { color: '#26a69a', width: 2 },
        itemStyle: { color: '#fff', borderColor: '#26a69a', borderWidth: 2 },
        emphasis: { focus: 'series' },
      },
    ],
  }), [themeDark, axisLabelColor, splitLineColor]);

  return <EchartsBase option={option} />;
}

ChartTrend.displayName = 'ChartTrend'; // 必须与方法名称一致
ChartTrend.title = '流量趋势';
ChartTrend.description = '最近24小时流量趋势';
ChartTrend.showTitle = true; // 是否展示Card的Title
ChartTrend.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
ChartTrend.w = 24; // 宽度-网格-max=24
ChartTrend.h = 10; // 高度-每个单位20px