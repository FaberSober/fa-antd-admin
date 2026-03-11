import React from 'react';
import {EchartsBase} from "@features/fa-admin-pages/components";

/**
 * @author xu.pengfei
 * @date 2023/4/23 15:23
 */
export default function EchartsSimpleDemo() {
  return (
    <EchartsBase
      option={{
        grid: {top: 8, right: 8, bottom: 24, left: 36},
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      }}
      style={{width: 500, height: 300}}
    />
  )
}
