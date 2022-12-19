// import React, {useCallback, useEffect, useState} from 'react';
// import {Viewer, Worker} from '@react-pdf-viewer/core';
// import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';

// // Import styles
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// import {handleClipboard} from '@/utils/utils';
// import './ReactPdfView.less';

// export interface ReactPdfViewProps {
//   fileUrl: string; // 文件Url
// }

// export default function ReactPdfView({ fileUrl }: ReactPdfViewProps) {
//   const [position, setPosition] = useState([0, 0]);
//   const [copyPanelVisible, setCopyPanelVisible] = useState(false);
//   const [selectText, setSelectText] = useState<string>('');

//   // Create new plugin instance
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();

//   // 释放鼠标处理函数
//   const mouseUp = useCallback((ev:any) => {
//     // console.log('ReactPdfView#mouseUp')
//     let text = '';
//     if (window.getSelection) {
//       text = (window.getSelection() as any).toString();
//     } else if (document.selection && document.selection.type !== 'Control') {
//       text = document.selection.createRange().text;
//     }
//     if (text !== '') {
//       setSelectText(text);
//       const domClass = ev.target.getAttribute('class');
//       if (domClass && domClass !== '' && domClass.indexOf('rpv-core') === 0) {
//         // console.log('mouseUp', text, ev.target.offsetTop, ev.target.offsetLeft);
//         const containerDom = document.getElementById('react-pdf-viewer') as any;
//         const rect = containerDom.getBoundingClientRect();
//         setPosition([ev.clientX - rect.x, ev.clientY - rect.y - 40]);
//         setCopyPanelVisible(true);
//       }
//     } else {
//       // setCopyPanelVisible(false)
//     }
//   }, []);

//   useEffect(() => {
//     // 监听释放鼠标按钮事件
//     document.addEventListener('mouseup', mouseUp);
//     return () => {
//       document.removeEventListener('mouseup', mouseUp);
//     };
//   }, []);

//   function handleClickCopy(e: any) {
//     if (e) {
//       e.stopPropagation();
//     }
//     handleClipboard(selectText);
//     setCopyPanelVisible(false);
//   }

//   return (
//     <Worker workerUrl="/plugins/pdfjs/pdfjs-dist-2.15.349/build/pdf.worker.js">
//       <div id="react-pdf-viewer" style={{ height: '100%', position: 'relative' }}>
//         <Viewer fileUrl={fileUrl} plugins={[ defaultLayoutPluginInstance ]} />

//         {copyPanelVisible && (
//           <div style={{ position: 'absolute', left: position[0], top: position[1] }} className="react-pdf-viewer-copy-div">
//             <a onClick={handleClickCopy}>复制</a>
//             <a onClick={() => setCopyPanelVisible(false)}>取消</a>
//           </div>
//         )}
//       </div>
//     </Worker>
//   );
// }
