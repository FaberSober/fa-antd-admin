import React, { ReactNode } from 'react';

interface IProps {
  children: ReactNode | Element;
}

export default function FragmentLayout({ children }: IProps) {
  return <>{children}</>;
}
