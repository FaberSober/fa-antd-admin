import React from 'react';
import { Button, Col, type FormInstance, Row } from 'antd';
import AMapSearchSelectModal from './AMapSearchSelectModal';
import useAMapGeocoder from './useAMapGeocoder';

export interface Record {
  lng: number;
  lat: number;
  address?: string;
}

export interface AMapFormSelectPointProps<V extends Record> {
  form: FormInstance<any>;
  offset?: number;
  record?: V;
}

/**
 * 地图选点，需要访问外网高德地图数据。
 * 如果部署环境没有外网环境，这个直接返回null，则可以统一屏蔽此功能。
 * @author xu.pengfei
 * @date 2023/5/20 15:11
 */
export default function AMapFormSelectPoint<V extends Record>({ form, record, offset = 4 }: AMapFormSelectPointProps<V>) {
  const { posToAddress } = useAMapGeocoder();

  return (
    <Row className="fa-mb12">
      <Col offset={offset}>
        <AMapSearchSelectModal
          value={record && record.lng && record.lat ? { lng: record.lng, lat: record.lat } : undefined}
          onSelect={(pos) => {
            form.setFieldsValue({ lng: pos.lng, lat: pos.lat });
            posToAddress(pos, (v) => {
              form.setFieldsValue({ address: v.address });
            });
          }}
        >
          <Button>地图选点</Button>
        </AMapSearchSelectModal>
      </Col>
    </Row>
  );
}
