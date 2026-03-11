import React, { useEffect, useState } from 'react';
import { each, trim } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import './FaIconSelect.css';

const iconSet = new Set();
each(fas, (i: any) => {
  if (i.iconName) {
    iconSet.add(i.iconName);
  }
});
const ICON_LIST: any[] = Array.from(iconSet);

export interface FaIconSelectProps {
  search?: string;
  value?: any;
  onChange?: (v: string | undefined) => void;
}

/**
 * 图标选择
 */
const PAGE_SIZE = 36;

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
    if (trim(search) === '') return true;
    return i.indexOf(trim(search)) > -1;
  });

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const pageList = filteredList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="fa-flex-column">
      <div className="fa-ui-icon-grid">
        {pageList.map((i) => (
          <div key={i} onClick={() => handleClick(i)} className={`fa-ui-icon-item${value === i ? ' selected' : ''}`}>
            <FontAwesomeIcon icon={`${i}` as any} size='lg' />
          </div>
        ))}
      </div>
      <div className="fa-ui-icon-pagination">
        <button disabled={page <= 1} onClick={() => setPage(1)} title="首页">«</button>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} title="上一页">‹</button>
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
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} title="下一页">›</button>
        <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} title="尾页">»</button>
        {/* <span className="fa-ui-icon-pagination-info">{filteredList.length}</span> */}
      </div>
    </div>
  );
}
