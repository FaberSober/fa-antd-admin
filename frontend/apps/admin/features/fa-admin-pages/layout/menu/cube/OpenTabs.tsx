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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * 可排序的Tab项组件
 */
function SortableTabItem({ item, isActive, onClick, onClose, onContextMenu }: {
  item: OpenTabsItem;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.key });

  // 只保留水平轴的变换，将垂直轴设置为0
  const horizontalTransform = transform
    ? {
        ...transform,
        y: 0,
      }
    : null;

  const style = {
    transform: CSS.Transform.toString(horizontalTransform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    // 避免点击在关闭按钮上时执行切换
    if ((e.target as HTMLElement).closest('.fa-tab-menu-item-close') === null) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isActive ? 'fa-tab-menu-item active' : 'fa-tab-menu-item'}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className='fa-tab-menu-item-bg'></div>
      <div className="fa-tab-menu-item-main" onContextMenu={(e) => {
        e.stopPropagation();
        onContextMenu(e);
      }}>
        {item.icon ? <FaIconPro className='fa-tab-menu-item-icon' icon={item.icon as string} fontSize={16} /> : null}
        <span>{item.name}</span>
        <div className='fa-tab-menu-item-close' onClick={(e) => {
          e.stopPropagation();
          onClose(e);
        }}>
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
  );
}

/**
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function OpenTabs() {
  const { openTabs, curTab, selTab, reloadTab, menuContentFull, setMenuContentFull, setOpenTabs } = useContext(MenuLayoutContext);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [contextTabKey, setContextTabKey] = React.useState<string>('');
  const { remove } = useTabOperations();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要拖拽至少8像素才能触发拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = openTabs.findIndex((item) => item.key === active.id);
      const newIndex = openTabs.findIndex((item) => item.key === over.id);

      const newOpenTabs = arrayMove(openTabs, oldIndex, newIndex);
      setOpenTabs(newOpenTabs);
    }
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={openTabs.map(item => item.key)} strategy={horizontalListSortingStrategy}>
            <div className='fa-tab-menu-item-container'>
              {openTabs.map((item) => {
                const isActive = item.key === curTab?.key;
                return (
                  <SortableTabItem
                    key={item.key}
                    item={item}
                    isActive={isActive}
                    onClick={() => selTab(item.key)}
                    onClose={(e) => {
                      e.stopPropagation();
                      remove(item.key);
                    }}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
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
