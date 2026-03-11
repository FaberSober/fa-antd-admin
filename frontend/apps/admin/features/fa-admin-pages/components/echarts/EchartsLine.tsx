import React, { type CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as echarts from 'echarts';
import type { ECharts, LineSeriesOption } from 'echarts';
import { ThemeLayoutContext } from '@fa/ui';
import { useSize } from 'ahooks';

type serie = {
  name: string;
  data: number[];
};

export interface EchartsLineProps {
  title?: string;
  subTitle?: string;
  dataX: string[];
  dataY: serie[];
  unit?: string;
  dataTitle?: string;
  style?: CSSProperties;
  lineSeriesOption?: LineSeriesOption;
  restOption?: any;
}

/**
 * @author xu.pengfei
 * @date 2023/2/2 09:52
 */
export default function EchartsLine({ title, subTitle, dataX, dataY, unit, style, lineSeriesOption, restOption }: EchartsLineProps) {
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
      title: {
        text: title,
        subtext: subTitle,
        left: 'center',
        top: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true,
      },
      // toolbox: FaUtils.EchartsToolbox,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: dataY.map((i) => i.name),
        top: 0,
      },
      xAxis: {
        type: 'category',
        data: dataX,
      },
      yAxis: {},
      series: dataY.map((dy) => ({
        name: dy.name,
        data: dy.data,
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          //鼠标移入图上数值显示格式
          valueFormatter: (value: any) => {
            const formattedValue = typeof value === 'number' ? value.toFixed(1) : value;
            return formattedValue + (unit ? ` ${unit}` : '');
          },
        },
        ...lineSeriesOption,
      })),
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
      ...restOption,
    });
    setReady(true);
  }, [themeDark, restOption]);

  useEffect(() => {
    if (!ready) return;

    // @ts-ignore
    chartRef.current.setOption({
      xAxis: {
        data: dataX,
      },
      series: dataY.map((dy) => ({
        name: dy.name,
        data: dy.data,
      })),
    });
  }, [dataX, dataY]);

  return (
    <div ref={domRef} style={{ position: 'relative', height: '100%', width: '100%', ...style }}>
      <div id={id} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
