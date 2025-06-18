import React, { useState } from 'react';
import { Drawer, Input, Space } from 'antd';
import { FaFlexRestLayout } from '@fa/ui';
import { CloseCircleFilled } from '@ant-design/icons';
import { FaIcon, FaIconSelect } from '@fa/icons';

export interface IconSelectProps {
  value?: any;
  onChange?: (v: string | undefined) => void;
}

/**
 * @author xu.pengfei
 * @date 2023/1/6 10:49
 */
export default function IconSelect({ value, onChange }: IconSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>();

  function handleChange(v: string | undefined) {
    if (onChange) onChange(v);
    setOpen(false);
  }

  return (
    <span>
      <span>
        <div style={{ margin: 0, cursor: 'pointer' }}>
          {value ? (
            <Space>
              <FaIcon icon={value} size="lg" onClick={() => setOpen(true)} />
              <CloseCircleFilled style={{ color: '#ccc' }} onClick={() => handleChange('')} />
            </Space>
          ) : (
            <a style={{ fontSize: '12px' }} onClick={() => setOpen(true)}>
              选择图标
            </a>
          )}
        </div>
      </span>
      <Drawer title="选择图标" open={open} onClose={() => setOpen(false)} width={940} styles={{ body: { display: 'flex', flexDirection: 'column' } }}>
        <Input value={search} placeholder="搜索图标" onChange={(e) => setSearch(e.target.value)} />
        <FaFlexRestLayout>
          <FaIconSelect search={search} onChange={handleChange} />
        </FaFlexRestLayout>
      </Drawer>
    </span>
  );
}
