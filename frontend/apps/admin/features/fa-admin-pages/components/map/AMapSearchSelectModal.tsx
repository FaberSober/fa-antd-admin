import React, { type CSSProperties, useEffect, useState } from 'react';
import { DragModal, type DragModalProps, type Fa } from '@fa/ui';
import AMapSearchSelect from './AMapSearchSelect';

export interface AMapSearchSelectModalProps extends DragModalProps {
  onSelect?: (lnglat: Fa.LngLat, address?: string) => void;
  value?: Fa.LngLat;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2023/4/21 16:31
 */
export default function AMapSearchSelectModal({ onSelect, value, style, children, ...props }: AMapSearchSelectModalProps) {
  const [open, setOpen] = useState(false);

  const [pos, setPos] = useState<Fa.LngLat>();

  useEffect(() => {
    if (value) {
      setPos(value);
    }
  }, [value]);

  function showModal() {
    setOpen(true);
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal
        title="选择地理位置"
        open={open}
        onOk={() => {
          setOpen(false);
          if (pos && onSelect) {
            onSelect(pos);
          }
        }}
        onCancel={() => setOpen(false)}
        width={1000}
        style={{ top: 44 }}
        {...props}
      >
        <AMapSearchSelect
          onSelect={(v) => {
            setPos(v);
          }}
          value={value}
          style={{ width: 976, height: 600 }}
        />
      </DragModal>
    </span>
  );
}
