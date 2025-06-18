import { useEffect, useRef } from 'react';
import type { Fa } from '@/types';

type addressToPosCallback = (lnglat: Fa.LngLat) => void;
type posToAddressCallback = (ret: { address: string }) => void;

/**
 * @author xu.pengfei
 * @date 2023/4/21 15:36
 */
export default function useAMapGeocoder(): {
  addressToPos: (address: string, callback: addressToPosCallback) => void;
  posToAddress: (lnglat: Fa.LngLat, callback: posToAddressCallback) => void;
} {
  const geocoderRef = useRef<any>();

  useEffect(() => {
    AMap.plugin(['AMap.Geocoder'], () => {
      const geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '全国',
      });
      geocoderRef.current = geocoder;
    });
  }, []);

  function addressToPos(address: string, callback: addressToPosCallback) {
    if (geocoderRef.current === undefined) return;
    if (address === undefined) return;

    geocoderRef.current.getLocation(address, (status: any, result: any) => {
      if (status === 'complete' && result.info === 'OK') {
        // result中对应详细地理坐标信息
        if (result.geocodes[0]) {
          const location = result.geocodes[0].location;
          callback({ lng: location.lng, lat: location.lat });
        }
      }
    });
  }

  function posToAddress(lnglat: Fa.LngLat, callback: posToAddressCallback) {
    if (geocoderRef.current === undefined) return;
    if (lnglat === undefined) return;

    geocoderRef.current.getAddress([lnglat.lng, lnglat.lat], (status: any, result: any) => {
      console.log('status', status, 'result', result);
      if (status === 'complete' && result.info === 'OK') {
        // result为对应的地理位置详细信息
        callback({ address: result.regeocode.formattedAddress });
      }
    });
  }

  return { addressToPos, posToAddress };
}
