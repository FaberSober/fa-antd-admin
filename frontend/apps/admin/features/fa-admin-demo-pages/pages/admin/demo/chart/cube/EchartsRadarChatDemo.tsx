import React from 'react';
import { EchartsBase } from "@features/fa-admin-pages/components";

/**
 * @author xu.pengfei
 * @date 2025/6/16 10:36
 */
export default function EchartsRadarChatDemo() {
  return (
    <EchartsBase
      option={{
        title: {
          text: '雷达图'
        },
        legend: {
          data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      }}
      style={{width: 500, height: 300}}
    />
  )
}
