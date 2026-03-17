import React, { useContext, useEffect, useRef } from 'react';
import { Menu, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { FaFullscreenBtn } from '@fa/ui';
import MenuLayoutContext, { type OpenTabsItem } from '../context/MenuLayoutContext';
import './OpenTabs.scss';
import { AppstoreOutlined, CloseOutlined, FullscreenExitOutlined, FullscreenOutlined, ReloadOutlined } from '@ant-design/icons';
import OpenTabsMenu, { useTabOperations } from './OpenTabsMenu';
import { Popover } from 'antd';
import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';

/**
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function OpenTabs() {
  const { openTabs, curTab, selTab, reloadTab, menuContentFull, setMenuContentFull } = useContext(MenuLayoutContext);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [contextTabKey, setContextTabKey] = React.useState<string>('');
  const { remove } = useTabOperations();

  // 切换 tab 时，丝滑滚动使当前激活的标签进入视野
  useEffect(() => {
    if (!curTab?.key || !tabsRef.current) return;
    const activeEl = tabsRef.current.querySelector<HTMLDivElement>('.fa-tab-menu-item.active');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [curTab?.key]);

  function reloadCurTab() {
    if (curTab?.key) {
      reloadTab(curTab.key);
    }
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (tabsRef.current) {
      e.preventDefault();
      tabsRef.current.scrollLeft += e.deltaY;
    }
  }

  // ------------------------------- context menu -------------------------------
  const { show } = useContextMenu({
    id: 'menu_context_tab_item',
  });

  function handleContextMenu(event: any, props: OpenTabsItem) {
    setContextTabKey(props.key);
    show({ event, props });
  }

  // console.log('openTabs', openTabs, 'curTab', curTab)
  return (
    <div className="fa-menu-open-tabs fa-border-b">
      <div ref={tabsRef} className='fa-flex-1 fa-full-h fa-menu-top' style={{paddingTop: 3}} onWheel={handleWheel}>
        <div className='fa-tab-menu-item-container'>
          {openTabs.map((item) => {
            const isActive = item.key === curTab?.key;
            return (
              <div
                key={item.key}
                className={isActive ? 'fa-tab-menu-item active' : 'fa-tab-menu-item'}
                onClick={() => selTab(item.key)}
              >
                <div className='fa-tab-menu-item-bg'></div>
                <div className="fa-tab-menu-item-main" onContextMenu={(e) => handleContextMenu(e, item)}>
                  {item.icon ? <FaIconPro className='fa-tab-menu-item-icon' icon={item.icon as string} fontSize={16} /> : null}

                  <span>{item.name}</span>

                  <div className='fa-tab-menu-item-close' onClick={(e) => remove(item.key)}>
                    <CloseOutlined style={{ fontSize: '.775rem' }} />
                  </div>
                </div>
                {/* 左右装饰 */}
                <svg className='fa-tab-menu-item-left-cornor' width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path data-v-2540ea20="" d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" fill="#006be626"></path>
                </svg>
                <svg className='fa-tab-menu-item-right-cornor' width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0A7 7 0 0 0 7 7L0 7Z" fill="#006be626"></path>
                </svg>
              </div>
            )
          })}
        </div>
      </div>

      <Popover 
        content={<OpenTabsMenu targetTabKey={curTab?.key || ''} />} 
        trigger="click"
        styles={{
          container: {padding: 4, width: 180},
        }}
      >
        <div className='fa-menu-tab-right-btn'>
          <AppstoreOutlined />
        </div>
      </Popover>
      <div className='fa-menu-tab-right-btn' onClick={reloadCurTab}>
        <ReloadOutlined />
      </div>
      {/* 需要修改为网页内全屏，即隐藏header、menu */}
      {menuContentFull ? (
        <div className='fa-menu-tab-right-btn' onClick={() => setMenuContentFull(false)}>
          <FullscreenExitOutlined />
        </div>
      ) : (
        <div className='fa-menu-tab-right-btn' onClick={() => setMenuContentFull(true)}>
          <FullscreenOutlined />
        </div>
      )}

      <Menu id="menu_context_tab_item" className="fa-border fa-tabs-context-menu" style={{minWidth: 180, zIndex: 9999}}>
        <OpenTabsMenu targetTabKey={contextTabKey} />
      </Menu>
    </div>
  );
}
