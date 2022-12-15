import React from 'react';
import LocMapModal from '@/components/map-loc-select/LocMapModal';
import {CompassOutlined} from '@ant-design/icons';
import {SITE_INFO} from "@/configs/server.config";

export interface LocMapSelButtonProps {
  initLoc?: [number, number]; // 初始化中心点
  onConfirm?: (position: [number, number], address: string | undefined) => void; // 点击OK
}

/**
 * @author xu.pengfei
 * @date 2021/1/20
 */
export default function LocMapSelButton({ initLoc, onConfirm }: LocMapSelButtonProps) {
  function handleOk(position: [number, number], address: string | undefined) {
    if (onConfirm) {
      onConfirm(position, address);
    }
  }

  return (
    <LocMapModal initLoc={initLoc} onConfirm={handleOk}>
      <div
        style={{
          backgroundColor: SITE_INFO.PRIMARY_COLOR,
          minWidth: 32,
          minHeight: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // border: '1px solid #d9d9d9',
          cursor: 'pointer',
          color: '#FFF',
          margin: '0 -11px',
          // borderRadius: '0 2px 2px 0',
        }}
      >
        <CompassOutlined />
      </div>
    </LocMapModal>
  );
}
