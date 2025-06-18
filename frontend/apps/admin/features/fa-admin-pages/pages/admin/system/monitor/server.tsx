import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Row, Space } from 'antd';
import type { Admin } from '@/types';
import { ApiEffectLayoutContext, FaUtils } from '@fa/ui';
import { ReloadOutlined } from '@ant-design/icons';
import { systemApi } from '@features/fa-admin-pages/services';
import { useInterval } from 'ahooks';

/**
 * @author xu.pengfei
 * @date 2022/10/17
 */
export default function Server() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [data, setData] = useState<Admin.ServerInfo>();

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(fetchData, 5000);

  function fetchData() {
    systemApi.server().then((res) => setData(res.data));
  }

  const loading = loadingEffect[systemApi.getUrl('server')];
  return (
    <div className="fa-full-content fa-p12">
      <Space className="fa-mb12">
        <Button onClick={fetchData} loading={loading} icon={<ReloadOutlined />}>
          刷新
        </Button>
      </Space>
      {data !== undefined && (
        <Row gutter={12}>
          <Col md={12}>
            <Card title="CPU">
              <Descriptions column={1}>
                <Descriptions.Item label="核心数">{data.cpuInfo.cpuNum}</Descriptions.Item>
                <Descriptions.Item label="使用率">{data.cpuInfo.used}%</Descriptions.Item>
                <Descriptions.Item label="空闲率">{data.cpuInfo.free}%</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col md={12}>
            <Card title="内存">
              <Descriptions column={1}>
                <Descriptions.Item label="核心数">{FaUtils.sizeToHuman(data.memory.total)}</Descriptions.Item>
                <Descriptions.Item label="使用数">{FaUtils.sizeToHuman(data.memory.total - data.memory.available)}</Descriptions.Item>
                <Descriptions.Item label="空闲数">{FaUtils.sizeToHuman(data.memory.available)}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      )}

      {data !== undefined && (
        <Row gutter={12} className="fa-mt12">
          <Col md={12}>
            <Card title="磁盘">
              {data.fileStoreList.map((i) => {
                const freePer = i.freeSpace / i.totalSpace;
                const totalWidth = 400;
                const freePerWidth = (freePer * totalWidth).toFixed(0);
                return (
                  <div key={i.uuid} className="fa-flex-row-center fa-mb12">
                    <div className="fa-flex-1 fa-keep-word">{i.volume}</div>
                    <div className="fa-mr12">{i.name}</div>
                    <div
                      className="fa-flex-row-center fa-p8 fa-border fa-border-r fa-relative"
                      style={{ width: totalWidth, background: 'darkblue', color: '#FFF' }}
                    >
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${freePerWidth}px`, background: 'grey' }} />
                      <div className="fa-flex-1" />
                      <div>{FaUtils.sizeToHuman(i.freeSpace, 1)}</div>
                      <div>&nbsp;/&nbsp;</div>
                      <div>{FaUtils.sizeToHuman(i.totalSpace, 1)}</div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
