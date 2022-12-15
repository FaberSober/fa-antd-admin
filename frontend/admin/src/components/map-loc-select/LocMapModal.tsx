import React, {useRef, useState} from 'react';
import DragModal from '@/components/modal/DragModal';
import {ModalProps} from 'antd/es/modal';
import {Map, Marker} from '@uiw/react-amap';
import MyAutoComplete from './MyAutoComplete';

export interface IProps extends ModalProps {
  children?: JSX.Element;
  initLoc?: [number, number]; // 初始化中心点
  onConfirm?: (position: [number, number], address: string | undefined) => void; // 点击OK
  disableEdit?: boolean; // 禁止选择点
}

/**
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function LocMapModal({ children, initLoc, onConfirm, disableEdit }: IProps) {
  const geocoderRef = useRef<any | null>();

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<[number, number]>(initLoc || [0, 0]);
  const [center, setCenter] = useState<[number, number] | undefined>(initLoc);
  const [ready, setReady] = useState(false);
  const [address, setAddress] = useState<string>();

  function getGeoAddress(lnglat: any) {
    setPosition([lnglat.lng, lnglat.lat]);
    if (geocoderRef.current) {
      geocoderRef.current.getAddress(lnglat, (status: any, result: any) => {
        if (status === 'complete') {
          if (result.regeocode) {
            setAddress(result.regeocode.formattedAddress || '未知地点');
          } else {
            setAddress('未知地点');
          }
        } else {
          setAddress('未知地点');
        }
      });
    }
  }
  // AMap诱导点选
  function selectFunc(e: any) {
    if (disableEdit) return;
    setCenter([e.poi.location.lng, e.poi.location.lat]);
    if (e.poi.location) {
      getGeoAddress(e.poi.location);
    }
  }

  function handleOk(e: any) {
    if (e) e.stopPropagation();
    if (onConfirm) {
      onConfirm(position, address);
    }
    setVisible(false);
  }

  return (
    <div>
      <div onClick={() => setVisible(true)}>{children}</div>
      <DragModal title="获取经纬度" open={visible} onOk={handleOk} onCancel={() => setVisible(false)} width={660} destroyOnClose>
        <div style={{ width: '100%', height: '500px', position: 'relative' }}>
          <Map
            center={center}
            onComplete={() => {
              setReady(true);
              // @ts-ignore
              AMap.plugin('AMap.Geocoder', () => {
                // @ts-ignore
                geocoderRef.current = new AMap.Geocoder({
                  city: '010', // 城市，默认：“全国”
                });
              });
            }}
            onClick={(e) => {
              // console.log('点击事件！', e);
              getGeoAddress(e.lnglat);
              // @ts-ignore
              // setPosition([e.lnglat.lng, e.lnglat.lat]);
            }}
          >
            {ready && <Marker title={address} position={new AMap.LngLat(position[0], position[1])} />}
            <div style={{ padding: '6px', background: '#000', color: '#fff', position: 'absolute', bottom: 0, left: 0, zIndex: 999 }}>
              {address === '' ? '点击地图获取位置' : address}
            </div>
            <MyAutoComplete onSelectData={selectFunc} style={{ position: 'absolute', right: 10, top: 10, width: 200 }} />
          </Map>
        </div>
      </DragModal>
    </div>
  );
}
