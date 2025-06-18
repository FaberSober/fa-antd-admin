import React from 'react';
import { FileBizList } from "@features/fa-admin-pages/components";
import { BaseDrawer } from "@fa/ui";
import { FileBizListProps } from "./FileBizList";



/**
 * @author xu.pengfei
 * @date 2025/4/2 14:20
 */
export default function FileBizListDrawer(props: FileBizListProps) {
  return (
    <BaseDrawer triggerDom={<a>导入历史记录</a>} title="导入历史记录">
      <FileBizList {...props} />
    </BaseDrawer>
  )
}
