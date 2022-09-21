import React, { ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';

interface IProps extends RouteComponentProps {
  children: ReactNode | Element;
}

export default function FragmentLayout({ children }: IProps) {
  return <>{children}</>;
}
