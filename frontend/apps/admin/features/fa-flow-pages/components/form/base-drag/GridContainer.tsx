import React, { CSSProperties } from 'react';

import './GridContainer.css';

export interface Props {
  children: React.ReactNode;
  columns: number;
  style?: CSSProperties;
}

export function GridContainer({ children, columns, style }: Props) {
  return (
    <ul
      className="fa-grid-container"
      style={
        {
          '--col-count': columns,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </ul>
  );
}
