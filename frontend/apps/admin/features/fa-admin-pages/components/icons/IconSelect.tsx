import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Input, Popover, Space } from 'antd';
import { useState } from 'react';
import FaIconPro from './FaIconPro';
import FaIconSelect from './FaIconSelect';

export interface IconSelectProps {
  value?: string;
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
          <Space.Compact style={{ width: '100%' }}>
            <Input value={value} allowClear onChange={e => onChange?.(e.target.value)} onFocus={() => setOpen(true)} />
            <Popover
              content={(
                <div className='fa-flex-column' style={{ width: 250 }}>
                  <div className='fa-p12 fa-pb0'>
                    <Input value={search} placeholder="搜索图标" onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <FaIconSelect search={search} onChange={handleChange} />
                </div>
              )}
              styles={{
                container: {
                  padding: 0,
                },
              }}
              trigger="click"
              open={open}
              onOpenChange={setOpen}
            >
              <Button
                icon={value ? <FaIconPro icon={value} /> : <AppstoreOutlined />}
              />
            </Popover>
          </Space.Compact>
        </div>
      </span>
      {/* <Drawer title="选择图标" open={open} onClose={() => setOpen(false)} defaultSize={940} resizable styles={{ body: { display: 'flex', flexDirection: 'column' } }}>
        <Input value={search} placeholder="搜索图标" onChange={(e) => setSearch(e.target.value)} />
        <FaFlexRestLayout>
          <FaIconSelect search={search} onChange={handleChange} />
        </FaFlexRestLayout>
      </Drawer> */}
    </span>
  );
}
