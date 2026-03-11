import { LineLayer, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import { RDBSource } from 'district-data';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const source = new RDBSource({
  version: '2024',
  type: 'gcj02', // 默认
});

const getFactoryTypeColor = (type: string) => {
  switch (type) {
    case 'WIND':
      return 'rgb(255,255,255)';
    case 'SUN':
      return 'rgb(57,255,20)';
    default:
      return 'rgb(57,255,20)';
  }
}


/**
 * 全局场站地图
 * 参考：https://l7.antv.antgroup.com/examples/gallery/animate/#3d_base_map
 * @author xu.pengfei
 * @date 2025-12-12 11:17:03
 */
export default function DatavChinaMapDemo() {
  const navigate = useNavigate()
  const sceneRef = React.useRef<Scene>();
  const layersRef = React.useRef<any>({});
  const [hoverData, setHoverData] = useState<any>();
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [factoryArr, setFactoryArr] = useState<any[]>([
    {
      id: 1,
      name: '风电场站A',
      type: 'WIND',
      longitude: 120.130663,
      latitude: 30.240018,
    },
    {
      id: 2,
      name: '光伏场站B',
      type: 'SUN',
      longitude: 116.407395,
      latitude: 39.904211,
    }
  ]);


  useEffect(() => {
    sceneRef.current = new Scene({
      id: 'map',
      map: new Map({
        center: [111.4453125, 32.84267363195431],
        pitch: 35,
        zoom: 5,
        rotateEnable: false,
      }),
      logoVisible: false, // 隐藏左下角 AntV L7 的 Logo/图标
    });

    const scene = sceneRef.current;
    scene.addImage('00', '/public/file/image/datav/map/0.png');
    scene.addImage( '01', '/public/file/image/datav/map/1.png');
    scene.addImage('02', '/public/file/image/datav/map/2.png');
    scene.setBgColor('#131722');

    scene.on('loaded', () => {
      const map = document.getElementById('map')!;
      map.style.background = '#131722';

      source.getData({ level: 'province', precision: 'low' }).then((data) => {
        const newFeatures = data.features.filter((item) => {
          return item.properties.name;
        });
        const newData = {
          type: 'FeatureCollection',
          features: newFeatures,
        };
        // 省份边界
        const lineDown = new LineLayer({
          zIndex: 10,
        })
          .source(newData)
          .shape('line')
          .color('#989494')
          .size(0.6)
          .style({
            raisingHeight: 650000,
            opacity: 0.8,
          });

        scene.addLayer(lineDown);
        return '';
      });

      source.getData({ level: 'country', precision: 'low' }).then((data) => {
        // 中国地图填充面
        const provincelayer = new PolygonLayer({
          autoFit: true,
        })
          .source(data)
          .size(650000)
          .shape('extrude')
          .color('#5886CF')
          .style({
            heightfixed: true,
            pickLight: true,
            opacity: 0.8,
          });
        // 国界线 九段线
        const boundaryLine = new LineLayer({ zIndex: 10 })
          .source(data)
          .shape('line')
          .color('#5DDDFF')
          .size(1)
          .style({
            raisingHeight: 650000,
          });

        scene.addLayer(boundaryLine);
        scene.addLayer(provincelayer);
        return '';
      });
      const pointLayer = new PointLayer({
        depth: false,
        zIndex: 11,
        // heightFixed: true,
      })
        .source(factoryArr, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('cylinder')
        .size([4, 4, 90])
        .active(true)
        .color('type', getFactoryTypeColor)
        .style({
          opacity: 1,
          opacityLinear: {
            enable: true, // true - false
            dir: 'up', // up - down
          },
          lightEnable: false,
          raisingHeight: 10, // 抬升高度
        });
      pointLayer.on('mousemove', (e: any) => {
        // console.log('pointLayer mousemove', e, hoverData)
        const data = e.feature;
        if (data) {
          // if (hoverData && hoverData.id === data.id) return;
          setHoverData(data);
          setHoverPosition({ x: e.target.clientX || 0, y: e.target.clientY || 0 });
        }
      });
      pointLayer.on('mouseout', () => {
        setHoverData(undefined);
      });
      pointLayer.on('click', (e: any) => {
        console.log('pointLayer click', e)
        if (e.feature?.id) {
          // jump to spacific factory datav page
          navigate(`/in/gn/datav/factory/${e.feature?.id}`)
        }
      })

      const pointLayer2 = new PointLayer({ depth: false, zIndex: 10 })
        .source(factoryArr, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('circle')
        .active(true)
        .animate(true)
        .size(40)
        .color('type', getFactoryTypeColor)
        .style({
          raisingHeight: 10, // 抬升高度
          opacity: 1,
          textAllowOverlap: true,
        });

      const textLayer = new PointLayer({ zIndex: 2 })
        .source(factoryArr, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('name', 'text')
        .size(14)
        .color('#0ff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#0ff', // 描边颜色
          strokeWidth: 0.2, // 描边宽度
          raisingHeight: 2551000,
          textAllowOverlap: true,
          heightFixed: true,
        });
      const imageLayer = new PointLayer({ zIndex: 15 })
        .source(factoryArr, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('text', ['00', '01', '02'])
        .size(10)
        .style({
          raisingHeight: 110,
        });

      scene.addLayer(textLayer);
      scene.addLayer(imageLayer);
      scene.addLayer(pointLayer);
      scene.addLayer(pointLayer2);

      // 保存图层引用，便于后续更新
      layersRef.current = { pointLayer, pointLayer2, textLayer, imageLayer };

      // 在场景级别添加鼠标离开事件处理
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.addEventListener('mouseleave', () => {
          setHoverData(undefined);
        });
      }
      return '';
    });
    return () => {
      if (sceneRef.current) {
        sceneRef.current.destroy();
      }
    }
  }, []);

  // 当工厂数据改变时，更新地图图层数据
  useEffect(() => {
    if (!sceneRef.current || factoryArr.length === 0) return;

    const { pointLayer, pointLayer2, textLayer, imageLayer } = layersRef.current;

    // 重新设置数据源
    if (pointLayer) {
      pointLayer.setData(factoryArr);
    }
    if (pointLayer2) {
      pointLayer2.setData(factoryArr);
    }
    if (textLayer) {
      textLayer.setData(factoryArr);
    }
    if (imageLayer) {
      imageLayer.setData(factoryArr);
    }
  }, [factoryArr]);

  return (
    <div className='fa-full fa-relative'>
      <div id="map" className='fa-full' />
      {hoverData && (
        <div
          style={{
            position: 'fixed',
            left: `${hoverPosition.x + 10}px`,
            top: `${hoverPosition.y + 10}px`,
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#0ff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '16px',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            border: '1px solid #0ff',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: 20 }}><strong>{hoverData.name}</strong></div>
          <div>场站类型：{hoverData.address}</div>
          <div>装机容量：{hoverData.address}</div>
          <div>并网时间：{hoverData.address}</div>
          <div>隶属区域：{hoverData.address}</div>
          <div>地形地貌：{hoverData.address}</div>
        </div>
      )}
    </div>
  );
}
