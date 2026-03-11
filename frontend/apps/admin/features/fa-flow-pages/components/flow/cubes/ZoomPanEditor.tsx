import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [initialZoomLevel, setInitialZoomLevel] = useState(1);
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });

  const [miniScale, setMiniScale] = useState(1);
  const [miniContentOffset, setMiniContentOffset] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingMiniMap, setIsDraggingMiniMap] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const miniDragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  /** 计算初始居中和最佳缩放 */
  const getCenteredOffsetAndZoom = useCallback(() => {
    if (!containerRef.current || !contentRef.current) {
      return { offset: { x: 0, y: 0 }, zoom: 1 };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    if (contentRect.width === 0 || contentRect.height === 0) {
      return { offset: { x: 0, y: 0 }, zoom: 1 };
    }

    const padding = 50;
    const scaleX = (containerRect.width - padding * 2) / contentRect.width;
    const scaleY = (containerRect.height - padding * 2) / contentRect.height;
    const optimalZoom = Math.min(scaleX, scaleY, 1);

    const scaledWidth = contentRect.width * optimalZoom;
    const scaledHeight = contentRect.height * optimalZoom;

    const centerX = (containerRect.width - scaledWidth) / 2;
    const centerY = (containerRect.height - scaledHeight) / 2;

    return {
      offset: { x: centerX, y: centerY },
      zoom: optimalZoom,
    };
  }, []);

  /** 初始居中定位 */
  useLayoutEffect(() => {
    const { offset, zoom } = getCenteredOffsetAndZoom();
    setInitialOffset(offset);
    setInitialZoomLevel(zoom);
    setOffset(offset);
    setZoom(zoom);
  }, [getCenteredOffsetAndZoom]);

  /** 小地图参数计算 */
  useEffect(() => {
    const calculateMiniParams = () => {
      if (!contentRef.current) return;

      const contentRect = contentRef.current.getBoundingClientRect();
      if (contentRect.width === 0 || contentRect.height === 0) return;

      const scaleX = miniMapWidth / contentRect.width;
      const scaleY = miniMapHeight / contentRect.height;
      const scale = Math.min(scaleX, scaleY);

      const offsetX = Math.max((miniMapWidth - contentRect.width * scale) / 2, 0);
      const offsetY = Math.max((miniMapHeight - contentRect.height * scale) / 2, 0);

      setMiniScale(scale);
      setMiniContentOffset({ x: offsetX, y: offsetY });
    };

    calculateMiniParams();

    const observer = new ResizeObserver(calculateMiniParams);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [miniMapWidth, miniMapHeight]);

  /** 计算小地图中视口红框 */
  const getViewportRect = useCallback(() => {
    if (!containerRef.current) return { x: 0, y: 0, w: 0, h: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();

    const visibleWidth = containerRect.width / zoom;
    const visibleHeight = containerRect.height / zoom;

    const w = visibleWidth * miniScale;
    const h = visibleHeight * miniScale;

    const topLeftContentX = -offset.x / zoom;
    const topLeftContentY = -offset.y / zoom;

    const x = miniContentOffset.x + topLeftContentX * miniScale;
    const y = miniContentOffset.y + topLeftContentY * miniScale;

    return { x, y, w, h };
  }, [zoom, offset, miniScale, miniContentOffset]);

  const viewportRect = getViewportRect();

  /** 滚轮缩放（原生事件，passive: false） */
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(zoom + delta, 0.1), 4);

    const ratio = newZoom / zoom;
    const newOffsetX = mouseX + (offset.x - mouseX) * ratio;
    const newOffsetY = mouseY + (offset.y - mouseY) * ratio;

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  }, [zoom, offset]);

  /** 原生 wheel 监听（关键修复） */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false, capture: true });

    return () => {
      container.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [handleWheel]);

  /** 键盘空格键控制拖动模式 */
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
    }
  }, []);

  /** 主画布拖动 */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button === 0 && isSpacePressed) {
        setIsDragging(true);
        dragStart.current = {
          x: e.clientX,
          y: e.clientY,
          offsetX: offset.x,
          offsetY: offset.y,
        };
      }
    },
    [isSpacePressed, offset]
  );

  /** 全局鼠标移动 */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setOffset({
          x: dragStart.current.offsetX + dx,
          y: dragStart.current.offsetY + dy,
        });
      }

      if (isDraggingMiniMap) {
        const dx = e.clientX - miniDragStart.current.mouseX;
        const dy = e.clientY - miniDragStart.current.mouseY;
        const deltaContentX = dx / miniScale;
        const deltaContentY = dy / miniScale;

        setOffset({
          x: miniDragStart.current.offsetX - deltaContentX * zoom,
          y: miniDragStart.current.offsetY - deltaContentY * zoom,
        });
      }
    },
    [isDragging, isDraggingMiniMap, miniScale, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsDraggingMiniMap(false);
  }, []);

  /** 小地图红框拖动开始 */
  const handleMiniMapMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setIsDraggingMiniMap(true);
      miniDragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        offsetX: offset.x,
        offsetY: offset.y,
      };
    },
    [offset]
  );

  /** 全局键盘/鼠标事件 */
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
  }, [handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp]);

  /** 重置视图 */
  const handleReset = useCallback(() => {
    const { offset, zoom } = getCenteredOffsetAndZoom();
    setOffset(offset);
    setZoom(zoom);
  }, [getCenteredOffsetAndZoom]);

  return (
    <div className="fa-full fa-relative">
      <div className="fa-full-content">
        <div
          ref={containerRef}
          className={`fa-zoom-pan-editor-container ${
            isSpacePressed
              ? isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : ""
          }`}
          onMouseDown={handleMouseDown}
          // 移除 onWheelCapture，改用原生监听
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
                left: `${miniContentOffset.x}px`,
                top: `${miniContentOffset.y}px`,
                transform: `scale(${miniScale})`,
                transformOrigin: "0 0",
                opacity: 0.8,
              }}
            >
              {children}
            </div>

            {/* 视口红框 */}
            <div
              onMouseDown={handleMiniMapMouseDown}
              style={{
                position: "absolute",
                left: `${viewportRect.x}px`,
                top: `${viewportRect.y}px`,
                width: `${viewportRect.w}px`,
                height: `${viewportRect.h}px`,
                border: "2px solid red",
                background: "rgba(255, 0, 0, 0.1)",
                boxSizing: "border-box",
                cursor: "move",
              }}
            />
          </div>
        </div>
      </div>

      <div className="fa-zoom-pan-left-top">{leftTop}</div>

      <Space className="fa-zoom-pan-editor-toolbar">
        {toolbar}
        <Button onClick={handleReset}>重置视图</Button>
        <Popover
          content={
            <ol>
              <li>鼠标滚轮缩放（向鼠标位置）</li>
              <li>按住空格键 + 鼠标左键拖动平移</li>
              <li>小地图红框可拖动平移视图</li>
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
