import React, { type CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as echarts from 'echarts';
import type { ECharts, BarSeriesOption, EChartsOption } from 'echarts';
import { type Fa, ThemeLayoutContext, FaUtils } from '@fa/ui';
import { useSize } from 'ahooks';

export interface EchartsBarProps {
  title?: string;
  subTitle?: string;
  data: Fa.ChartArrayData[];
  dataTitle?: string;
  unit?: string;
  barWidth?: number;
  style?: CSSProperties;
  barSeriesOption?: BarSeriesOption;
  options?: EChartsOption;
  dark?: boolean; // 是否暗色主题
}

/**
 * @author xu.pengfei
 * @date 2023/2/2 09:52
 */
export default function EchartsBar({ title, subTitle, data, dataTitle, unit, barWidth = 30, style, barSeriesOption, options, dark }: EchartsBarProps) {
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
    let theme = themeDark ? 'dark' : 'light';
    if (dark) {
      theme = 'dark';
    }
    chartRef.current = echarts.init(document.getElementById(id), theme);

    chartRef.current.setOption({
      backgroundColor: 'transparent',
      title: {
        text: title,
        subtext: subTitle,
        left: 'center',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        orient: 'vertical',
        top: 24,
      },
      xAxis: {
        data: data.map((i) => i.name),
        // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: dataTitle,
          type: 'bar',
          // data: [5, 20, 36, 10, 10, 20]
          data: data.map((i) => i.value),
          barWidth,
          tooltip: {
            //鼠标移入图上数值显示格式
            valueFormatter: (value: any) => FaUtils.tryToFixedNum(value, 1) + (unit ? ` ${unit}` : ''),
          },
          ...barSeriesOption,
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
      ...options,
    });
    setReady(true);
  }, [themeDark, options]);

  useEffect(() => {
    if (!ready) return;

    // @ts-ignore
    chartRef.current.setOption({
      xAxis: {
        data: data.map((i) => i.name),
        // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      series: [{ data }],
    });
  }, [data]);

  return (
    <div ref={domRef} style={{ position: 'relative', height: '100%', width: '100%', ...style }}>
      <div id={id} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
