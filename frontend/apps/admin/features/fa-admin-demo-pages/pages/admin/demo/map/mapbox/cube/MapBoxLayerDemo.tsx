import React from 'react';
import Map, {Source, Layer, CircleLayerSpecification} from 'react-map-gl/mapbox';
import type {FeatureCollection} from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';


const VITE_APP_MAPBOX_KEY = import.meta.env.VITE_APP_MAPBOX_KEY;

const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.4, 37.8]
      },
      properties: {title: '915 Front Street, San Francisco, California'}
    }
  ]
};

const layerStyle: CircleLayerSpecification = {
  id: 'point',
  type: 'circle',
  source: 'my-data',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
};

/**
 * @author xu.pengfei
 * @date 2025-12-24 11:17:34
 */
export default function MapBoxLayerDemo() {
  return (
    <Map
      mapboxAccessToken={VITE_APP_MAPBOX_KEY}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 600, height: 300 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
    </Map>
  );
}
