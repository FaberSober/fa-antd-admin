import React, { useState } from 'react';
import { DragModal, FaUtils, type DragModalProps } from '@fa/ui';
import { Space } from 'antd';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';

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
        bodyStyle={{ height: 600 }}
        {...props}
      >
        <div className='fa-full fa-flex-column'>
          <div style={{ flex: 1, position: 'relative' }}>
            <div className='fa-full-content'>
              <video width="100%" height="100%" controls>
                <source src={url} type="video/mp4" />
              </video>
            </div>
          </div>

          <div className='fa-mt12'>
            <Space>
              <a href={url} target="_blank" rel="noreferrer"><LinkOutlined />打开新窗口播放视频</a>
              <a onClick={() => FaUtils.copyToClipboard(url)}><CopyOutlined />复制链接</a>
            </Space>
          </div>
        </div>
      </DragModal>
    </span>
  );
}
