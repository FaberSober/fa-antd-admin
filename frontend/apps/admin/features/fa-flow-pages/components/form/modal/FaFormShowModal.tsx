import type { Flow } from '@/types';
import { DragModal, DragModalProps } from '@fa/ui';
import { useState } from 'react';
import { FaFormShow } from '../..';


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
        {...props}
      >
        <FaFormShow config={config} />
      </DragModal>
    </span>
  );
}
