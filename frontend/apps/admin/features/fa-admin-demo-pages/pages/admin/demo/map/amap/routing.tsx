import { APILoader } from '@uiw/react-amap';
import React from 'react';
import { Outlet } from "react-router-dom";

const VITE_APP_AMAP_KEY = import.meta.env.VITE_APP_AMAP_KEY;

/**
 * @author xu.pengfei
 * @date 2025/4/27 11:14
 */
export default function routing() {
  return (
    <APILoader version="2.0" akey={VITE_APP_AMAP_KEY} plugins={['AMap.ToolBar', 'AMap.Driving', 'AMap.TruckDriving', 'AMap.DragRoute', 'AMap.PlaceSearch']}>
      <Outlet />
    </APILoader>
  )
}
