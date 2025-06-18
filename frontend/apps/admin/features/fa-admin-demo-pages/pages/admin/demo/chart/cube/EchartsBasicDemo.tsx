import React, {useEffect} from 'react';
import * as echarts from "echarts";

/**
 * @author xu.pengfei
 * @date 2023/4/23 11:37
 */
export default function EchartsBasicDemo() {

  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('echarts-demo1')!);
    // 绘制图表
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
          label: {
            show: true,
            position: 'top',
            formatter: (params:any) => params.value + '%' //图上数值显示格式
          },
          tooltip: { //鼠标移入图上数值显示格式
            valueFormatter: (value:any) => value + ' %'
          },
        }
      ]
    });
  }, [])

  return (
    <div id="echarts-demo1" style={{width: 500, height: 300}} />
  )
}
