import React, { useState } from 'react';
import { FaFlexRestLayout } from "@fa/ui";
import { FaIcon } from '@fa/icons';
import { Menu, MenuProps } from "antd";
import All from './alls'
import Recent from './recent'
import Recycle from './recycle'
import Tags from "./tags";
import { BucketSelBtn } from "@/layout";


/**
 * @author xu.pengfei
 * @date 2022/12/27 11:11
 */
export default function index() {
  const [activeKey, setActiveKey] = useState<string>("all");

  const items: MenuProps['items'] = [
    {
      label: '全部文件',
      key: 'all',
      icon: <FaIcon icon="fa-solid fa-box-archive" />,
    },
    {
      label: '最近文件',
      key: 'recent',
      icon: <FaIcon icon="fa-solid fa-clock" />,
    },
    {
      label: '文件标签',
      key: 'tags',
      icon: <FaIcon icon="fa-solid fa-tags" />,
    },
    {
      label: '回收站',
      key: 'recycle',
      icon: <FaIcon icon="fa-solid fa-trash-can" />,
    },
  ]

  return (
    <div className="fa-full-content fa-bg-white fa-flex-row">
      <div className="fa-flex-column" style={{width: 140}}>
        <BucketSelBtn/>
        <FaFlexRestLayout>
          <Menu items={items} selectedKeys={[activeKey]} onSelect={({key}) => setActiveKey(key)} style={{height: '100%'}} />
        </FaFlexRestLayout>
      </div>

      <FaFlexRestLayout>
        {activeKey === 'all'      && <All />}
        {activeKey === 'recent'   && <Recent />}
        {activeKey === 'tags'     && <Tags />}
        {activeKey === 'recycle'  && <Recycle />}
      </FaFlexRestLayout>
    </div>
  )
}
