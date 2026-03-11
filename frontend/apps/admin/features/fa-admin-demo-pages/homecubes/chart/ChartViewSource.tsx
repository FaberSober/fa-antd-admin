import React, { useContext, useMemo } from 'react';
import EchartsBase from '@features/fa-admin-pages/components/echarts/EchartsBase';
import { ThemeLayoutContext } from '@fa/ui';

export function ChartViewSource() {
  const { themeDark } = useContext(ThemeLayoutContext);

  const legendTextColor = themeDark ? '#aaa' : '#666';

  const option = useMemo(() => ({
    legend: {
      bottom: 0,
      left: 'center',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 20,
      textStyle: { fontSize: 12, color: legendTextColor },
      data: ['搜索引擎', '直接访问', '邮件营销', '联盟广告'],
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '44%'],
        padAngle: 4,        // 扇区间隙（单位：度）
        itemStyle: {
          borderRadius: 8,  // 圆角
        },
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 6,
          label: { show: false },
        },
        data: [
          { value: 1048, name: '搜索引擎', itemStyle: { color: '#6cb4f5' } },
          { value: 735,  name: '直接访问', itemStyle: { color: '#b8a9f0' } },
          { value: 580,  name: '邮件营销', itemStyle: { color: '#7de0e6' } },
          { value: 484,  name: '联盟广告', itemStyle: { color: '#4ecdc4' } },
        ],
      },
    ],
  }), [themeDark, legendTextColor]);

  return <EchartsBase option={option} />;
}

ChartViewSource.displayName = 'ChartViewSource'; // 必须与方法名称一致
ChartViewSource.title = '访问终端';
ChartViewSource.description = '访问终端分布饼图';
ChartViewSource.showTitle = true; // 是否展示Card的Title
ChartViewSource.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
ChartViewSource.w = 8; // 宽度-网格-max=24
ChartViewSource.h = 8; // 高度-每个单位20px