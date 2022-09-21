import React from 'react';
import { Input } from 'antd';
import LocMapModal from '@/components/map-loc-select/LocMapModal';
import { CompassOutlined } from '@ant-design/icons';
import {SITE_INFO} from "@/configs/server.config";

interface IProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  initLoc?: [number, number]; // 初始化中心点
  onConfirm?: (position: [number, number], address: string | undefined) => void; // 点击OK
}

/**
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function InputAddress({ value, onChange = () => {}, initLoc, onConfirm }: IProps) {
  function handleOk(position: [number, number], address: string | undefined) {
    if (onChange) {
      onChange(address);
    }
    if (onConfirm) {
      onConfirm(position, address);
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <LocMapModal initLoc={initLoc} onConfirm={handleOk}>
        <div
          style={{
            backgroundColor: SITE_INFO.PRIMARY_COLOR,
            minWidth: 32,
            minHeight: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
            color: '#FFF',
            marginLeft: -1,
            borderRadius: '0 2px 2px 0',
          }}
        >
          <CompassOutlined />
        </div>
      </LocMapModal>
    </div>
  );
}
