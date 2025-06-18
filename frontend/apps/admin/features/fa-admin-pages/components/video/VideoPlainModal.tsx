import React, { useState } from 'react';
import { DragModal, type DragModalProps } from '@fa/ui';

export interface VideoPlainModalProps extends DragModalProps {
  url: string; // 视频地址
}

/**
 * @author xu.pengfei
 * @date 2023/8/6 20:00
 */
export default function VideoPlainModal({ url, children, ...props }: VideoPlainModalProps) {
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
        <video width="976" height="549" controls>
          <source src={url} type="video/mp4" />
        </video>
      </DragModal>
    </span>
  );
}
