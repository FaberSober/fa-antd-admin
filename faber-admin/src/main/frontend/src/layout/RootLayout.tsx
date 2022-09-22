import React, { ReactNode } from 'react'


interface IProps {
  children?: ReactNode | Element;
}

export default function RootLayout({ children }: IProps) {
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'auto' }}>
      {children}
    </div>
  )
}
