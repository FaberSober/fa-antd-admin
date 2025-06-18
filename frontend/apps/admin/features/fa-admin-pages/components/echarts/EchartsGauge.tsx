import React, { type CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import { useSize } from 'ahooks';
import { ThemeLayoutContext } from '@fa/ui';

export interface EchartsGaugeProps {
  min: number;
  max: number;
  value: number;
  unit?: string;
  restOption?: any;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2023/6/7 11:22
 */
export default function EchartsGauge({ min, max, value, unit, restOption, style }: EchartsGaugeProps) {
  const { themeDark } = useContext(ThemeLayoutContext);

  const chartRef = useRef<ECharts>();
  const [id] = useState(uuidv4());
  const [ready, setReady] = useState(false);

  const domRef = useRef<any | null>();
  const size = useSize(domRef);

  useEffect(() => {
    // console.log('size', size)
    if (!ready) return;

    chartRef.current!.resize();
  }, [size]);

  useEffect(() => {
    if (chartRef.current) chartRef.current.dispose();

    // 基于准备好的dom，初始化echarts实例
    const theme = themeDark ? 'dark' : 'light';
    // @ts-ignore
    chartRef.current = echarts.init(document.getElementById(id), theme);

    // @ts-ignore
    chartRef.current.setOption({
      backgroundColor: 'transparent',
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: min,
          max: max,
          splitNumber: 10,
          itemStyle: {
            color: '#FFAB91',
          },
          progress: {
            show: true,
            width: 20,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 20,
            },
          },
          axisTick: {
            distance: -35,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: '#999',
            },
          },
          splitLine: {
            distance: -42,
            length: 14,
            lineStyle: {
              width: 2,
              color: '#999',
            },
          },
          axisLabel: {
            distance: -20,
            color: '#999',
            fontSize: 16,
          },
          anchor: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-15%'],
            fontSize: 40,
            fontWeight: 'bolder',
            formatter: `{value} ${unit}`,
            color: 'inherit',
          },
          data: [
            {
              value: value,
            },
          ],
        },
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: min,
          max: max,
          itemStyle: {
            color: '#FD7347',
          },
          progress: {
            show: true,
            width: 6,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: value,
            },
          ],
        },
      ],
      ...restOption,
    });
    setReady(true);
  }, [themeDark]);

  useEffect(() => {
    if (!ready) return;

    // @ts-ignore
    chartRef.current.setOption({
      series: [
        {
          data: [
            {
              value,
            },
          ],
        },
        {
          data: [
            {
              value,
            },
          ],
        },
      ],
    });
  }, [value]);

  return (
    <div ref={domRef} style={{ position: 'relative', height: '100%', width: '100%', ...style }}>
      <div id={id} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
