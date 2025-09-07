import React, { CSSProperties, useRef, useState } from 'react';
import { UserHeadMy } from '@/components';
import './ImChatFloat.scss'
import { FaDragItemPro } from '@fa/ui';
import ImChatPanel from './cube/ImChatPanel';


/**
 * @author xu.pengfei
 * @date 2025-09-07 16:44:31
 */
export default function ImChatFloat() {
  const dragItemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return; // 只处理左键
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return;
    if (!dragItemRef.current) return;

    const { offsetWidth, offsetHeight } = dragItemRef.current;

    // 计算新位置
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    // 限制在屏幕范围内
    newX = Math.max(0, Math.min(newX, window.innerWidth - offsetWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - offsetHeight));
    console.log('newX', newX, 'newY', newY)

    setPosition({ x: newX, y: newY });
  }

  function handleMouseUp(e: React.MouseEvent) {
    setIsDragging(false);
  }

  const styleCal: CSSProperties = {
    // position: 'fixed',
    bottom: position.y,
    right: position.x,
    zIndex: 9999,
  }
  console.log('styleCal', styleCal)

  function handleShowChatPanel() {
    setShow(true)
  }

  return (
    <div>
      {/* chat float btn */}
      <div
        ref={dragItemRef}
        id='fa-im-main'
        className='fa-im-float-main fa-hover fa-box-shadow fa-flex-row-center'
        style={styleCal}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
        onClick={() => console.log('click')}
      >
        <div className='fa-p12 fa-cursor-move'>
          <UserHeadMy />
        </div>
        <div className='fa-p12 fa-pl0' onClick={handleShowChatPanel}>我的IM</div>
      </div>

      {/* chat panel */}
      <div style={{ display: show ? 'block' : 'none', position: 'fixed', right: 0, bottom: 0, zIndex: 9999 }}>
        <ImChatPanel
          onClose={() => setShow(false)}
        />
      </div>
    </div>
  );
}
