import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PercentageOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { alertApi } from "@features/fa-admin-pages/services";
import useBus from "use-bus";


/**
 * alert statistic
 * @author xu.pengfei
 * @date 2025/7/18 17:11
 */
export default function AlertStatistic() {
  const [statistic, setStatistic] = useState({
    total: 0,
    processed: 0,
    unprocessed: 0,
    processingRate: 0
  }); //统计默认值

  /** 统计数据计算 */
  const fetchStatistics = async () => {
    const { data: total } = await alertApi.count({query:{}});
    const { data: processed } = await alertApi.count({query:{deal: true}});
    const unprocessed = total - processed;
    const processingRate = total > 0 ? Number((processed / total * 100).toFixed(2)) : 0;
    setStatistic({ total, processed, unprocessed, processingRate });
  }

  useEffect(() => {
    fetchStatistics()
  }, []);

  useBus(
    ['@@api/refresh_alert_statistic'],
    () => {
      fetchStatistics()
    },
    [],
  )

  const statisticCards = [
    {
      title: '总预警数',
      value: statistic.total,
      icon: <ExclamationCircleOutlined />,
      theme: { main: '#1890ff', bg: '#e6f7ff', text: '#0050b3' }
    },
    {
      title: '已处理数',
      value: statistic.processed,
      icon: <CheckCircleOutlined />,
      theme: { main: '#52c41a', bg: '#f6ffed', text: '#238636' }
    },
    {
      title: '未处理数',
      value: statistic.unprocessed,
      icon: <ClockCircleOutlined />,
      theme: { main: '#faad14', bg: '#fffbe6', text: '#d48806' }
    },
    {
      title: '处置率',
      value: statistic.processingRate,
      suffix: "%",
      icon: <PercentageOutlined />,
      theme: { main: '#722ed1', bg: '#f9f0ff', text: '#531dab' }
    }
  ];

  return (
    <div className="fa-p12">
      <Row gutter={[24, 0]} justify="center">
        {statisticCards.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index} style={{padding: '0 12px'}}>
            <Card style={{borderRadius: 10}} hoverable className="fa-box-shadow">
              <div className="fa-flex-row-center fa-flex-center">
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: item.theme.bg,
                  color: item.theme.main,
                  fontSize: '24px',
                  marginRight: 24,
                }} className="fa-flex-center">
                  {item.icon}
                </div>
                <div style={{flex: 1}}>
                  <div style={{ fontSize: '14px', color: '#666', fontWeight: 500, marginBottom: 6 }}>
                    {item.title}
                  </div>
                  <Statistic
                    value={item.value}
                    valueStyle={{
                      fontSize: '28px',
                      lineHeight: '28px',
                      fontWeight: 600,
                      color: item.theme.text,
                    }}
                    suffix={item.suffix}
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
