import React, { useState } from 'react';
import { DragModal, type DragModalProps } from '@fa/ui';
import FaFileView from './FaFileView';

interface FaFileViewModalModal extends DragModalProps {
  fileId: string;
  waterMark?: boolean;
}

/**
 * 通用JSON编辑配置
 */
export default function FaFileViewModal({ children, title, fileId, waterMark, ...props }: FaFileViewModalModal) {
  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal title={title || '查看文件'} open={open} onCancel={() => setOpen(false)} width={1000} {...props}>
        <div style={{ height: 600 }}>
          <FaFileView fileId={fileId} waterMark={waterMark} />
        </div>
      </DragModal>
    </span>
  );
}
