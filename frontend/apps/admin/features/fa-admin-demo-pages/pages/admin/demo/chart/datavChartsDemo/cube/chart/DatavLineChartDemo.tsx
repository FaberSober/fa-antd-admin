import { EchartsLine } from '@features/fa-admin-pages/components';

// Line颜色
const DEFAULT_COLORS = [
  '#0091EA',
  '#1ee9ffff',
  '#70ce41ff',
  '#E6A23C',
  '#F56C6C',
];

export default function DatavLineChartDemo() {
  const title = '场站年均发电小时数';
  const unit = '小时';
  const dataX = ['2020', '2021', '2022', '2023', '2024'];
  const dataY = [
    {
      name: '场站A',
      data: [1048, 735, 580, 320, 300]
    },
    {
      name: '场站B',
      data: [400, 735, 50, 32, 0]
    },
    {
      name: '场站C',
      data: [200, 140, 120, 320, 1000]
    },
  ];

  // 获取line颜色
  const getColor = (idx: number) => {
    return DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
  }

  // 调整颜色透明度
  const changeOpcacity = (color: string, opacity: number) => {
    // 如果是 hex 颜色 (#RGB 或 #RRGGBB)
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // 如果是 rgb/rgba 格式
    if (color.startsWith('rgb')) {
      return color.replace(/rgba?\(([^)]+)\)/, (match, inner) => {
        const parts = inner.split(',').map(s => s.trim());
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
      });
    }

    return color;
  };

  return (
    <EchartsLine
      title={title}
      dataX={dataX}
      dataY={dataY}
      restOption={{
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true,
        },
        legend: {
          right: 30,
          top: 24,
          data: dataY.map((dy) => ({
            name: dy.name,
          }))
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          name: unit,
          type: 'value',
        },
        series: dataY.map((dy, idx) => ({
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
          showSymbol: false,
          itemStyle: { color: getColor(idx) },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0,
              x2: 0, y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: changeOpcacity(getColor(idx), 0.3)
                },
                {
                  offset: 1,
                  color: changeOpcacity(getColor(idx), 0.05)
                }
              ]
            }
          },
        })),
      }}
      style={{ height: '100%' }}
    />
  )
}