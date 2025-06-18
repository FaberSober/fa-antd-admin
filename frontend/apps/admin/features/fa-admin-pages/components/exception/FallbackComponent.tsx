import React from 'react';

/**
 * @author xu.pengfei
 * @date 2025/2/27 17:12
 */
export default function FallbackComponent() {
  return (
    <div>异常情况，请联系管理员进行处理。可以尝试刷新页面。<a onClick={() => window.location.reload(true)} style={{cursor:'pointer'}}>点此刷新</a></div>
  )
}
