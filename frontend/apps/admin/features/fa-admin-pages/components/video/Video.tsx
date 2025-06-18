import React, { type CSSProperties, useEffect, useRef, useState } from 'react';
import { FaUtils } from '@fa/ui';

export interface VideoProps {
  poster?: string; // 视频地址
  url: string; // 视频地址
  style?: CSSProperties;
  onReady?: (player: any) => void;
}

/**
 * 使用videojs的视频播放器
 * @author xu.pengfei
 * @date 2023/8/6 20:00
 */
export default function Video({ poster, url, onReady, style }: VideoProps) {
  const playerRef = useRef<any>();

  const [id] = useState(`my-video-player-${FaUtils.generateId()}`);

  useEffect(() => {
    const options = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      poster,
      sources: [
        {
          src: url, // '/path/to/video.mp4',
          type: 'video/mp4',
        },
      ],
    };
    const player = window.videojs(id, options, () => {
      window.videojs.log('player is ready');
      onReady && onReady(player);
    });
    playerRef.current = player;
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={style}>
      <video id={id} className="video-js" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
