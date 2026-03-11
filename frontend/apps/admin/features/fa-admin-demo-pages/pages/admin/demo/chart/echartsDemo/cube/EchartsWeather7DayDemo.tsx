import React from 'react';
import { EchartsBase } from "@features/fa-admin-pages/components";

/**
 * 天气预报-未来7天
 * @author xu.pengfei
 * @date 2024/11/21 10:35
 */
export default function EchartsWeather7DayDemo() {
  const dataArr = [
    { time: '01日', tempHigh: '16.3', tempLow: '13.4', weatherName: '晴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '02日', tempHigh: '16.2', tempLow: '13.5', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '03日', tempHigh: '17.6', tempLow: '13.5', weatherName: '多云', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '04日', tempHigh: '14.2', tempLow: '12.5', weatherName: '小雨', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '05日', tempHigh: '17.6', tempLow: '12.5', weatherName: '中雨', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '06日', tempHigh: '17.6', tempLow: '12.4', weatherName: '大雨', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '07日', tempHigh: '13.6', tempLow: '9.4', weatherName: '强对流', windSpeed: '3-4级', windDirection: '西北风' },
  ]
  const timeArr = dataArr.map(i => i.time)
  const tempHigh = dataArr.map(i => i.tempHigh)
  const tempLow = dataArr.map(i => i.tempLow)
  const weatherName = dataArr.map(i => i.weatherName)
  const windSpeed = dataArr.map(i => i.windSpeed)
  const windDirection = dataArr.map(i => i.windDirection)

  const weatherIcon:any = {}
  for (let i = 0; i < weatherName.length; i++) {
    weatherIcon[i] = {
      backgroundColor: {
        image: (() => {
          const weather = weatherName[i]; // 根据图片序号获取对应的天气数据
          return `/file/image/icon/weather/normal/${weather}.png`;
        })(),
      },
      height: 24,
      width: 24,
    }
  }

  return (
    <div className="fa-full" style={{padding: 8}}>
      <div className="fa-scroll-auto-x fa-full">
        <EchartsBase
          option={{
            grid: {
              show: true,
              backgroundColor: 'transparent',
              borderWidth: 0,
              top: '180',
              bottom: '0',
              left: '20',
              right: '20',
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                lineStyle: {
                  color: 'transparent',
                },
              },
            },
            legend: {
              show: false,
            },
            xAxis: [
              // 时间：08-09
              {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                offset: 140,
                zlevel: 100,
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  interval: 0,
                  formatter: ['{a|{value}}'].join('\n'),
                  rich: {
                    a: {
                      // color: 'white',
                      fontSize: 12,
                    },
                  },
                },
                nameTextStyle: {},
                data: timeArr,
              },
              // 最高气温
              {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                offset: 30,
                zlevel: 100,
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  interval: 0,
                  formatter: ['{a|{value}}°'].join('\n'),
                  rich: {
                    a: {
                      // color: 'white',
                      fontSize: 12,
                    },
                  },
                },
                nameTextStyle: {},
                data: tempHigh,
              },
              // 最低气温
              {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                offset: -110,
                zlevel: 100,
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  interval: 0,
                  formatter: ['{a|{value}}°'].join('\n'),
                  rich: {
                    a: {
                      // color: 'white',
                      fontSize: 12,
                    },
                  },
                },
                nameTextStyle: {},
                data: tempLow,
              },
              // 天气图标
              {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                offset: 60,
                zlevel: 100,
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  interval: 0,
                  formatter: (value, index) => '{' + index + '| }\n{b|' + value + '}',
                  rich: {
                    // 0: {
                    //   backgroundColor: {
                    //     image: (() => {
                    //       const index = 0; // 图片序号
                    //       const weather = weatherName[index]; // 根据图片序号获取对应的天气数据
                    //       return '/file/image/icon/0.png';
                    //     })(),
                    //   },
                    //   height: 24,
                    //   width: 24,
                    // },
                    ...weatherIcon,
                    b: {
                      // color: 'white',
                      fontSize: 12,
                      lineHeight: 30,
                      height: 20,
                    },
                  },
                },
                nameTextStyle: {
                  fontWeight: 'bold',
                  fontSize: 19,
                },
                data: weatherName,
              },
              // 风向
              {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                offset: -140,
                zlevel: 100,
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  interval: 0,
                  formatter: ['{a|{value}}'].join('\n'),
                  rich: {
                    a: {
                      // color: 'white',
                      fontSize: 12,
                    },
                  },
                },
                nameTextStyle: {},
                data: windDirection,
              },
              // 风力
              {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                offset: -170,
                zlevel: 100,
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  interval: 0,
                  formatter: ['{a|{value}}'].join('\n'),
                  rich: {
                    a: {
                      // color: 'white',
                      fontSize: 12,
                    },
                  },
                },
                nameTextStyle: {},
                data: windSpeed,
              },
            ],
            yAxis: {
              type: 'value',
              show: false,
              axisLabel: {
                formatter: '{value} °C',
                color: 'white',
              },
            },
            series: [
              // 最高气温
              {
                name: '最高气温',
                type: 'line',
                data: tempHigh,
                symbol: 'none',
                symbolSize: 1,
                showSymbol: true,
                smooth: true,
                itemStyle: {
                  color: '#FFA033',
                },
                label: {
                  show: true,
                  position: 'top',
                  // offset: 10, // 设置标签相对于数据点的偏移量
                  // color: 'white',
                  formatter: '{c} °C',
                },
                lineStyle: {
                  width: 3,
                  color: '#FFA033',
                  // normal: {
                  //   color: "#4c9bfd",

                  //   shadowBlur: 10, // 阴影模糊度
                  //   shadowColor: "rgba(76, 155, 253, 0.3)", // 阴影颜色
                  // },
                },
                areaStyle: {
                  opacity: 1,
                  color: 'transparent',
                },
              },
              // 最低气温
              {
                name: '最低气温',
                type: 'line',
                data: tempLow,
                symbol: 'none',
                symbolSize: 1,
                showSymbol: true,
                smooth: true,
                itemStyle: {
                  color: '#5CADFF',
                  // normal: {
                  //   color: "#5CADFF",
                  // },
                },
                label: {
                  show: true,
                  position: 'bottom',
                  // color: 'white',
                  formatter: '{c} °C',
                },
                lineStyle: {
                  width: 3,
                  color: '#5CADFF',
                },
                areaStyle: {
                  opacity: 1,
                  color: 'transparent',
                },
              },
            ],
          }}
          style={{ width: 500, height: 350 }}
        />
      </div>
    </div>
  );
}
