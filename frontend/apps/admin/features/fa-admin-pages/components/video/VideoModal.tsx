import React, { useState } from 'react';
import { DragModal, type DragModalProps } from '@fa/ui';
import Video from './Video';

export interface VideoModal extends DragModalProps {
  url: string; // 视频地址
}

/**
 * @author xu.pengfei
 * @date 2023/8/6 20:00
 */
export default function VideoModal({ url, children, ...props }: VideoModal) {
  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal
        title="播放视频"
        open={open}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setOpen(false)}
        cancelText="关闭"
        width={1000}
        style={{ top: 44 }}
        {...props}
      >
        <Video url={url} style={{ width: 976, height: 549 }} />
      </DragModal>
    </span>
  );
}
