import React, { useCallback, useEffect, useRef, useState } from "react";
import './ZoomPanEditor.scss'
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";

interface ZoomPanEditorProps {
  children: React.ReactNode;
  miniMapWidth?: number;
  miniMapHeight?: number;
  toolbar?: React.ReactNode;
}

export default function ZoomPanEditor({
                                        children,
                                        miniMapWidth = 200,
                                        miniMapHeight = 150,
                                        toolbar,
                                      }: ZoomPanEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({x: 0, y: 0});

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({x: 0, y: 0, offsetX: 0, offsetY: 0});

  const [isDraggingMiniMap, setIsDraggingMiniMap] = useState(false);

  /** ========== 主画布滚轮缩放 ========== */
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - offset.x;
    const mouseY = e.clientY - rect.top - offset.y;

    let delta = e.deltaY > 0 ? -0.1 : 0.1;
    let newZoom = Math.min(Math.max(zoom + delta, 0.1), 4);

    const scale = newZoom / zoom;
    const newOffsetX = offset.x - (mouseX * (scale - 1));
    const newOffsetY = offset.y - (mouseY * (scale - 1));

    setZoom(newZoom);
    setOffset({x: newOffsetX, y: newOffsetY});
  }, [zoom, offset]);

  /** ========== 主画布拖动 ========== */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1 && !(e.button === 0 && e.shiftKey)) return;
    setIsDragging(true);
    dragStart.current = {x: e.clientX, y: e.clientY, offsetX: offset.x, offsetY: offset.y};
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffset({
        x: dragStart.current.offsetX + dx,
        y: dragStart.current.offsetY + dy,
      });
    }
    if (isDraggingMiniMap && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = miniMapWidth / rect.width;
      const scaleY = miniMapHeight / rect.height;

      const miniX = e.clientX - rect.right + miniMapWidth; // 小地图内部位置
      const miniY = e.clientY - rect.bottom + miniMapHeight;

      const viewportWidth = rect.width / zoom;
      const viewportHeight = rect.height / zoom;

      setOffset({
        x: -miniX / scaleX * zoom + rect.width / 2,
        y: -miniY / scaleY * zoom + rect.height / 2,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingMiniMap(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isDraggingMiniMap]);

  /** ========== 小地图红框拖动 ========== */
  const handleMiniMapMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingMiniMap(true);
  };

  /** ========== 小地图计算红框位置 ========== */
  const getViewportRect = () => {
    if (!containerRef.current) return {x: 0, y: 0, w: 0, h: 0};
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = miniMapWidth / rect.width;
    const scaleY = miniMapHeight / rect.height;

    return {
      x: -offset.x * scaleX / zoom,
      y: -offset.y * scaleY / zoom,
      w: rect.width * scaleX / zoom,
      h: rect.height * scaleY / zoom,
    };
  };

  const viewportRect = getViewportRect();

  return (
    <div className="fa-relative">
      <div
        ref={containerRef}
        className="fa-zoom-pan-editor-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={contentRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>

        {/* 小地图 */}
        <div
          className="fa-zoom-pan-editor-minimap"
          style={{
            width: miniMapWidth,
            height: miniMapHeight,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transform: "scale(0.1)", // 小地图内容缩放
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
          {/* 红框 */}
          <div
            onMouseDown={handleMiniMapMouseDown}
            style={{
              position: "absolute",
              border: "2px solid red",
              left: viewportRect.x,
              top: viewportRect.y,
              width: viewportRect.w,
              height: viewportRect.h,
              cursor: "move",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div className="fa-zoom-pan-editor-toolbar">
        {toolbar}
        <Popover
          content={(
            <div>

            </div>
          )}
        >
          <QuestionCircleOutlined />
        </Popover>
      </div>
    </div>
  );
};
