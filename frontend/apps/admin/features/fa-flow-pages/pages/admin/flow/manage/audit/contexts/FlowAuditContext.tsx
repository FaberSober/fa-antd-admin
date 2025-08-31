import React, { createContext, useContext, ReactNode } from 'react';

/**
 * 流程审批上下文接口定义
 */
interface FlowAuditContextType {
  /** 刷新任务数量统计 */
  refreshCount: () => void;
}

/**
 * 流程审批上下文
 */
const FlowAuditContext = createContext<FlowAuditContextType | undefined>(undefined);

/**
 * 流程审批上下文Provider的Props
 */
interface FlowAuditProviderProps {
  children: ReactNode;
  onRefreshCount: () => void;
}

/**
 * 流程审批上下文Provider
 */
export const FlowAuditProvider: React.FC<FlowAuditProviderProps> = ({
  children,
  onRefreshCount,
}) => {
  const contextValue: FlowAuditContextType = {
    refreshCount: onRefreshCount,
  };

  return (
    <FlowAuditContext.Provider value={contextValue}>
      {children}
    </FlowAuditContext.Provider>
  );
};

/**
 * 使用流程审批上下文的Hook
 */
export const useFlowAuditContext = (): FlowAuditContextType => {
  const context = useContext(FlowAuditContext);
  if (context === undefined) {
    throw new Error('useFlowAuditContext must be used within a FlowAuditProvider');
  }
  return context;
};

export default FlowAuditContext;
