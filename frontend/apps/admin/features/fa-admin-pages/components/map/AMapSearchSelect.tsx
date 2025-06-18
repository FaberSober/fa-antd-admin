import React, { type CSSProperties, useEffect, useState } from 'react';
import { Map, Marker, MapTypeControl } from '@uiw/react-amap';
import type { Fa } from '@/types';
import useAMapGeocoder from './useAMapGeocoder';
import AMapAutoComplete from './AMapAutoComplete';

export interface AMapSearchSelectProps {
  onSelect?: (lnglat: Fa.LngLat, address?: string) => void;
  value?: Fa.LngLat;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2023/4/21 15:08
 */
export default function AMapSearchSelect({ onSelect, value, style }: AMapSearchSelectProps) {
  const [pos, setPos] = useState<Fa.LngLat>();
  const [address, setAddress] = useState<string>('');

  const { posToAddress } = useAMapGeocoder();

  useEffect(() => {
    if (value) {
      setPos(value);
      posToAddress(value, (v) => setAddress(v.address));
    }
  }, []);

  function handleClickPos(newPos: Fa.LngLat) {
    setPos(newPos);
    posToAddress(newPos, (v) => setAddress(v.address));
    if (onSelect) {
      onSelect(newPos);
    }
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* @ts-ignore */}
      <Map
        // style={{height: 200, width: 600}}
        onClick={(event) => {
          console.log('点击事件！', event);
          handleClickPos({ lng: event.lnglat.lng!, lat: event.lnglat.lat! });
        }}
        center={pos ? [pos.lng, pos.lat] : undefined}
      >
        <MapTypeControl />
        {pos && <Marker position={new AMap.LngLat(pos.lng, pos.lat)} />}
      </Map>

      <AMapAutoComplete
        style={{ position: 'absolute', right: 0, top: 0, width: 200, lineHeight: '24px' }}
        onSelect={(lnglat) => {
          handleClickPos(lnglat);
        }}
      />

      {address ? (
        <div style={{ lineHeight: '24px', top: 0, left: 0, right: 200, position: 'absolute', padding: 4, backgroundColor: '#ddd' }}>{address}</div>
      ) : null}
    </div>
  );
}
