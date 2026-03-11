import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Map, { Layer, Marker, Popup, Source, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RDBSource } from 'district-data';
import { useNavigate } from 'react-router-dom';
import MapboxThreeDModel from './components/MapboxThreeDModel';


const VITE_APP_MAPBOX_KEY = import.meta.env.VITE_APP_MAPBOX_KEY;

type factoryInfo = {
  id: number,
  name: string,
  longitude: number,
  latitude: number,
  type: 'WIND' | 'SUN'
};

/**
 * @author xu.pengfei
 * @date 2025-12-24 16:18:33
 */
export default function DatavMapBoxWith3DModelDemo() {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const [countryData, setCountryData] = useState<any>(null);
  const [provinceData, setProvinceData] = useState<any>(null);
  const [factoryArr, setFactoryArr] = useState<factoryInfo[]>([]);
  const [hoverData, setHoverData] = useState<factoryInfo | null>(null);

  useEffect(() => {
    const source = new RDBSource({});
    source.getData({ level: 'country' }).then((data) => {
      setCountryData(data);
    });
    source.getData({ level: 'province' }).then((data) => {
      setProvinceData(data);
    });
  }, []);

  useEffect(() => {
    const facData: factoryInfo[] = [
      { id: 1, name: '风力场站1', longitude: 92.08, latitude: 42.74, type: 'WIND' },
      { id: 6, name: '风力场站2', longitude: 119.5, latitude: 26.5, type: 'WIND' },
      { id: 8, name: '风力场站3', longitude: 118.5, latitude: 25.5, type: 'WIND' },
      { id: 4, name: '光伏电站1', longitude: 93.08, latitude: 40.7, type: 'SUN' },
      { id: 5, name: '光伏电站2', longitude: 94.08, latitude: 39.7, type: 'SUN' },
      { id: 7, name: '光伏电站3', longitude: 115.08, latitude: 28.7, type: 'SUN' },
    ];
    setFactoryArr(facData);
  }, []);

  function handleJumpToFactory(fac: factoryInfo) {
    navigate(`/in/gn/datav/factory/${fac.id}`);
  }

  const handleMarkerClick = useCallback((fac: factoryInfo) => {
    mapRef.current?.flyTo({
      center: [fac.longitude, fac.latitude],
      zoom: 9,
      pitch: 40,
      bearing: -10,
      duration: 1500,
      essential: true,
    });
    setHoverData(fac);
  }, []);

  const threeDModels = useMemo(() => {
    return factoryArr.map((fac) => {
      const modelId = `3d-model-${fac.id}`;
      const modelUrl = fac.type === 'WIND' ? '/file/datavModels/wind_fan.glb' : '/file/datavModels/solar_panel.glb';
      const modelScale = fac.type === 'WIND' ? 8000 : 5000;
      return (
        <MapboxThreeDModel
          key={modelId}
          id={modelId}
          modelUrl={modelUrl}
          coordinates={[fac.longitude, fac.latitude]}
          altitude={0}
          scale={modelScale}
          rotation={[Math.PI / 2, Math.PI / 3, 0]}
        />
      )
    })
  }, [factoryArr])

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={VITE_APP_MAPBOX_KEY}
      initialViewState={{
        longitude: 108,
        latitude: 31,
        zoom: 3.4,
        pitch: 40,
        bearing: -10,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >

      {countryData && (
        <Source id="country-source" type="geojson" data={countryData}>
          <Layer
            id="country-fill"
            type="fill"
            paint={{
              'fill-color': '#001020',
              'fill-opacity': 0.8,
            }}
          />
          <Layer
            id="country-outline"
            type="line"
            paint={{
              'line-color': '#00f0ff',
              'line-width': 3,
              'line-blur': 2,
              'line-opacity': 1,
            }}
          />
          <Layer
            id="country-glow"
            type="line"
            paint={{
              'line-color': '#00f0ff',
              'line-width': 8,
              'line-blur': 8,
              'line-opacity': 0.4,
            }}
          />
        </Source>
      )}

      {provinceData && (
        <Source id="province-source" type="geojson" data={provinceData}>
          <Layer
            id="province-outline"
            type="line"
            paint={{
              'line-color': 'rgba(0, 240, 255, 0.3)',
              'line-width': 1,
              'line-dasharray': [2, 4],
            }}
          />
          <Layer
            id="province-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': 12,
              'text-offset': [0, 0],
              'text-anchor': 'center',
            }}
            paint={{
              'text-color': 'rgba(255, 255, 255, 0.6)',
              'text-halo-color': '#000',
              'text-halo-width': 1,
            }}
          />
        </Source>
      )}

      {threeDModels}

      {factoryArr.map((fac) => {
        let icon = '/file/image/datav/map/icon1.png';
        if (fac.type === 'SUN') {
          icon = '/file/image/datav/map/icon2.png';
        }
        return (
          <Marker
            key={fac.id}
            longitude={fac.longitude}
            latitude={fac.latitude}
            anchor="bottom"
            onClick={() => handleMarkerClick(fac)}
          >
            <div style={{ position: 'relative' }}>
              <img src={icon} style={{ width: 17, height: 25, cursor: 'pointer', position: 'relative', zIndex: 2 }} alt={fac.name} />
            </div>
          </Marker>
        )
      })}

      {hoverData && (
        <Popup
          longitude={hoverData.longitude}
          latitude={hoverData.latitude}
          anchor="top"
          onClose={() => setHoverData(null)}
          closeButton={true}
          closeOnClick={false}
          className="fa-datav-map-popup"
        >
          <div style={{ padding: '10px', minWidth: '150px' }}>
            <a
              onClick={() => handleJumpToFactory(hoverData)}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <h4 style={{ margin: '0 0 8px 0' }}>{hoverData.name}</h4>
            </a>
            <p style={{ margin: '0', fontSize: '12px' }}>
              经度: {hoverData.longitude.toFixed(2)}
            </p>
            <p style={{ margin: '0', fontSize: '12px' }}>
              纬度: {hoverData.latitude.toFixed(2)}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}