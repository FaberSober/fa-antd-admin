import React from 'react';
import Map from 'react-map-gl/mapbox';
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';


const VITE_APP_MAPBOX_KEY = import.meta.env.VITE_APP_MAPBOX_KEY;

/**
 * @author xu.pengfei
 * @date 2025-12-24 11:17:34
 */
export default function MapBoxBasicDemo() {
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
    />
  );
}
