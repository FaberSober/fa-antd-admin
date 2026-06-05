import type { Admin } from '@/types';
import { CheckCircleOutlined, DatabaseOutlined, DesktopOutlined, HddOutlined, PieChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { FaUtils, useApiLoading } from '@fa/ui';
import { systemApi } from '@features/fa-admin-pages/services';
import { useInterval } from 'ahooks';
import { Button, Card, Col, Progress, Row, Space, Statistic, Tag } from 'antd';
import { useEffect, useState } from 'react';
import './server.scss';

function formatPercent(value: number) {
  return Number.isFinite(value) ? `${value.toFixed(2)}%` : '--';
}

function getDiskMetrics(item: Admin.FileStore) {
  const usedSpace = item.totalSpace - item.freeSpace;
  const usedPercent = item.totalSpace > 0 ? Number(((usedSpace / item.totalSpace) * 100).toFixed(2)) : 0;
  const freePercent = Math.max(0, Number((100 - usedPercent).toFixed(2)));

  return {
    usedSpace,
    usedPercent,
    freePercent,
  };
}

function getPercentStatus(percent: number) {
  if (percent >= 85) return 'exception';
  if (percent >= 70) return 'normal';
  return 'success';
}

function getUsageColor(percent: number) {
  if (percent >= 85) return '#ef4444';
  if (percent >= 70) return '#f59e0b';
  return '#2563eb';
}

/**
 * @author xu.pengfei
 * @date 2022/10/17
 */
export default function Server() {
  const [data, setData] = useState<Admin.ServerInfo>();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(fetchData, 5000);

  function fetchData() {
    systemApi.server().then((res) => {
      setData(res.data);
      setLastUpdated(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    });
  }

  const loading = useApiLoading([systemApi.getUrl('server')]);

  if (data === undefined) {
    return (
      <div className="fa-full-content fa-p12">
        <Card loading />
      </div>
    );
  }

  const memoryUsed = data.memory.total - data.memory.available;
  const memoryUsedPercent = data.memory.total > 0 ? Number(((memoryUsed / data.memory.total) * 100).toFixed(2)) : 0;
  const diskCount = data.fileStoreList.length;
  const sortedDisks = [...data.fileStoreList].sort((a, b) => getDiskMetrics(b).usedPercent - getDiskMetrics(a).usedPercent);
  const topDisk = sortedDisks[0];
  const topDiskMetrics = topDisk ? getDiskMetrics(topDisk) : { usedSpace: 0, usedPercent: 0, freePercent: 0 };

  return (
    <div className="fa-full-content fa-p12 server-monitor-page">
      <div className="server-monitor-toolbar">
        <div>
          <div className="server-monitor-title">服务监控</div>
          <div className="server-monitor-subtitle">5 秒自动刷新，当前页按单屏展示做了高密度优化。</div>
        </div>
        <Space wrap>
          <Tag color="blue" icon={<CheckCircleOutlined />}>
            最近刷新 {lastUpdated || '--'}
          </Tag>
          <Button onClick={fetchData} loading={loading} icon={<ReloadOutlined />}>
            立即刷新
          </Button>
        </Space>
      </div>

      <Row gutter={[12, 12]} className="fa-mb12">
        <Col xs={24} sm={12} lg={6}>
          <Card className="server-monitor-kpi">
            <Statistic title="CPU 使用率" value={data.cpuInfo.used} precision={2} suffix="%" prefix={<PieChartOutlined />} />
            <div className="server-monitor-kpi-foot">共 {data.cpuInfo.cpuNum} 个核心，空闲 {formatPercent(data.cpuInfo.free)}</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="server-monitor-kpi">
            <Statistic title="内存已用" value={memoryUsedPercent} precision={2} suffix="%" prefix={<DesktopOutlined />} />
            <div className="server-monitor-kpi-foot">
              {FaUtils.sizeToHuman(memoryUsed)} / {FaUtils.sizeToHuman(data.memory.total)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="server-monitor-kpi">
            <Statistic title="最高磁盘占用" value={topDiskMetrics.usedPercent} precision={2} suffix="%" prefix={<HddOutlined />} />
            <div className="server-monitor-kpi-foot">
              {topDisk ? `${topDisk.name || topDisk.volume}` : '--'}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="server-monitor-kpi">
            <Statistic title="磁盘分区" value={diskCount} prefix={<DatabaseOutlined />} />
            <div className="server-monitor-kpi-foot">{data.system.manufacturer || '--'} / {data.system.model || '--'}</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="fa-mb12">
        <Col xs={24} lg={8}>
          <Card title="CPU" className="server-monitor-card server-monitor-card-compact">
            <div className="server-monitor-inline-meter">
              <div className="server-monitor-inline-value">{formatPercent(data.cpuInfo.used)}</div>
              <Progress
                percent={Number(data.cpuInfo.used.toFixed(2))}
                strokeColor={getUsageColor(data.cpuInfo.used)}
                trailColor="rgba(15, 23, 42, 0.08)"
                showInfo={false}
              />
            </div>
            <div className="server-monitor-stats">
              <div className="server-monitor-stat-row">
                <span>核心数</span>
                <strong>{data.cpuInfo.cpuNum}</strong>
              </div>
              <div className="server-monitor-stat-row">
                <span>使用率</span>
                <strong>{formatPercent(data.cpuInfo.used)}</strong>
              </div>
              <div className="server-monitor-stat-row">
                <span>空闲率</span>
                <strong>{formatPercent(data.cpuInfo.free)}</strong>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="内存" className="server-monitor-card server-monitor-card-compact">
            <div className="server-monitor-inline-meter">
              <div className="server-monitor-inline-value">{formatPercent(memoryUsedPercent)}</div>
              <Progress
                percent={memoryUsedPercent}
                strokeColor={getUsageColor(memoryUsedPercent)}
                trailColor="rgba(15, 23, 42, 0.08)"
                showInfo={false}
              />
            </div>
            <div className="server-monitor-stats">
              <div className="server-monitor-stat-row">
                <span>总内存</span>
                <strong>{FaUtils.sizeToHuman(data.memory.total)}</strong>
              </div>
              <div className="server-monitor-stat-row">
                <span>已使用</span>
                <strong>{FaUtils.sizeToHuman(memoryUsed)}</strong>
              </div>
              <div className="server-monitor-stat-row">
                <span>可用</span>
                <strong>{FaUtils.sizeToHuman(data.memory.available)}</strong>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="主机信息" className="server-monitor-card server-monitor-card-compact">
            <div className="server-monitor-info-grid">
              <div className="server-monitor-info-item">
                <span>厂商</span>
                <strong>{data.system.manufacturer || '--'}</strong>
              </div>
              <div className="server-monitor-info-item">
                <span>型号</span>
                <strong>{data.system.model || '--'}</strong>
              </div>
              <div className="server-monitor-info-item">
                <span>自动刷新</span>
                <strong>5 秒</strong>
              </div>
              <div className="server-monitor-info-item">
                <span>分区数量</span>
                <strong>{diskCount}</strong>
              </div>
              <div className="server-monitor-info-item server-monitor-info-item-wide">
                <span>最高占用分区</span>
                <strong>{topDisk ? topDisk.name || topDisk.volume : '--'}</strong>
              </div>
              <div className="server-monitor-info-item server-monitor-info-item-wide">
                <span>最高占用率</span>
                <strong>{topDiskMetrics.usedPercent.toFixed(2)}%</strong>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="磁盘分区"
        className="server-monitor-card server-monitor-card-auto"
        extra={<Tag color={topDiskMetrics.usedPercent >= 85 ? 'red' : topDiskMetrics.usedPercent >= 70 ? 'gold' : 'green'}>最高使用率 {topDiskMetrics.usedPercent.toFixed(2)}%</Tag>}
      >
        <Row gutter={[12, 12]}>
          {sortedDisks.map((item) => {
            const { usedSpace, usedPercent, freePercent } = getDiskMetrics(item);
            return (
              <Col xs={24} md={12} xl={6} key={item.uuid}>
                <div className="server-monitor-disk-card">
                  <div className="server-monitor-disk-head">
                    <div>
                      <div className="server-monitor-disk-name">{item.name || item.volume}</div>
                      <div className="server-monitor-disk-volume">{item.volume}</div>
                    </div>
                    <Tag color={usedPercent >= 85 ? 'red' : usedPercent >= 70 ? 'gold' : 'blue'}>{usedPercent.toFixed(2)}% 已用</Tag>
                  </div>

                  <Progress
                    percent={usedPercent}
                    status={getPercentStatus(usedPercent)}
                    strokeColor={getUsageColor(usedPercent)}
                    trailColor="rgba(15, 23, 42, 0.06)"
                    showInfo={false}
                  />

                  <div className="server-monitor-disk-meta">
                    <span>已用 {FaUtils.sizeToHuman(usedSpace, 1)}</span>
                    <span>可用 {FaUtils.sizeToHuman(item.freeSpace, 1)}</span>
                    <span>总量 {FaUtils.sizeToHuman(item.totalSpace, 1)}</span>
                    <span>空闲 {freePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>
    </div>
  );
}
