import React from 'react';
import Map, { Layer, Marker, Popup, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RDBSource } from 'district-data';
import { useEffect, useState } from 'react';


const VITE_APP_MAPBOX_KEY = import.meta.env.VITE_APP_MAPBOX_KEY;

/**
 * @author xu.pengfei
 * @date 2025-12-24 16:12:55
 */
export default function DatavMapBoxDemo() {
  const [countryData, setCountryData] = useState<any>(null);
  const [provinceData, setProvinceData] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<{ id: number; name: string; longitude: number; latitude: number } | null>(null);

  const markers = [
    { id: 1, name: '标记1', longitude: 104, latitude: 35 },
    { id: 2, name: '标记2', longitude: 110, latitude: 35 },
  ];

  useEffect(() => {
    const source = new RDBSource({});
    source.getData({ level: 'country' }).then((data) => {
      console.log('country data', data);
      setCountryData(data);
    });
    source.getData({ level: 'province' }).then((data) => {
      console.log('province data', data);
      setProvinceData(data);
    });
  }, []);

  return (
    <Map
      mapboxAccessToken={VITE_APP_MAPBOX_KEY}
      initialViewState={{
        longitude: 104,
        latitude: 35,
        zoom: 3,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      {countryData && (
        <>
          <Source id="country-source" type="geojson" data={countryData}>
            <Layer
              id="country-fill"
              type="fill"
              paint={{
                'fill-color': '#2DF3ED',
                'fill-opacity': 0.1,
              }}
            />
            <Layer
              id="country-outline"
              type="line"
              paint={{
                'line-color': '#2DF3ED',
                'line-width': 2,
              }}
            />
          </Source>
        </>
      )}
      {provinceData && (
        <>
          <Source id="province-source" type="geojson" data={provinceData}>
            {/* <Layer
              id="province-fill"
              type="fill"
              paint={{
                'fill-color': '#088',
                'fill-opacity': 0.2,
              }}
            /> */}
            <Layer
              id="province-outline"
              type="line"
              paint={{
                'line-color': '#2AD6DD',
                'line-width': 0.5,
              }}
            />
            <Layer
              id="province-label"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-size': 10,
                'text-offset': [0, 0],
                'text-allow-overlap': false,
              }}
              paint={{
                'text-color': '#918e8e',
                'text-halo-color': '#000',
                'text-halo-width': 0.8,
              }}
            />
          </Source>
        </>
      )}

      <Marker longitude={104} latitude={35} anchor="bottom" onClick={() => setSelectedMarker(markers[0])}>
        <img src="/file/image/datav/map/icon1.png" style={{ width: 17, height: 25, cursor: 'pointer' }} alt="icon1" />
      </Marker>
      <Marker longitude={110} latitude={35} anchor="bottom" onClick={() => setSelectedMarker(markers[1])}>
        <img src="/file/image/datav/map/icon2.png" style={{ width: 17, height: 25, cursor: 'pointer' }} alt="icon2" />
      </Marker>

      {selectedMarker && (
        <Popup
          longitude={selectedMarker.longitude}
          latitude={selectedMarker.latitude}
          anchor="top"
          onClose={() => setSelectedMarker(null)}
          closeButton={true}
          closeOnClick={false}  // 防止 Popup 内部点击关闭
        >
          <div style={{ padding: '10px', minWidth: '150px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>{selectedMarker.name}</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
              经度: {selectedMarker.longitude.toFixed(2)}
            </p>
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
              纬度: {selectedMarker.latitude.toFixed(2)}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
