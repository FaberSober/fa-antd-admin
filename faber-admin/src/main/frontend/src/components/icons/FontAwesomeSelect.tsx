import React, {useState} from 'react';
import {Drawer} from 'antd';
import {FONT_AWESOME_LIST} from './fontUtils'
import styles from './FontAwesomeSelect.module.less'


export interface FontAwesomeSelectProps {
  value?: string,
  onChange?: (v: string|undefined) => void,
}

/**
 * BASE-权限表实体新增、编辑弹框
 */
export default function FontAwesomeSelect({ value, onChange }: FontAwesomeSelectProps) {
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState(value)

  function handleClick(v: string|undefined) {
    setInnerValue(v)
    if (onChange) onChange(v)
  }

  console.log('innerValue', innerValue)
  return (
    <span>
      <span onClick={() => setOpen(true)}>
        <div className={styles.item} style={{ margin: 0 }}>
          {innerValue ? <i className={`${innerValue}`} /> : <span style={{ fontSize: '12px' }}>选择</span>}
        </div>
      </span>
      <Drawer
        title="选择图标"
        open={open}
        onClose={() => setOpen(false)}
        width={700}
      >
        <div className="faber-flex-row" style={{ flexWrap: "wrap" }}>
          {FONT_AWESOME_LIST.map(i => (
            <div key={i} onClick={() => handleClick(i)} className={styles.item}>
              <i className={`${i}`} />
            </div>
          ))}
        </div>
      </Drawer>
    </span>
  )
}
