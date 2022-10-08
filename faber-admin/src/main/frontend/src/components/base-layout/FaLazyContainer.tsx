import React, {ReactNode, useEffect, useState} from 'react';


export interface LazyContainerProps {
  showCond: boolean; // 展示条件
  children: ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2022/3/24 14:29
 */
export default function FaLazyContainer({ showCond, children }: LazyContainerProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return;

    if (showCond) {
      setLoaded(true)
    }
  }, [showCond])

  if (!loaded) {
    return null;
  }

  return (
    <div className="fa-full-content-no-padding" style={{ display: showCond ? 'block' : 'none' }}>
      {children}
    </div>
  )
}
