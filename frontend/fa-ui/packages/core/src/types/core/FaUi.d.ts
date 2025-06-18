import { CSSProperties, ReactNode } from 'react';

declare namespace FaUi {
  export interface ClassA {
    name: string;
  }

  /** Button */
  export interface Button {
    title?: string;
    children?: ReactNode;
    style?: CSSProperties;
  }
}

export default FaUi;
