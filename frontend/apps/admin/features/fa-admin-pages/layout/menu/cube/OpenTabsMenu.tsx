import { CloseOutlined, CloseSquareOutlined, LeftSquareOutlined, PushpinOutlined, ReloadOutlined, RightSquareOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useContext } from 'react';
import { findIndex } from 'lodash';
import MenuLayoutContext from '../context/MenuLayoutContext';

export interface OpenTabsMenuProps {
  targetTabKey: string;
}

/**
 * @author xu.pengfei
 * @date 2026-03-03 16:01:06
 */
export default function OpenTabsMenu({ targetTabKey }: OpenTabsMenuProps) {
  const { openTabs, curTab, setOpenTabs, selTab, reloadTab } = useContext(MenuLayoutContext);

  function remove(tabKey: string) {
    const index = findIndex(openTabs, (i) => i.key === tabKey);
    if (index === -1) return;

    let lastIndex = -1;
    openTabs.forEach((item, i) => {
      if (item.key === tabKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = openTabs.filter((item) => item.key !== tabKey);

    let newActiveKey = curTab?.key;
    if (newPanes.length && newPanes.length > 0 && newActiveKey === tabKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
      selTab(newActiveKey);
    } else if (newActiveKey === undefined) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
      selTab(newActiveKey);
    }
    setOpenTabs(newPanes);
  }

  function closeOthers(tabKey: string) {
    const index = findIndex(openTabs, (i) => i.key === tabKey);
    if (index === -1) return;

    const newPanes = openTabs.filter((item) => item.key === tabKey);
    setOpenTabs(newPanes);
  }

  function closeLeft(tabKey: string) {
    const index = findIndex(openTabs, (i) => i.key === tabKey);
    if (index === -1) return;

    const newPanes = [...openTabs];
    newPanes.splice(0, index);
    setOpenTabs(newPanes);
  }

  function closeRight(tabKey: string) {
    const index = findIndex(openTabs, (i) => i.key === tabKey);
    if (index === -1) return;

    const newPanes = [...openTabs];
    newPanes.splice(index + 1, newPanes.length - index - 1);
    setOpenTabs(newPanes);
  }

  function reload() {
    reloadTab(targetTabKey);
  }

  function openAnotherWindow() {
    window.open(window.location.href, '_blank')
  }

  return (
    <div className='fa-menu-tab-context-menu'>
      <Button type='text' block icon={<CloseOutlined />} onClick={() => remove(targetTabKey)}>关闭</Button>
      {/* <Button type='text' block icon={<PushpinOutlined />} onClick={() => reload()}>固定</Button> */}
      <Button type='text' block icon={<ReloadOutlined />} onClick={() => reload()}>重新加载</Button>
      <Button type='text' block icon={<SendOutlined />} onClick={() => openAnotherWindow()}>在新窗口打开</Button>
      <Divider />
      <Button type='text' block icon={<LeftSquareOutlined />} onClick={() => closeLeft(targetTabKey)}>关闭左侧</Button>
      <Button type='text' block icon={<RightSquareOutlined />} onClick={() => closeRight(targetTabKey)}>关闭右侧</Button>
      <Button type='text' block icon={<CloseSquareOutlined />} onClick={() => closeOthers(targetTabKey)}>关闭其他</Button>
    </div>
  );
}

export function useTabOperations() {
  const { openTabs, curTab, setOpenTabs, selTab } = useContext(MenuLayoutContext);

  function remove(tabKey: string) {
    const index = findIndex(openTabs, (i) => i.key === tabKey);
    if (index === -1) return;

    let lastIndex = -1;
    openTabs.forEach((item, i) => {
      if (item.key === tabKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = openTabs.filter((item) => item.key !== tabKey);

    let newActiveKey = curTab?.key;
    if (newPanes.length && newPanes.length > 0 && newActiveKey === tabKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
      selTab(newActiveKey);
    } else if (newActiveKey === undefined) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
      selTab(newActiveKey);
    }
    setOpenTabs(newPanes);
  }

  return { remove };
}