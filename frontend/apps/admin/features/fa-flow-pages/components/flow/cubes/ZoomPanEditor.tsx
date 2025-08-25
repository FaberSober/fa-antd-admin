import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ZoomPanEditor.scss";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popover, Space } from "antd";

interface ZoomPanEditorProps {
  children: React.ReactNode;
  miniMapWidth?: number;
  miniMapHeight?: number;
  toolbar?: React.ReactNode;
  leftTop?: React.ReactNode;
}

export default function ZoomPanEditor({
  children,
  miniMapWidth = 200,
  miniMapHeight = 150,
  toolbar,
  leftTop,
}: ZoomPanEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 计算居中位置的函数
  const getCenteredOffset = useCallback(() => {
    if (!containerRef.current || !contentRef.current) {
      return { x: 100, y: 100 }; // 默认位置
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    // 计算居中偏移量
    const centerX = (containerRect.width - contentRect.width) / 2;
    const centerY = (containerRect.height - contentRect.height) / 2;

    return { x: centerX, y: centerY };
  }, []);

  // 初始状态
  const initialZoom = 1;
  const [initialOffset, setInitialOffset] = useState({ x: 100, y: 100 });

  const [zoom, setZoom] = useState(initialZoom);
  const [offset, setOffset] = useState(initialOffset);

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const [isDraggingMiniMap, setIsDraggingMiniMap] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  /** ========== 初始化居中定位 ========== */
  useEffect(() => {
    const timer = setTimeout(() => {
      const centeredOffset = getCenteredOffset();
      setInitialOffset(centeredOffset);
      setOffset(centeredOffset);
    }, 100); // 延迟确保DOM已渲染

    return () => clearTimeout(timer);
  }, [getCenteredOffset]);

  /** ========== 键盘事件监听空格键 ========== */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      setIsSpacePressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      setIsSpacePressed(false);
      setIsDragging(false); // 释放空格键时停止拖动
    }
  }, []);

  /** ========== 主画布滚轮缩放 ========== */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - offset.x;
      const mouseY = e.clientY - rect.top - offset.y;

      let delta = e.deltaY > 0 ? -0.1 : 0.1;
      let newZoom = Math.min(Math.max(zoom + delta, 0.1), 4);

      const scale = newZoom / zoom;
      const newOffsetX = offset.x - mouseX * (scale - 1);
      const newOffsetY = offset.y - mouseY * (scale - 1);

      setZoom(newZoom);
      setOffset({ x: newOffsetX, y: newOffsetY });
    },
    [zoom, offset]
  );

  /** ========== 主画布拖动 ========== */
  const handleMouseDown = (e: React.MouseEvent) => {
    // 只有在按住空格键时才允许拖动
    if (e.button === 0 && isSpacePressed) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: offset.x,
        offsetY: offset.y,
      };
    }
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
        x: (-miniX / scaleX) * zoom + rect.width / 2,
        y: (-miniY / scaleY) * zoom + rect.height / 2,
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
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isDragging, isDraggingMiniMap, handleKeyDown, handleKeyUp]);

  /** ========== 小地图红框拖动 ========== */
  const handleMiniMapMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingMiniMap(true);
  };

  /** ========== 小地图计算红框位置 ========== */
  const getViewportRect = () => {
    if (!containerRef.current) return { x: 0, y: 0, w: 0, h: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = miniMapWidth / rect.width;
    const scaleY = miniMapHeight / rect.height;

    return {
      x: (-offset.x * scaleX) / zoom,
      y: (-offset.y * scaleY) / zoom,
      w: (rect.width * scaleX) / zoom,
      h: (rect.height * scaleY) / zoom,
    };
  };

  const viewportRect = getViewportRect();

  /** ========== 重置到初始位置和缩放 ========== */
  const handleReset = useCallback(() => {
    setZoom(initialZoom);
    setOffset(initialOffset);
  }, [initialOffset]);

  return (
    <div className="fa-full fa-relative">
      <div className="fa-full-content">
        <div
          ref={containerRef}
          className="fa-zoom-pan-editor-container"
          onWheelCapture={handleWheel}
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
      </div>

      <div className="fa-zoom-pan-left-top">{leftTop}</div>

      <Space className="fa-zoom-pan-editor-toolbar">
        {toolbar}
        <Button onClick={handleReset}>重置</Button>
        <Popover
          content={
            <ol>
              <li>鼠标滚动缩放</li>
              <li>按住空格键，按住鼠标左键拖动</li>
            </ol>
          }
          placement="leftTop"
        >
          <QuestionCircleOutlined />
        </Popover>
      </Space>
    </div>
  );
}
