import React, { useEffect, useState } from 'react';
import { trim } from 'lodash';
import { Icon } from '@iconify/react';
import mdiIcons from '@iconify-json/mdi/icons.json';

// 合并 icons（有完整 body）和 aliases（别名，如 settings-outline -> cog-outline）
// @ts-ignore
const ICON_LIST: string[] = [
  ...Object.keys(mdiIcons.icons),
  ...Object.keys((mdiIcons as any).aliases ?? {}),
].sort();

export interface FaIconSelectProps {
  search?: string;
  value?: any;
  onChange?: (v: string | undefined) => void;
}

const PAGE_SIZE = 36;

/**
 * 基于@iconify-json/mdi的图标选择
 * @author xu.pengfei
 * @date 2026-03-09 14:04:52
 */
export default function FaIconSelect({ value, search, onChange }: FaIconSelectProps) {
  const [page, setPage] = useState(1);

  // 搜索词变化时重置到第一页
  useEffect(() => {
    setPage(1);
  }, [search]);

  function handleClick(v: string | undefined) {
    if (onChange) onChange(v);
  }

  const filteredList = ICON_LIST.filter((i: string) => {
    if (!search || trim(search) === '') return true;
    return i.includes(trim(search));
  });

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const pageList = filteredList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="fa-flex-column">
      <div className="fa-ui-icon-grid">
        {pageList.map((i) => {
          const iconName = `mdi:${i}`;
          return (
            <div
              key={iconName}
              onClick={() => handleClick(iconName)}
              className={`fa-ui-icon-item${value === iconName ? ' selected' : ''}`}
            >
              <Icon icon={iconName} fontSize={24} />
            </div>
          );
        })}
      </div>
      <div className="fa-ui-icon-pagination">
        <button disabled={page <= 1} onClick={() => setPage(1)} title="首页">«</button>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} title="上一页">‹</button>
        {(() => {
          const items: React.ReactNode[] = [];
          let lastRendered = 0;
          for (let p = 1; p <= totalPages; p++) {
            const isEdge = p === 1 || p === totalPages;
            const isNearCurrent = Math.abs(p - page) <= 1;
            if (isEdge || isNearCurrent) {
              if (lastRendered && p - lastRendered > 1) {
                items.push(<span key={`e-${p}`} className="fa-ui-icon-pagination-ellipsis">…</span>);
              }
              items.push(
                <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
              );
              lastRendered = p;
            }
          }
          return items;
        })()}
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} title="下一页">›</button>
        <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} title="尾页">»</button>
      </div>
    </div>
  );
}