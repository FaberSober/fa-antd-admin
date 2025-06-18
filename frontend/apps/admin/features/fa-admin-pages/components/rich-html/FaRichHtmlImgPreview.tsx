import React, { useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { Image } from 'antd';
import { FaUtils } from '@fa/ui';

interface Img {
  id: string;
  src: string;
}

export interface FaRichHtmlImgPreviewProps {
  domId: string; // html富文本内容，侦测此dom元素的h标签结构
}

/**
 * 提取富文本中的img标签，添加点击预览的功能
 * @author xu.pengfei
 * @date 2023/7/17 15:28
 */
export default function FaRichHtmlImgPreview({ domId }: FaRichHtmlImgPreviewProps) {
  const [images, setImages] = useState<Img[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dom = document.getElementById(domId);
    if (isNil(dom)) return;

    const imgs: HTMLImageElement[] = Array.from(dom!.querySelectorAll('img'));

    const arr = imgs.map((img, i) => {
      const id = FaUtils.generateId();
      img.setAttribute('id', id);
      img.onclick = () => {
        // console.log('img', img, i)
        setIndex(i);
        setVisible(true);
      };
      return {
        id,
        src: img.src,
      };
    });
    // console.log('arr', arr)
    setImages(arr);
  }, [domId]);

  return (
    <div style={{ position: 'fixed', right: -100, bottom: -100, width: 1, height: 1, overflow: 'hidden' }}>
      <Image.PreviewGroup
        preview={{
          visible: visible,
          current: index,
          onChange: (current, _prev) => setIndex(current),
          onVisibleChange: (v) => setVisible(v),
        }}
      >
        {images.map((i) => (
          <Image key={i.id} width={200} src={i.src} />
        ))}
      </Image.PreviewGroup>
    </div>
  );
}
