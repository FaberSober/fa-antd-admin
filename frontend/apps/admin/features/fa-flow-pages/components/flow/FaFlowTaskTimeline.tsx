import React from 'react';
import { Timeline, Typography, Tag } from 'antd';
import { ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Flow } from '@features/fa-flow-pages/types';

const { Text } = Typography;

export interface FaFlowTaskTimelineProps {
  /** 流程审批历史记录列表 */
  processApprovals?: Flow.FlowProcessApproval[];
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 流程任务审批时间轴组件
 *
 * @author xu.pengfei
 * @date 2025-08-31
 */
export default function FaFlowTaskTimeline({ processApprovals = [], style }: FaFlowTaskTimelineProps) {

  /**
   * 根据任务类型获取时间轴节点颜色
   */
  const getItemColor = (type?: number): string => {
    if (type === 1) {
      return 'green'; // 已完成的审批任务
    } else if (type === -1) {
      return 'blue'; // 当前待处理的任务
    }
    return 'gray'; // 默认颜色
  };

  /**
   * 获取时间轴节点图标
   */
  const getItemDot = (type?: number) => {
    if (type === 1) {
      return <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />; // 已完成
    } else if (type === -1) {
      return <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />; // 待处理
    }
    return undefined;
  };

  // 构建时间轴项目数据
  const timelineItems = processApprovals.map((approval, index) => {
    return {
      key: `approval-${index}`,
      color: getItemColor(approval.type),
      dot: getItemDot(approval.type),
      children: (
        <div>
          {/* 任务名称和状态标签 */}
          <div style={{ fontWeight: 'bold', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{approval.taskName || '未知任务'}</span>
            {approval.type === 1 && <Tag color="success">已完成</Tag>}
            {approval.type === -1 && <Tag color="processing">待处理</Tag>}
          </div>

          {/* 创建人名称 */}
          {approval.createBy && (
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">审批人：</Text>
              <Text>{approval.createBy}</Text>
            </div>
          )}

          {/* 创建时间 */}
          {approval.createTime && (
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">时间：</Text>
              <Text>{approval.createTime}</Text>
            </div>
          )}

          {/* 节点用户列表 - 仅在待处理任务时显示 */}
          {approval.type === -1 && approval.content?.nodeUserList && approval.content.nodeUserList.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">待审批人：</Text>
              <Text>
                {approval.content.nodeUserList.map(user => user.name).filter(Boolean).join('、')}
              </Text>
            </div>
          )}
        </div>
      ),
    };
  });

  // 如果没有数据，显示空状态
  if (processApprovals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#999', ...style }}>
        暂无审批记录
      </div>
    );
  }

  return (
    <Timeline
      style={style}
      items={timelineItems}
    />
  );
}
