import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { Im, ImEnums } from '@features/fa-im-pages/types';
import { Avatar } from 'antd';
import React, { useContext, useMemo } from 'react';


interface CoverItem {
  id: string;
  img: string;
}

export interface ImChatCoverProps {
  conv: Im.ImConversationRetVo;
}

/**
 * 用户头像:
 * 单聊：展示对方头像；
 * 群聊：展示最多9个头像；
 * @author xu.pengfei
 * @date 2025-09-09 15:10:11
 */
export default function ImChatCover({ conv }: ImChatCoverProps) {
  const {user} = useContext(UserLayoutContext)

  let showImgs = useMemo(() => {
    const coverJson = JSON.parse(conv.cover) as CoverItem[]
    if (conv.type === ImEnums.ImConversationTypeEnum.SINGLE) {
      return coverJson.filter(i => i.id !== user.id).map(i => i.img)
    } else {
      const imgs = coverJson.map(i => i.img);
      return imgs.slice(0, 9);
    }
  }, [conv]);

  // console.log('showImgs', showImgs)
  // showImgs = [
  //   '837b3d4dbe3c1176c501520d6208ffc6', 'cb4d172e00a22600d0206cbc26f4aed2',
  //   '837b3d4dbe3c1176c501520d6208ffc6', 'cb4d172e00a22600d0206cbc26f4aed2',
  //   '837b3d4dbe3c1176c501520d6208ffc6', 'cb4d172e00a22600d0206cbc26f4aed2',
  //   '837b3d4dbe3c1176c501520d6208ffc6', 'cb4d172e00a22600d0206cbc26f4aed2', 'cb4d172e00a22600d0206cbc26f4aed2',
  // ]
  if (showImgs.length === 1) {
    return (
      <div className='fa-im-wx-msg-header'>
        <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(showImgs[0])} />} size={36} />
      </div>
    )
  }

  const width = showImgs.length < 5 ? 17 : 11;
  return (
    <div className='fa-im-wx-msg-header'>
      {showImgs.map(img => (
        <Avatar key={img} shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(img)} />} size={width} />
      ))}
    </div>
  );
}
