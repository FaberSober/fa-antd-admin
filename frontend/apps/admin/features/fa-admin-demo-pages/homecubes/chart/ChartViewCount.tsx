import React, { useContext, useMemo } from 'react';
import EchartsBase from '@features/fa-admin-pages/components/echarts/EchartsBase';
import { ThemeLayoutContext } from '@fa/ui';

export function ChartViewCount() {
  const { themeDark } = useContext(ThemeLayoutContext);

  const legendTextColor = themeDark ? '#aaa' : '#666';
  const axisNameColor   = themeDark ? '#bbb' : '#555';
  const splitAreaColors = themeDark
    ? ['rgba(60,70,90,0.3)', 'rgba(60,70,90,0.1)', 'rgba(60,70,90,0.3)', 'rgba(60,70,90,0.1)']
    : ['rgba(220,225,235,0.3)', 'rgba(220,225,235,0.1)', 'rgba(220,225,235,0.3)', 'rgba(220,225,235,0.1)'];
  const splitLineColor  = themeDark ? 'rgba(120,140,170,0.4)' : 'rgba(180,190,210,0.5)';

  const option = useMemo(() => ({
    legend: {
      data: ['访问', '趋势'],
      bottom: 0,
      itemWidth: 14,
      itemHeight: 14,
      textStyle: { fontSize: 12, color: legendTextColor },
    },
    radar: {
      indicator: [
        { name: '网页',  max: 100 },
        { name: '其它',  max: 100 },
        { name: '第三方', max: 100 },
        { name: '客户端', max: 100 },
        { name: 'Ipad',  max: 100 },
        { name: '移动端', max: 100 },
      ],
      shape: 'polygon',
      radius: '65%',
      center: ['50%', '46%'],
      splitNumber: 4,
      axisName: { color: axisNameColor, fontSize: 12 },
      splitArea: {
        areaStyle: {
          color: splitAreaColors,
        },
      },
      splitLine: { lineStyle: { color: splitLineColor } },
      axisLine:  { lineStyle: { color: splitLineColor } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            name: '访问',
            value: [45, 30, 35, 55, 40, 80],
            symbol: 'none',
            areaStyle: { color: 'rgba(150,120,220,0.35)' },
            lineStyle: { color: 'rgba(150,120,220,0.8)', width: 1.5 },
            itemStyle: { color: 'rgba(150,120,220,0.8)' },
          },
          {
            name: '趋势',
            value: [80, 25, 30, 40, 35, 90],
            symbol: 'none',
            areaStyle: { color: 'rgba(100,180,250,0.45)' },
            lineStyle: { color: 'rgba(80,160,240,0.9)', width: 1.5 },
            itemStyle: { color: 'rgba(80,160,240,0.9)' },
          },
        ],
      },
    ],
  }), [themeDark, legendTextColor, axisNameColor, splitAreaColors, splitLineColor]);

  return <EchartsBase option={option} />;
}

ChartViewCount.displayName = 'ChartViewCount'; // 必须与方法名称一致
ChartViewCount.title = '访问数量';
ChartViewCount.description = '访问数量雷达图';
ChartViewCount.showTitle = true; // 是否展示Card的Title
ChartViewCount.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
ChartViewCount.w = 8; // 宽度-网格-max=24
ChartViewCount.h = 8; // 高度-每个单位20px