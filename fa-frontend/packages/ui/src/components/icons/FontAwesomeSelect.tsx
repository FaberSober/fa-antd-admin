import React, { useState } from 'react';
import { Drawer, Input, Space } from 'antd';
import { each, trim } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import { CloseCircleFilled } from '@ant-design/icons';
import { FaFlexRestLayout } from '../base-layout';
import './FontAwesomeSelect.css';

const iconSet = new Set();
each(fas, (i: any) => {
  if (i.iconName) {
    iconSet.add(i.iconName);
  }
});
const ICON_LIST: any[] = Array.from(iconSet);

export interface FontAwesomeSelectProps {
  value?: any;
  onChange?: (v: string | undefined) => void;
}

/**
 * 图标选择
 */
export default function FontAwesomeSelect({ value, onChange }: FontAwesomeSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>();

  function handleClick(v: string | undefined) {
    if (onChange) onChange(v);
    setOpen(false);
  }

  const showList = ICON_LIST.filter((i: string) => {
    if (trim(search) === '') return true;
    return i.indexOf(trim(search)) > -1;
  });
  return (
    <span>
      <span>
        <div style={{ margin: 0, cursor: 'pointer' }}>
          {value ? (
            <Space>
              <FontAwesomeIcon icon={value} size="lg" onClick={() => setOpen(true)} />
              <CloseCircleFilled style={{ color: '#ccc' }} onClick={() => handleClick('')} />
            </Space>
          ) : (
            <a style={{ fontSize: '12px' }} onClick={() => setOpen(true)}>
              选择图标
            </a>
          )}
        </div>
      </span>
      <Drawer
        title="选择图标"
        open={open}
        onClose={() => setOpen(false)}
        width={940}
        bodyStyle={{ display: 'flex', flexDirection: 'column' }}
      >
        <Input value={search} placeholder="搜索图标" onChange={(e) => setSearch(e.target.value)} />
        <FaFlexRestLayout>
          <div className="fa-flex-row" style={{ flexWrap: 'wrap' }}>
            {showList.map((i) => (
              <div key={i} onClick={() => handleClick(i)} className="fa-ui-icon-item">
                <FontAwesomeIcon icon={`${i}` as any} size="2x" style={{ marginTop: 24 }} />
                <span style={{ textAlign: 'center', marginTop: 6 }}>{i}</span>
              </div>
            ))}
          </div>
        </FaFlexRestLayout>
      </Drawer>
    </span>
  );
}
