import React from 'react';
import { EchartsBase } from "@features/fa-admin-pages/components";

/**
 * 24小时逐小时预报
 * @author xu.pengfei
 * @date 2024/11/21 10:35
 */
export default function EchartsWeatherHourDemo() {
  const dataArr = [
    { time: '08时', temperature: '16.3', weatherName: '晴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '09时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '10时', temperature: '17.6', weatherName: '多云', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '11时', temperature: '14.2', weatherName: '小雨', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '12时', temperature: '17.6', weatherName: '中雨', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '13时', temperature: '17.6', weatherName: '大雨', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '14时', temperature: '15.7', weatherName: '雪天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '15时', temperature: '16.3', weatherName: '强对流', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '16时', temperature: '16.2', weatherName: '晴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '17时', temperature: '17.6', weatherName: '晴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '18时', temperature: '15.7', weatherName: '晴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '19时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '20时', temperature: '17.6', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '21时', temperature: '15.7', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '22时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '23时', temperature: '16.3', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '00时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '01时', temperature: '16.3', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '02时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '03时', temperature: '16.3', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '04时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '05时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '06时', temperature: '16.3', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
    { time: '07时', temperature: '16.2', weatherName: '阴天', windSpeed: '3-4级', windDirection: '西北风' },
  ]
  const timeArr = dataArr.map(i => i.time)
  const temperature = dataArr.map(i => i.temperature)
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
              // 气温
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
                data: temperature,
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
              // 气温
              {
                name: '气温',
                type: 'line',
                data: temperature,
                symbol: 'none',
                symbolSize: 5,
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
            ],
          }}
          style={{ width: 1200, height: 350 }}
        />
      </div>
    </div>
  );
}
