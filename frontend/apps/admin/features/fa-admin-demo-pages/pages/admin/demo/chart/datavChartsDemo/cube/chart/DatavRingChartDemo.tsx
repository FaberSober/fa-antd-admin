import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import { ThemeLayoutContext, FaUtils } from '@fa/ui';
import { useSize } from 'ahooks';
import 'echarts-gl';

// 颜色
const DEFAULT_COLORS = [
  '#0091EA',
  '#1ee9ffff',
  '#70ce41ff',
  '#E6A23C',
  '#F56C6C',
];

type Props = { data?: { name: string; value: number }[] };

export default function DatavRingChartDemo({ data }: Props) {
  // 预想参数
  const title = '当日运单数情况';
  const subTitle = '';
  const unit = '个';
  // 最大数据对应环段的高度
  const maxHeight = 30;
  // 中间空心的直径
  const internalDiameterRatio = 0.83;
  //const dark = true;

  const { themeDark } = useContext(ThemeLayoutContext);

  const chartRef = useRef<ECharts>();
  const [id] = useState(uuidv4());
  const [ready, setReady] = useState(false);

  const domRef = useRef<any | null>();
  const size = useSize(domRef);

  // 当前展示数据
  const [hoveredData, setHoveredData] = useState<{ name: string, value: number, percent: number, idx: number } | null>(null);
  const hoveredDataRef = useRef<typeof hoveredData | null>(null);
  // 当前标签选中状态
  const legendSelectedRef = useRef<Record<string, boolean>>();

  // 从大到小给数据排序
  const sortedData = data!.sort((a, b) => (b.value - a.value));

  useEffect(() => {
    if (!ready) return;

    chartRef.current!.resize();
  }, [size]);

  useEffect(() => {
    if (chartRef.current) chartRef.current.dispose();

    // 基于准备好的dom，初始化echarts实例
    let theme = themeDark ? 'dark' : 'light';
    /*if (dark) {
      theme = 'dark';
    }*/
    chartRef.current = echarts.init(document.getElementById(id), theme);

    chartRef.current.setOption({
      backgroundColor: 'transparent',
      title: {
        text: title,
        subtext: subTitle,
        left: 'center',
        top: 0,
      },
      grid3D: {
        show: false,
        boxHeight: 3,
        viewControl: {
          alpha: 30, // 圆环俯视角度
          distance: 170,
          rotateSensitivity: 0,
          zoomSensitivity: 0,
          panSensitivity: 0,
          autoRotate: false
        },
        postEffect: {
          enable: true,
          /*bloom: {
            enable: true,
            bloomIntensity: 1
          },*/
          /*SSAO: {
            enable: true,
            quality: 'medium',
            radius: 2
          }*/
        }
      },
      /*tooltip: {
        show: true,
        trigger: 'item',
      },*/
      color: DEFAULT_COLORS,
      legend: {
        right: 30,
        top: 24,
        itemStyle: {
          opacity: 1
        },
      },
      label: {
        show: true
      },
      xAxis3D: {
        min: -1,
        max: 1
      },
      yAxis3D: {
        min: -1,
        max: 1
      },
      zAxis3D: {
        min: -2,
        max: 2
      },
      series: getSeriesOption(),
    });

    setReady(true);
  }, [themeDark]);

  useEffect(() => {
    if (!ready) return;

    // @ts-ignore
    chartRef.current.setOption({
      series: getSeriesOption()
    });
  }, [data]);

  useEffect(() => {
    if (!ready) return;

    if (sortedData.length > 0) {
      legendSelectedRef.current = Object.fromEntries(sortedData.map(d => [d.name, true]));

      const initialDataSum = sortedData.reduce((sum, d) => sum + d.value, 0);
      const initialHoveredData = {
        ...sortedData[0],
        percent: sortedData[0].value / initialDataSum * 100,
        idx: 0
      };
      changeHovered(null, initialHoveredData);
    }

    // 标签选中状态变化
    // @ts-ignore
    chartRef.current.on('legendselectchanged', function (params: any) {
      // 根据所有选中标签重新渲染圆环
      chartRef.current!.setOption({
        series: getSeriesOption(params.selected)
      });
      legendSelectedRef.current = params.selected;

      // 如果当前展示数据被隐藏，展示第一个未被隐藏的数据
      let newHovered;
      if (!params.selected[hoveredDataRef.current!.name]) {
        newHovered = getHoveredData(params.selected);
      } else {
        newHovered = getHoveredData(params.selected, hoveredDataRef.current!.idx);
      }
      changeHovered(hoveredDataRef.current, newHovered);
    });

    // 鼠标进入环中
    // @ts-ignore
    chartRef.current.on('mouseover', function (params: any) {
      // 如果当前展示数据不是鼠标悬浮的环对应数据，更新当前展示数据
      if (legendSelectedRef.current && hoveredDataRef.current && hoveredDataRef.current.idx !== params.seriesIndex) {
        const newHovered = getHoveredData(legendSelectedRef.current, params.seriesIndex);
        changeHovered(hoveredDataRef.current, newHovered);
      }
    });
  }, [data, themeDark]);

  // 改变当前展示数据
  const changeHovered = (oldHovered: typeof hoveredData, newHovered: typeof hoveredData) => {
    // 高亮当前展示数据
    // @ts-ignore
    const newSeries = chartRef.current?.getOption().series.map((s, idx) => {
      if (newHovered && idx === newHovered.idx) {
        return {
          itemStyle: {
            opacity: 0.4
          }
        }
      } else if (oldHovered && idx === oldHovered.idx) {
        return {
          itemStyle: {
            opacity: 0.75
          }
        }
      }
      return {}
    });

    // @ts-ignore
    chartRef.current.setOption({ series: newSeries });
    hoveredDataRef.current = newHovered;
    setHoveredData(newHovered);
  };

  // 获取展示数据
  const getHoveredData = (legendSelected: Record<string, boolean>, hoveredIdx?: number) => {
    if (sortedData.length > 0) {
      const selectedData = sortedData.map((d, idx) => ({ ...d, idx: idx })).filter(d => !legendSelected || legendSelected[d.name]);
      if (selectedData.length > 0) {
        const total = selectedData.reduce((sum, d) => sum + d.value, 0);
        const idx = hoveredIdx ?? selectedData[0].idx; // 默认展示第一个未被隐藏的数据
        return {
          name: sortedData[idx].name,
          value: sortedData[idx].value,
          percent: (sortedData[idx].value / total) * 100, // 占比基于当前所有选中数据
          idx: idx
        }
      }
      return null;
    }
    return null;
  }

  // 获取圆环段参数方程
  const getParametricEquation = (startRatio: number, endRatio: number, height: number) => {
    const startRadian = startRatio * Math.PI * 2;
    const endRadian = endRatio * Math.PI * 2;

    const k = 1 - internalDiameterRatio;

    return {
      u: {
        min: -Math.PI,
        max: Math.PI * 2,
        step: Math.PI / 32,
      },
      v: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20,
      },
      x: (u: number, v: number) => {
        if (u < startRadian) {
          return Math.cos(startRadian) * (1 + Math.cos(v) * k);
        }
        if (u > endRadian) {
          return Math.cos(endRadian) * (1 + Math.cos(v) * k);
        }
        return Math.cos(u) * (1 + Math.cos(v) * k);
      },
      y: (u: number, v: number) => {
        if (u < startRadian) {
          return Math.sin(startRadian) * (1 + Math.cos(v) * k);
        }
        if (u > endRadian) {
          return Math.sin(endRadian) * (1 + Math.cos(v) * k);
        }
        return Math.sin(u) * (1 + Math.cos(v) * k);
      },
      z: (u: number, v: number) => {
        if (u < -Math.PI * 0.5) {
          return Math.sin(u);
        }
        if (u > Math.PI * 2.5) {
          return Math.sin(u);
        }
        return Math.sin(v) > 0 ? 1 * height : -1;
      }
    };
  }

  // 获取series
  function getSeriesOption(legendSelected?: Record<string, boolean>): any[] {
    const seriesOption: any[] = [];

    let maxValue = -Infinity;
    let sumValue = 0;

    // 隐藏未被选中的数据
    const visibleData = sortedData.map((d) => {
      if (!legendSelected || legendSelected[d.name]) {
        maxValue = Math.max(maxValue, d.value);
        sumValue += d.value;
        return d;
      } else {
        return { name: d.name, value: 0 }
      }
    });

    let startValue = 0;

    visibleData.forEach((item) => {
      const endValue = startValue + item.value;
      const startRatio = startValue / sumValue;
      const endRatio = endValue / sumValue;

      const height = item.value / maxValue * maxHeight;

      seriesOption.push({
        name: item.name,
        type: 'surface',
        parametric: true,
        parametricEquation: getParametricEquation(startRatio, endRatio, height),
        wireframe: {
          show: false
        },
        itemStyle: {
          opacity: 0.75
        },
        /*tooltip: {
          //鼠标移入图上数值显示格式
          formatter: (params: any) => {
            const itemValue = sortedData[params.seriesIndex].value;
            return '<p>' + params.seriesName + ": " + FaUtils.tryToFixedNum(itemValue, 1) + (unit ? ` ${unit}` : '') + '</p>';
          },
        },*/
      });

      startValue = endValue;
    });

    return seriesOption;
  }

  return (
    <div ref={domRef} style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div id={id} style={{ height: '100%', width: '100%' }} />
      {hoveredData && (
        <div
          style={{
            position: 'absolute',
            top: '43%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 10,
            color: themeDark ? '#fff' : '#333',
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {FaUtils.tryToFixedNum(hoveredData.percent, 1)}%
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {hoveredData.name + ' ' + FaUtils.tryToFixedNum(hoveredData.value, 1) + unit}
          </div>
        </div>
      )}
    </div>
  );
}
