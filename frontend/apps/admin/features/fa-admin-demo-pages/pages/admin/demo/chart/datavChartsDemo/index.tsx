import { Card } from 'antd';
import React, { useState, useEffect } from 'react';
import DatavChinaMapDemo from './cube/map/DatavChinaMapDemo';
import DatavBarChartDemo from './cube/chart/DatavBarChartDemo';
import DatavLineChartDemo from './cube/chart/DatavLineChartDemo';
import DatavRingChartDemo from './cube/chart/DatavRingChartDemo';
import DatavChinaMapAMapDemo from './cube/map/DatavChinaMapAMapDemo';
import DatavMapBoxDemo from './cube/map/DatavMapBoxDemo';
import DatavMapBoxWith3DModelDemo from './cube/map/DatavMapBoxWith3DModelDemo';

/**
 * @author xu.pengfei
 * @date 2025-12-17 10:06:08
 */
export default function DatavChartsDemo() {
  const [data, setData] = useState<{ name: string, value: number }[]>([]);

  useEffect(() => {
    const mockData = [
      { name: '设备1', value: 10 },
      { name: '设备2', value: 20 },
      { name: '设备3', value: 30 },
      { name: '设备4', value: 40 },
      { name: '设备5', value: 50 },
    ];
    setData(mockData);
  }, []);

  return (
    <div className="fa-full-content-p12">
      <Card title="柱状图" className="fa-mb12">
        <div style={{ width: 800, height: 300 }}>
          <DatavBarChartDemo />
        </div>
      </Card>
      <Card title="折线图" className="fa-mb12">
        <div style={{ width: 800, height: 300 }}>
          <DatavLineChartDemo />
        </div>
      </Card>
      <Card title="环状图" className="fa-mb12">
        <div style={{ width: 800, height: 300 }}>
          <DatavRingChartDemo data={data} />
        </div>
      </Card>
      <Card title="地图" className="fa-mb12">
        <div style={{ width: 800, height: 400 }}>
          <DatavChinaMapDemo />
        </div>
      </Card>
      <Card title="地图" className="fa-mb12">
        <div style={{ width: 800, height: 400 }}>
          <DatavChinaMapAMapDemo />
        </div>
      </Card>
      <Card title="地图" className="fa-mb12">
        <div style={{ width: 800, height: 400 }}>
          <DatavMapBoxDemo />
        </div>
      </Card>
      <Card title="地图（含3D模型）" className="fa-mb12">
        <div style={{ width: 800, height: 400 }}>
          <DatavMapBoxWith3DModelDemo />
        </div>
      </Card>
    </div>
  );
}
