import type { Flow } from '@/types';
import { DragModal, DragModalProps } from '@fa/ui';
import { useState } from 'react';
import FaFormShow from '../FaFormShow';


export interface FaFormShowModalProps extends DragModalProps {
  config: Flow.FlowFormConfig;
}

/**
 * Demo-学生表实体新增、编辑弹框
 */
export default function FaFormShowModal({ children, config, ...props }: FaFormShowModalProps) {
  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
      </span>
      <DragModal
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={800}
        mask={false}
        style={{ top: 44 }}
        {...props}
      >
        <FaFormShow config={config} style={{height: 'calc(100vh - 220px)'}} />
      </DragModal>
    </span>
  );
}
