import React, { CSSProperties, useState } from 'react';
import { UserHeadMy } from '@/components';
import './ImChatFloat.scss'
import { FaDragItemPro } from '@fa/ui';


/**
 * @author xu.pengfei
 * @date 2025-09-07 16:44:31
 */
export default function ImChatFloat() {
  const [{ x, y }, setCoordinates] = useState<{x: number, y: number}>({ x: 0, y: 0 });

  const styleCal: CSSProperties = {
    // position: 'fixed',
    bottom: y,
    right: x,
    zIndex: 9999,
  }
  console.log('styleCal', styleCal)

  return (
    <div>
      <div
        className='fa-im-float-main fa-hover fa-box-shadow fa-flex-row-center'
        style={styleCal}
      >
        <UserHeadMy />
        <div className='fa-ml6'>我的IM</div>
      </div>
    </div>
  );
}
