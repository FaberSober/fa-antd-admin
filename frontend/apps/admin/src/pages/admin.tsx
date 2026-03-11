import React from 'react';
import MenuContainer from '@features/fa-admin-pages/layout/menu/MenuContainer';
import { FlowTaskWebsocketProcessor } from '@features/fa-flow-pages/components';
import { ImHeaderCube } from '@features/fa-im-pages/components';

/**
 * 使用admin的公共厂字形布局。这里还可以修改为：用户选择不同的布局，在这里返回不同的布局。
 */
export default function AdminLayout() {
  return (
    <MenuContainer
      renderHeaderExtra={() => (
        <>
          <ImHeaderCube />
        </>
      )}
      extra={() => (
        <>
          <FlowTaskWebsocketProcessor />
        </>
      )}
    />
  );
}
