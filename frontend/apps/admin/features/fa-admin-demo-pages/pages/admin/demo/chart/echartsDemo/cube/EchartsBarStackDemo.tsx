import React from 'react';
import { EchartsBase } from "@features/fa-admin-pages/components";

/**
 * @author xu.pengfei
 * @date 2023/12/4 16:06
 */
export default function EchartsBarStackDemo() {
  return (
    <EchartsBase
      option={{
        color: ['#1790FF', '#4ECB75'],
        title: {
          show: false,
        },
        textStyle: {
          color: '#fff'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          bottom: '0',
          textStyle: {
            color: '#FFF',
          },
        },
        xAxis: {
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {},
        series: [
          {
            name: '计划产量',
            type: 'bar',
            data: [25, 20, 26, 10, 10, 20, 5, 20, 36, 10, 10, 20],
            barWidth: 15,
            // z:"-1",
            barGap: '-100%',
          },
          {
            name: '实际产量',
            type: 'bar',
            data: [15, 10, 36, 20, 11, 10, 15, 10, 26, 20, 14, 30],
            barWidth: 15,
          },
        ]
      }}
      style={{width: 500, height: 300}}
    />
  )
}
