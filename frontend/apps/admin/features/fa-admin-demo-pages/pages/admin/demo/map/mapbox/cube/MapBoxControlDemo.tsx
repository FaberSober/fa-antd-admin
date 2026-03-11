import React, { useState } from 'react';
import Map from 'react-map-gl/mapbox';
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';


const VITE_APP_MAPBOX_KEY = import.meta.env.VITE_APP_MAPBOX_KEY;

/**
 * @author xu.pengfei
 * @date 2025-12-24 11:17:34
 */
export default function MapBoxControlDemo() {
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });

  return (
    <Map
      mapboxAccessToken={VITE_APP_MAPBOX_KEY}
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: 600, height: 300 }}
    />
  );
}
