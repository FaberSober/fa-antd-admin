import React, {CSSProperties} from 'react';

import styles from './GridContainer.module.less';

export interface Props {
  children: React.ReactNode;
  columns: number;
  style?: CSSProperties;
}

export function GridContainer({children, columns, style}: Props) {
  return (
    <ul
      className={styles.GridContainer}
      style={
        {
          '--col-count': columns,
          ...style
        } as React.CSSProperties
      }
    >
      {children}
    </ul>
  );
}
