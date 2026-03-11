import { Card } from 'antd';
import React from 'react';
import MapBoxBasicDemo from './cube/MapBoxBasicDemo';
import MapBoxControlDemo from './cube/MapBoxControlDemo';
import MapBoxCustomCameraDemo from './cube/MapBoxCustomCameraDemo';
import MapBoxLayerDemo from './cube/MapBoxLayerDemo';

/**
 * @author xu.pengfei
 * @date 2025-12-24 11:16:18
 */
export default function MapBoxDemoPage() {
  return (
    <div className="fa-full-content fa-p12 fa-scroll-auto-y">
      <Card title="基础地图展示" className="fa-mb12">
        <MapBoxBasicDemo />
      </Card>

      <Card title="受控地图展示" className="fa-mb12">
        <MapBoxControlDemo />
      </Card>

      <Card title="地图-Custom Camera Constraints" className="fa-mb12">
        <MapBoxCustomCameraDemo />
      </Card>

      <Card title="地图-Adding Custom Data" className="fa-mb12">
        <MapBoxLayerDemo />
      </Card>

    </div>
  );
}
