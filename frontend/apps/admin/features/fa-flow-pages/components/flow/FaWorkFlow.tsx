import React, { useEffect, useRef, useState } from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import NodeWrap from './NodeWrap';
import './index.scss'
import FaWorkFlowContext, { FaWorkFlowContextProps } from './context/FaWorkFlowContext';
import { cloneDeep } from "lodash";
import { FaUtils } from "@fa/ui";


export interface FaWorkFlowProps {
  /** 流程配置JSON */
  processModel: Flow.ProcessModel;
  onChange?: (processModel: Flow.ProcessModel) => void;
}

/**
 * workflow editor
 * @author xu.pengfei
 * @date 2025/8/19 17:34
 */
export default function FaWorkFlow({ processModel, onChange }: FaWorkFlowProps) {
  const [zoom, setZoom] = useState<number>(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const origin = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   const editor = document.getElementById("fa-workflow-editor");
  //   if (!editor) return;
  //
  //   const handleMouseDown = (e) => {
  //     if (e.button !== 2) return; // 只响应右键
  //     e.preventDefault();
  //
  //     isDragging.current = true;
  //     start.current = { x: e.clientX, y: e.clientY };
  //     origin.current = { ...translate };
  //   };
  //
  //   const handleMouseMove = (e) => {
  //     if (!isDragging.current) return;
  //     const dx = e.clientX - start.current.x;
  //     const dy = e.clientY - start.current.y;
  //     setTranslate({
  //       x: origin.current.x + dx,
  //       y: origin.current.y + dy,
  //     });
  //   };
  //
  //   const handleMouseUp = () => {
  //     isDragging.current = false;
  //   };
  //
  //   editor.addEventListener("mousedown", handleMouseDown);
  //   window.addEventListener("mousemove", handleMouseMove);
  //   window.addEventListener("mouseup", handleMouseUp);
  //
  //   return () => {
  //     editor.removeEventListener("mousedown", handleMouseDown);
  //     window.removeEventListener("mousemove", handleMouseMove);
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [translate]);

  function updateProcessModel(v: Flow.ProcessModel) {
    if (onChange) onChange(v)
  }

  function loopNode(n: Flow.Node, func: (n: Flow.Node) => void) {
    if (n.childNode) {
      loopNode(n.childNode, func)
    }
    func(n)
  }

  function deleteNode(node: Flow.Node) {
    // delete current node, move child node forward
    loopNode(processModel.nodeConfig, n => {
      if (n.childNode && n.childNode.nodeKey === node.nodeKey) {
        n.childNode = n.childNode.childNode
      }
    })
    updateProcessModel(cloneDeep(processModel))
  }

  const contextValue: FaWorkFlowContextProps = {
    processModel,
    updateProcessModel,
    refreshNode: () => {
      const processNew = cloneDeep(processModel)
      updateProcessModel(processNew)
      console.log('processNew', processNew)
    },
    deleteNode,
  }

  return (
    <FaWorkFlowContext.Provider value={contextValue}>
      <div
        className="fa-workflow-editor"
        onWheel={e => {
          e.preventDefault(); // 阻止页面滚动
          // FaUtils.preventEvent(e)
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          setZoom(prevZoom => Math.min(Math.max(prevZoom + delta, 0.1), 2));
        }}
        onContextMenu={(e) => e.preventDefault()} // 禁止默认右键菜单
      >
        <div
          id="fa-workflow-editor"
          className="fa-workflow-editor"
          // style={{transformOrigin: '0 0', transform: `scale(${zoom})`}}
          style={{
            transformOrigin: "0 0",
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
            cursor: isDragging.current ? "grabbing" : "grab",
          }}
          onMouseDown={e => {
            // console.log('onMouseDown', e.button, e)
            if (e.button !== 2) return; // 只响应右键
            e.preventDefault();

            isDragging.current = true;
            start.current = { x: e.clientX, y: e.clientY };
            origin.current = { ...translate };
          }}
          onMouseMove={e => {
            if (!isDragging.current) return;
            const dx = e.clientX - start.current.x;
            const dy = e.clientY - start.current.y;
            // console.log('onMouseMove', e.clientX, e.clientY)
            setTranslate({
              x: origin.current.x + dx,
              y: origin.current.y + dy,
            });
          }}
          onMouseUp={() => {
            isDragging.current = false;
          }}
        >
          <div className="sc-workflow-design">
            <div className="box-scale">
              <NodeWrap node={processModel.nodeConfig}/>

              <div className="end-node">
                <div className="end-node-circle"></div>
                <div className="end-node-text">流程结束</div>
              </div>
            </div>
          </div>
        </div>

        <div className="fa-workflow-editor-tools">
          <p>缩放比例: {zoom.toFixed(2)}</p>
          <p>滚轮 ↑ 放大，滚轮 ↓ 缩小</p>
        </div>
      </div>
    </FaWorkFlowContext.Provider>
  )
}
