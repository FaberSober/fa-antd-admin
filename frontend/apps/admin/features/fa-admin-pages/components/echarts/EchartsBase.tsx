import React, { type CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';
import { useSize } from 'ahooks';
import { ThemeLayoutContext } from '@fa/ui';

export interface EchartsBaseProps {
  option?: EChartsOption;
  style?: CSSProperties;
  dark?: boolean; // 是否暗色主题
}

/**
 * @author xu.pengfei
 * @date 2023/2/2 09:52
 */
export default function EchartsBase({ option, style, dark }: EchartsBaseProps) {
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
    // @ts-ignore
    chartRef.current = echarts.init(document.getElementById(id), theme);

    // @ts-ignore
    chartRef.current.setOption({ backgroundColor: 'transparent', ...option });
    setReady(true);
  }, [themeDark]);

  useEffect(() => {
    if (!ready) return;
    if (option === undefined) return;

    chartRef.current!.setOption({ backgroundColor: 'transparent', ...option });
  }, [option]);

  return (
    <div ref={domRef} style={{ position: 'relative', height: '100%', width: '100%', ...style }}>
      <div id={id} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
