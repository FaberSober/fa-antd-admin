import React from 'react';
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
export default function FaIconSelect({ value, search, onChange }: FaIconSelectProps) {

  function handleClick(v: string | undefined) {
    if (onChange) onChange(v);
  }

  const showList = ICON_LIST.filter((i: string) => {
    if (trim(search) === '') return true;
    return i.indexOf(trim(search)) > -1;
  });
  return (
    <div className="fa-flex-row" style={{ flexWrap: 'wrap' }}>
      {showList.map((i) => (
        <div key={i} onClick={() => handleClick(i)} className="fa-ui-icon-item">
          <FontAwesomeIcon icon={`${i}` as any} size="2x" style={{ marginTop: 24 }} />
          <span style={{ textAlign: 'center', marginTop: 6 }}>{i}</span>
        </div>
      ))}
    </div>
  );
}
