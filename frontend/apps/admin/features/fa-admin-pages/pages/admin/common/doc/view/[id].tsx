import React from 'react';
import { useParams } from 'react-router-dom';
import { OnlyofficeEditor } from '@features/fa-admin-pages/components';

/**
 * 在线查看office文档
 * @author xu.pengfei
 * @date 2023/3/14 15:52
 */
export default function DocView() {
  const { id } = useParams();

  return <div className="fa-full-content">{id && <OnlyofficeEditor fileId={id} mode="view" />}</div>;
}
