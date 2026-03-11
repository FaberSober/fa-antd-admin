import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { FaEnums, ThemeLayoutContext } from '@fa/ui';
import type { Rbac } from '@/types';
import MenuLayoutContext from '../context/MenuLayoutContext';
import './MenuSearch.scss';

/**
 * 菜单搜索 - 顶部工具栏按钮 & 搜索弹窗
 * @author xu.pengfei
 * @date 2026-03-10 17:09:48
 */
export default function MenuSearch() {
  const { menuList, setMenuSelPath } = useContext(MenuLayoutContext);
  const { colorPrimary } = useContext(ThemeLayoutContext);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // 仅展示菜单级别（非模块、非按钮），有 linkUrl 的条目
  const filteredMenus: Rbac.RbacMenu[] = keyword.trim()
    ? menuList.filter(
        (m) =>
          m.level !== FaEnums.RbacMenuLevelEnum.APP &&
          m.level !== FaEnums.RbacMenuLevelEnum.BUTTON &&
          m.status &&
          m.name.includes(keyword.trim()),
      )
    : [];

  // 打开弹窗
  const handleOpen = useCallback(() => {
    setOpen(true);
    setKeyword('');
    setActiveIndex(0);
  }, []);

  // 关闭弹窗
  const handleClose = useCallback(() => {
    setOpen(false);
    setKeyword('');
    setActiveIndex(0);
  }, []);

  // 选中菜单
  const handleSelect = useCallback(
    (menu: Rbac.RbacMenu) => {
      setMenuSelPath(menu.id);
      handleClose();
    },
    [setMenuSelPath, handleClose],
  );

  // 全局快捷键 ⌘K / Ctrl+K 打开
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleOpen]);

  // 弹窗内键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filteredMenus.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (filteredMenus[activeIndex]) {
        handleSelect(filteredMenus[activeIndex]);
      }
    }
  };

  // 搜索词变化时重置 activeIndex
  useEffect(() => {
    setActiveIndex(0);
  }, [keyword]);

  // 弹窗打开时聚焦输入框
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <>
      {/* 顶部工具栏搜索按钮 */}
      <div className="menu-search-trigger" onClick={handleOpen} title="搜索菜单 (⌘K)">
        <SearchOutlined className="menu-search-trigger__icon" />
        <span className="menu-search-trigger__text">搜索</span>
        <span className="menu-search-trigger__shortcut">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </span>
      </div>

      {/* 搜索弹窗遮罩 - Portal 挂载到 body，脱离父级 stacking context */}
      {open && createPortal(
        <div className="menu-search-mask" onClick={handleClose}>
          <div className="menu-search-modal" onClick={(e) => e.stopPropagation()}>
            {/* 搜索框 */}
            <div className="menu-search-modal__header">
              <SearchOutlined className="menu-search-modal__search-icon" />
              <input
                ref={inputRef}
                className="menu-search-modal__input"
                placeholder="搜索导航菜单"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <CloseOutlined className="menu-search-modal__close" onClick={handleClose} />
            </div>

            <div className="menu-search-modal__divider" />

            {/* 结果列表 */}
            <div className="menu-search-modal__body">
              {filteredMenus.length === 0 ? (
                <div className="menu-search-modal__empty">
                  {keyword.trim() ? '没有匹配的菜单' : '没有搜索历史'}
                </div>
              ) : (
                <ul className="menu-search-modal__list">
                  {filteredMenus.map((menu, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <li
                        key={menu.id}
                        className={`menu-search-modal__item${isActive ? ' is-active' : ''}`}
                        style={isActive ? { backgroundColor: colorPrimary } : undefined}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => handleSelect(menu)}
                      >
                        <SearchOutlined
                          className="menu-search-modal__item-icon"
                          style={isActive ? { color: 'rgba(255,255,255,0.8)' } : undefined}
                        />
                        <span
                          className="menu-search-modal__item-name"
                          style={isActive ? { color: '#fff' } : undefined}
                        >
                          {menu.name}
                        </span>
                        {isActive && (
                          <CloseOutlined
                            className="menu-search-modal__item-close"
                            style={{ color: 'rgba(255,255,255,0.7)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClose();
                            }}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* 底部快捷键说明 */}
            <div className="menu-search-modal__footer">
              <span className="menu-search-modal__hint">
                <kbd>↵</kbd> 选择
              </span>
              <span className="menu-search-modal__hint">
                <kbd>↑</kbd> <kbd>↓</kbd> 导航
              </span>
              <span className="menu-search-modal__hint">
                <kbd>ESC</kbd> 关闭
              </span>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}