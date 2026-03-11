import React, { useState } from 'react';
import Map from 'react-map-gl/mapbox';
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';

// npm install @turf/turf
import * as turf from '@turf/turf';

// A circle of 5 mile radius of the Empire State Building
const GEOFENCE = turf.circle([-74.0122106, 40.7467898], 5, {units: 'miles'});


const VITE_APP_MAPBOX_KEY = import.meta.env.VITE_APP_MAPBOX_KEY;

/**
 * @author xu.pengfei
 * @date 2025-12-24 11:17:34
 */
export default function MapBoxCustomCameraDemo() {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });

  const onMove = React.useCallback(({viewState}) => {
    console.log('onMove', viewState);
    const newCenter = [viewState.longitude, viewState.latitude];
    // Only update the view state if the center is inside the geofence
    if (turf.booleanPointInPolygon(newCenter, GEOFENCE)) {
      setViewState(viewState);
    }
  }, [])

  return (
    <Map
      mapboxAccessToken={VITE_APP_MAPBOX_KEY}
      {...viewState}
      onMove={onMove}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: 600, height: 300 }}
    />
  );
}
