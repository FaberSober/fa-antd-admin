import React from 'react';
import {SortableHandle} from "react-sortable-hoc";
import {MenuOutlined} from "@ant-design/icons";
import styles from './index.module.less'


/**
 * @author xu.pengfei
 * @date 2022/11/11 20:15
 */
export default function FaDragHandle({ style, ...props }: any) {

  const Handle = SortableHandle(() => (
    <div className={styles.dragHandle} style={style}>
      <MenuOutlined />
    </div>
  ));

  return (
    <Handle {...props} />
  )
}
