import React from 'react';
import {Card} from "antd";
import { EchartsBar, EchartsPie, EchartsLine, EchartsGauge, EchartsGaugeStep } from "@/components";
import EchartsDynamicDemo from "./cube/EchartsDynamicDemo";
import EchartsBasicDemo from "./cube/EchartsBasicDemo";
import EchartsSimpleDemo from "./cube/EchartsSimpleDemo";
import EchartsBarStackDemo from "./cube/EchartsBarStackDemo";
import EchartsWeatherHourDemo from "./cube/EchartsWeatherHourDemo";
import EchartsWeather7DayDemo from "./cube/EchartsWeather7DayDemo";
import EchartsRadarChatDemo from "./cube/EchartsRadarChatDemo";


/**
 * @author xu.pengfei
 * @date 2023/2/2 09:36
 */
export default function echartsDemo() {

  return (
    <div className="fa-full-content fa-p12">
      <Card title="ECharts 天气预报-逐小时" className="fa-mb12">
        <EchartsWeatherHourDemo />
      </Card>

      <Card title="ECharts 天气预报-未来7天" className="fa-mb12">
        <EchartsWeather7DayDemo />
      </Card>

      <Card title="ECharts 入门示例" className="fa-mb12">
        <EchartsBasicDemo/>
      </Card>

      <Card title="ECharts 封装示例" className="fa-mb12" styles={{body: {display: 'flex', flexWrap: "wrap"}}}>
        <EchartsBar
          title="Bar"
          subTitle="Bar Chart"
          data={[
            {value: 1048, name: 'Search Engine'},
            {value: 735, name: 'Direct'},
            {value: 580, name: 'Email'},
            {value: 484, name: 'Union Ads'},
            {value: 300, name: 'Video Ads'}
          ]}
          dataTitle="销量"
          style={{width: 500, height: 300}}
          barSeriesOption={{
            barWidth: 30,
          }}
        />

        <EchartsLine
          dataX={["一", "二", "三", "四", "五", "六", "七"]}
          dataY={[
            {
              name: '指标1',
              data: [4,5,4,5,4,5,6],
            }
          ]}
          style={{width: 500, height: 300}}
        />

        <EchartsPie
          title="Pie"
          subTitle="Pie Chart"
          data={[
            {value: 1048, name: 'Search Engine'},
            {value: 735, name: 'Direct'},
            {value: 580, name: 'Email'},
            {value: 484, name: 'Union Ads'},
            {value: 300, name: 'Video Ads'}
          ]}
          dataTitle="销量"
          style={{width: 500, height: 300}}
        />

        <EchartsGauge
          min={0}
          max={100}
          value={80}
          unit="%"
          style={{width: 500, height: 300}}
        />

        <EchartsGaugeStep
          min={0}
          max={100}
          value={70}
          unit="%"
          style={{width: 500, height: 300}}
        />

        <EchartsRadarChatDemo />
      </Card>

      <Card title="ECharts 柱状图（叠加）" className="fa-mb12">
        <EchartsSimpleDemo />
      </Card>

      <Card title="ECharts 折线图" className="fa-mb12">
        <EchartsBarStackDemo />
      </Card>

      <Card title="ECharts 动态表格" className="fa-mb12">
        <EchartsDynamicDemo/>
      </Card>

    </div>
  )
}
