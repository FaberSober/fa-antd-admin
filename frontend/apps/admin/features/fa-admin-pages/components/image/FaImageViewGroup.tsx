import React from 'react';
import { Image, Space, ImageProps } from "antd";
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined, UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from "@ant-design/icons";
import { FaUtils } from "@fa/ui";


export interface ImageViewGroupProps extends Omit<ImageProps, 'onChange'> {
  items: string[];
  current: number;
  onChange: (v:number) => void;
}

/**
 * @author xu.pengfei
 * @date 2025/5/23 14:22
 */
export default function FaImageViewGroup({items, current, onChange, ...props}: ImageViewGroupProps) {
  const url = items[current]
  return (
    <Image.PreviewGroup
      preview={{
        current: current,
        toolbarRender: (
          _,
          {
            transform: {scale},
            actions: {
              onActive,
              onFlipY,
              onFlipX,
              onRotateLeft,
              onRotateRight,
              onZoomOut,
              onZoomIn,
              onReset,
            },
          },
        ) => (
          <Space size={12} className="toolbar-wrapper">
            <LeftOutlined onClick={() => onActive?.(-1)}/>
            <RightOutlined onClick={() => onActive?.(1)}/>
            <DownloadOutlined onClick={() => FaUtils.downloadImage(url)}/>
            <SwapOutlined rotate={90} onClick={onFlipY}/>
            <SwapOutlined onClick={onFlipX}/>
            <RotateLeftOutlined onClick={onRotateLeft}/>
            <RotateRightOutlined onClick={onRotateRight}/>
            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut}/>
            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn}/>
            <UndoOutlined onClick={onReset}/>
          </Space>
        ),
        onChange,
      }}
      items={items}
    >
      <Image
        src={url}
        width={600}
        height={450}
        style={{objectFit: 'contain'}}
        {...props}
        />
    </Image.PreviewGroup>
  )
}
