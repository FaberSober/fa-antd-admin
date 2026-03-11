import React, { useEffect } from 'react';
import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { RDBSource } from 'district-data';


/**
 * @author xu.pengfei
 * @date 2025-12-24 10:12:07
 */
export default function DatavChinaMapAMapDemo() {
  useEffect(() => {
    const scene = new Scene({
      id: 'map1',
      map: new GaodeMap({
        center: [121.4, 31.258134],
        zoom: 2,
        pitch: 0,
        style: 'normal',
        doubleClickZoom: false,
      }),
    });

    const source = new RDBSource({});
    source.getData({ level: 'province' }).then((data) => {
      const fill = new PolygonLayer({
        autoFit: true,
      })
        .source(data)
        .shape('fill')
        .color('name', [
          '#a6cee3',
          '#1f78b4',
          '#b2df8a',
          '#33a02c',
          '#fb9a99',
          '#e31a1c',
          '#fdbf6f',
          '#ff7f00',
          '#cab2d6',
          '#6a3d9a',
          '#ffff99',
          '#b15928',
        ])
        .active(false);
      scene.addLayer(fill);
    });
  }, []);

  return (
    <div
      id="map1"
      style={{
        height: '400px',
        position: 'relative',
      }}
    />
  );
}
