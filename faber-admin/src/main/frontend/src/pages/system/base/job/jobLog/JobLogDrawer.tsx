import React, {useState} from 'react';
import {Drawer} from 'antd';
import {DragModalProps} from "@/components/modal/DragModal";
import JobLogList from "@/pages/system/base/job/jobLog/JobLogList";


export interface JobLogDrawerProps extends DragModalProps {
  jobId: number;
}

/**
 * BASE-系统定时任务-执行日志实体新增、编辑弹框
 */
export default function JobLogDrawer({ children, jobId, ...props }: JobLogDrawerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  function showModal() {
    setModalVisible(true)
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <Drawer
        title="定时任务日志查看"
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        width={1200}
        {...props}
      >
        <JobLogList jobId={jobId} />
      </Drawer>
    </span>
  )
}
