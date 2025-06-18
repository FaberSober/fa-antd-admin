import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import { Viewer, Worker } from '@react-pdf-viewer/core';
// @ts-ignore
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { FaUtils } from '@fa/ui';
import './ReactPdfView.scss';

export interface ReactPdfViewProps {
  fileUrl: string; // 文件Url
}

export default function ReactPdfView({ fileUrl }: ReactPdfViewProps) {
  const [position, setPosition] = useState([0, 0]);
  const [copyPanelVisible, setCopyPanelVisible] = useState(false);
  const [selectText, setSelectText] = useState<string>('');

  // Create new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // 释放鼠标处理函数
  const mouseUp = useCallback((ev: any) => {
    // console.log('ReactPdfView#mouseUp')
    let text = '';
    if (window.getSelection) {
      // @ts-ignore
      text = window.getSelection().toString();
      // @ts-ignore
    } else if (document.selection && document.selection.type !== 'Control') {
      // eslint-disable-next-line prefer-destructuring
      // @ts-ignore
      text = document.selection.createRange().text;
    }
    if (text !== '') {
      // @ts-ignore
      setSelectText(text);
      const domClass = ev.target.getAttribute('class');
      if (domClass && domClass !== '' && domClass.indexOf('rpv-core') === 0) {
        // console.log('mouseUp', text, ev.target.offsetTop, ev.target.offsetLeft);
        const containerDom = document.getElementById('react-pdf-viewer');
        // @ts-ignore
        const rect = containerDom.getBoundingClientRect();
        setPosition([ev.clientX - rect.x, ev.clientY - rect.y - 40]);
        setCopyPanelVisible(true);
      }
    } else {
      // setCopyPanelVisible(false)
    }
  }, []);

  useEffect(() => {
    // 监听释放鼠标按钮事件
    document.addEventListener('mouseup', mouseUp);
    return () => {
      document.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  function handleClickCopy(e: any) {
    if (e) {
      e.stopPropagation();
    }
    FaUtils.handleClipboard(selectText);
    setCopyPanelVisible(false);
  }

  return (
    <Worker workerUrl="/plugins/pdfjs/pdfjs-dist@3.3.122/build/pdf.worker.min.js">
      <div id="react-pdf-viewer" style={{ height: '100%', position: 'relative' }}>
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />

        {copyPanelVisible && (
          <div style={{ position: 'absolute', left: position[0], top: position[1] }} className="react-pdf-viewer-copy-div">
            <a onClick={handleClickCopy}>复制</a>
            <a onClick={() => setCopyPanelVisible(false)}>取消</a>
          </div>
        )}
      </div>
    </Worker>
  );
}
