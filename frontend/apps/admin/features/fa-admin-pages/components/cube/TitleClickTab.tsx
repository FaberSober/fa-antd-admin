import React, { useContext } from 'react';
import { MenuLayoutContext } from "@features/fa-admin-pages/layout";


export interface TitleClickTabProps {
  title: string;
  url: string;
}

/**
 * 点击打开tab页的标题组件
 * @author xu.pengfei
 * @date 2025/7/18 16:49
 */
export default function TitleClickTab({title, url}: TitleClickTabProps) {
  const {addTab} = useContext(MenuLayoutContext)

  function handleAddTab() {
    addTab({
      key: url,
      path: url,
      name: title,
      type: 'inner', // iframe, inner-内部网页
      closeable: true,
    });
  }

  return (
    <div onClick={handleAddTab} className="fa-cursor-pointer">
      {title}
    </div>
  )
}
