import React, { useContext, useMemo } from 'react';
import EchartsBase from '@features/fa-admin-pages/components/echarts/EchartsBase';
import { ThemeLayoutContext } from '@fa/ui';

export function ChartViewFrom() {
  const { themeDark } = useContext(ThemeLayoutContext);

  const labelColor     = themeDark ? '#ccc' : '#555';
  const labelLineColor = themeDark ? '#5a7090' : '#b0c4de';

  const option = useMemo(() => ({
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['42%', '50%'],
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 13,
          color: labelColor,
          lineHeight: 20,
        },
        labelLine: {
          length: 16,
          length2: 24,
          lineStyle: { color: labelLineColor },
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
        },
        data: [
          { value: 120, name: '技术支持', itemStyle: { color: '#6cb4f5' } },
          { value: 180, name: '定制',   itemStyle: { color: '#b8a9f0' } },
          { value: 360, name: '远程',   itemStyle: { color: '#7de0e6' } },
          { value: 580, name: '外包',   itemStyle: { color: '#26bfad' } },
        ],
      },
    ],
  }), [themeDark, labelColor, labelLineColor]);

  return <EchartsBase option={option} />;
}

ChartViewFrom.displayName = 'ChartViewFrom'; // 必须与方法名称一致
ChartViewFrom.title = '访问来源';
ChartViewFrom.description = '访问来源分布玫瑰图';
ChartViewFrom.showTitle = true; // 是否展示Card的Title
ChartViewFrom.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
ChartViewFrom.w = 8; // 宽度-网格-max=24
ChartViewFrom.h = 8; // 高度-每个单位20px