import React from 'react';

/**
 * @author xu.pengfei
 * @date 2023/1/31 11:08
 */
export default function AdminIframe() {
  return (
    <iframe src={window.FaIframeUrl} sandbox="allow-scripts" className="fa-full-content" style={{ width: '100%', height: '100%', border: 'none', margin: 0 }} />
  );
}
