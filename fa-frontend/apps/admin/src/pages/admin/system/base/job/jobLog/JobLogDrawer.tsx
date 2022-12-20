import React, { useState } from 'react';
import { Drawer, DrawerProps } from 'antd';
import JobLogList from './JobLogList';

export interface JobLogDrawerProps extends DrawerProps {
  jobId: number;
}

/**
 * BASE-系统定时任务-执行日志实体新增、编辑弹框
 */
export default function JobLogDrawer({ children, jobId, ...props }: JobLogDrawerProps) {
  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <Drawer title="定时任务日志查看" open={open} onClose={() => setOpen(false)} width={1200} {...props}>
        <JobLogList jobId={jobId} />
      </Drawer>
    </span>
  );
}
