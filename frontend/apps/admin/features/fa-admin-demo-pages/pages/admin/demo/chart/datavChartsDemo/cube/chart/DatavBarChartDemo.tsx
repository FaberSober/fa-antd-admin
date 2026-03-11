import React, { Children, type CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as echarts from 'echarts';
import type { ECharts, BarSeriesOption, EChartsOption } from 'echarts';
import { type Fa, ThemeLayoutContext, FaUtils } from '@fa/ui';
import { useSize } from 'ahooks';
import { start } from 'node:repl';

/*type dataSeries = {
  name: string;
  data: number[];
}

export interface DatavBarChartProps {
  title?: string;
  subTitle?: string;
  //data: Fa.ChartArrayData[];
  dataX: string[];
  dataY: dataSeries[];
  unit?: string;
  barWidth?: number;
  style?: CSSProperties;
  barSeriesOption?: BarSeriesOption;
  options?: EChartsOption;
  dark?: boolean; // 是否暗色主题
}*/

// 定义自定义图形的返回类型
interface CustomGraphicGroup {
  type: 'group';
  children: Array<{
    type: string;
    shape: any;
    style: any;
  }>;
}

// Bar颜色
const DEFAULT_COLORS = [
  '#0091EA',
  '#1ee9ffff',
  '#70ce41ff',
  '#E6A23C',
  '#F56C6C',
];

export default function DatavBarChartDemo() {
  // 预想参数
  const title = '省份统计场站数量';
  const subTitle = '';
  const dataX = ['江苏省', '浙江省', '福建省', '广东省', '广西省'];
  const dataY = [
    {
      name: '累计数据',
      data: [1048, 735, 580, 320, 300]
    },
    {
      name: '新增数据1',
      data: [400, 735, 50, 32, 0]
    },
    {
      name: '新增数据2',
      data: [200, 140, 120, 320, 1000]
    },
  ];
  const unit = '个';
  const barWidth = 16;
  const style = {};
  const options = {};
  //const dark = true;


  const { themeDark } = useContext(ThemeLayoutContext);

  const chartRef = useRef<ECharts>();
  const [id] = useState(uuidv4());
  const [ready, setReady] = useState(false);

  const domRef = useRef<any | null>();
  const size = useSize(domRef);

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

    chartRef.current.on('legendselectchanged', function(params: any) {
      chartRef.current!.setOption({
        series: getSeriesOption(params.selected)
      });
    });

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
        right: 30,
        top: 24,
        data: dataY.map((dy) => ({
          name: dy.name, // 隐藏数据总和标签
        }))
      },
      xAxis: {
        type: 'category',
        data: dataX,
      },
      yAxis: { type: 'value' },
      series: getSeriesOption(),
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
        data: dataX,
      },
      series: getSeriesOption()
    });
  }, [dataX, dataY]);

  // 获取bar颜色
  const getLayerColor = (layerIdx: number) => {
    return DEFAULT_COLORS[layerIdx % DEFAULT_COLORS.length];
  }
  
  // 颜色从上到下逐渐透明
  const verticalFadeColor = (hex: string, topRatio: number = 1, bottomRatio: number = 0) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const startOpacity = topRatio;
    const endOpacity = bottomRatio;
    //const opacityDiff = startOpacity - endOpacity;

    return new echarts.graphic.LinearGradient(
      0, 0, 0, 1,
      [
        { offset: 0, color: `rgba(${r},${g},${b},${startOpacity})` },    // 顶部不透明
        //{ offset: 0.3, color: `rgba(${r},${g},${b},${endOpacity + opacityDiff * 0.6})` },
        //{ offset: 0.58, color: `rgba(${r},${g},${b},${endOpacity + opacityDiff * 0.4})` },
        { offset: endOpacity === 0 ? 0.88 : 1, color: `rgba(${r},${g},${b},${endOpacity})` },    // 底部透明
      ]
    );
  }

  // 获取柱体
  function getSeriesOption(legendSelected?: Record<string, boolean>): any[] {
    const seriesOption: any[] = [];

    const categoryCount = dataX.length;
    let cumulativeData = new Array(categoryCount).fill(0);

    const colorIndexes: number[] = [];

    const visibleLayers = dataY.filter((layer, idx) => {
      if (!legendSelected) {
        colorIndexes.push(idx);
        return true;
      }
      const layerSelected = legendSelected[layer.name] !== false;
      if (layerSelected) {
        colorIndexes.push(idx);
      }
      return layerSelected;
    });

    visibleLayers.forEach((layer, layerIdx) => {
      const layerColor = getLayerColor(colorIndexes[layerIdx]);
      const layerData = layer.data;

      const startVals = [...cumulativeData];

      layerData.forEach((val, idx) => {
        cumulativeData[idx] += val;
      });

      const endVals = [...cumulativeData];

      seriesOption.push({
        type: 'custom',
        name: layer.name,
        data: layerData,
        z: 10 + layerIdx,
        itemStyle: { color: layerColor },
        tooltip: {
          //鼠标移入图上数值显示格式
          valueFormatter: (value: any) => FaUtils.tryToFixedNum(value, 1) + (unit ? ` ${unit}` : ''),
        },
        renderItem: (params: echarts.CustomSeriesRenderItemParams, api: echarts.CustomSeriesRenderItemAPI): CustomGraphicGroup => {
          const dataIdx = params.dataIndex as number;

          // 堆叠柱段底部对应数值
          const startVal = startVals[dataIdx];
          // 堆叠柱段顶部对应数值
          const endVal = endVals[dataIdx];
          // 堆叠柱总高度
          const totalVal = cumulativeData[dataIdx];

          // 对应坐标
          const startLoc = api.coord([dataIdx, startVal]);
          const endLoc = api.coord([dataIdx, endVal]);

          const shape = {
            api,
            xValue: dataIdx,
            yValue: endVal,
            x: endLoc[0],
            y: endLoc[1],
            xAxisPoint: startLoc
          };

          // 柱体下半部分逐渐透明
          const startRatio = totalVal > 0 ? startVal / (totalVal * 0.6) : 0;
          const endRatio = totalVal > 0 ? endVal / (totalVal * 0.6) : 0;

          const leftFill = verticalFadeColor(layerColor, endRatio, startRatio);
          const rightFill = verticalFadeColor(layerColor, endRatio, startRatio);
          
          const topFill = layerColor;
          const topFillOpacity = endRatio === 0 ? 1 : endRatio;

          return {
            type: 'group',
            children: [
              // 左侧面
              {
                type: 'CubeLeft',
                shape: shape,
                style: {
                  fill: leftFill,
                  opacity: themeDark ? 0.88 : 1 // 最暗
                }
              },
              // 右侧面
              {
                type: 'CubeRight',
                shape: shape,
                style: {
                  fill: rightFill,
                  opacity: themeDark ? 0.95: 0.85
                }
              },
              // 顶面
              {
                type: 'CubeTop',
                shape: shape,
                style: {
                  fill: topFill,
                  opacity: startVal === endVal ? 0 : (themeDark ? topFillOpacity : 0.5 * topFillOpacity) // 最亮; 数值为0时不显示顶面
                }
              }
            ]
          };
        }
      } as any);
    });

    // 加入数据总和
    seriesOption.push(
      {
        type: 'custom',
        name: '总计',
        data: cumulativeData,
        z: 9,
        itemStyle: { color: 'transparent' },
        tooltip: {
          //鼠标移入图上数值显示格式
          valueFormatter: (value: any) => FaUtils.tryToFixedNum(value, 1) + (unit ? ` ${unit}` : ''),
        },
        renderItem: (params: echarts.CustomSeriesRenderItemParams, api: echarts.CustomSeriesRenderItemAPI): CustomGraphicGroup => {
          const dataIdx = params.dataIndex as number;

          const startVal = 0;
          const endVal = cumulativeData[dataIdx];
          const startLoc = api.coord([dataIdx, startVal]);
          const endLoc = api.coord([dataIdx, endVal]);

          const shape = {
            api,
            xValue: dataIdx,
            yValue: endVal,
            x: endLoc[0],
            y: endLoc[1],
            xAxisPoint: startLoc
          };

          // 不显示总和柱体
          const topColor = 'transparent';
          const sumBarColor = topColor;

          return {
            type: 'group',
            children: [
              // 左侧面
              {
                type: 'CubeLeft',
                shape: shape,
                style: {
                  fill: sumBarColor,
                }
              },
              // 右侧面
              {
                type: 'CubeRight',
                shape: shape,
                style: {
                  fill: sumBarColor,
                }
              },
              // 顶面
              {
                type: 'CubeTop',
                shape: shape,
                style: {
                  fill: topColor,
                }
              }
            ]
          };
        },
      } as any
    );

    return seriesOption;
  }

  // 3D柱体部件
  // 偏移参数
  const shift1 = barWidth * 4 / 7;
  const shift2 = barWidth;
  const shiftTop = barWidth * 15 / 14;

  const shiftY = shift1;

  // 定义 3D 立方体的左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
      xAxisPoint: [0, 0]
    },
    buildPath: function (ctx: CanvasRenderingContext2D, shape: any) {
      const yShifted = shape.y + shiftY;
      const xAxisPoint = [shape.xAxisPoint[0], shape.xAxisPoint[1] + shiftY];

      const c0 = [shape.x, yShifted];
      const c1 = [shape.x - shift2, yShifted - shift1];
      const c2 = [xAxisPoint[0] - shift2, xAxisPoint[1] - shift1];
      const c3 = [xAxisPoint[0], xAxisPoint[1]];
      ctx.moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath();
    }
  });

  // 定义 3D 立方体的右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
      xAxisPoint: [0, 0]
    },
    buildPath: function (ctx: CanvasRenderingContext2D, shape: any) {
      const yShifted = shape.y + shiftY;
      const xAxisPoint = [shape.xAxisPoint[0], shape.xAxisPoint[1] + shiftY];

      const c1 = [shape.x, yShifted];
      const c2 = [xAxisPoint[0], xAxisPoint[1]];
      const c3 = [xAxisPoint[0] + shift2, xAxisPoint[1] - shift1];
      const c4 = [shape.x + shift2, yShifted - shift1];
      ctx.moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    }
  });

  // 定义 3D 立方体的顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx: CanvasRenderingContext2D, shape: any) {
      const yShifted = shape.y + shiftY;

      const c1 = [shape.x, yShifted];
      const c2 = [shape.x + shift2, yShifted - shift1];
      const c3 = [shape.x, yShifted - shiftTop];
      const c4 = [shape.x - shift2, yShifted - shift1];
      ctx.moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    }
  });

  // 注册自定义图形
  echarts.graphic.registerShape('CubeLeft', CubeLeft);
  echarts.graphic.registerShape('CubeRight', CubeRight);
  echarts.graphic.registerShape('CubeTop', CubeTop);

  return (
    <div ref={domRef} style={{ position: 'relative', height: '100%', width: '100%', ...style }}>
      <div id={id} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
