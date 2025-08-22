import { useState, useRef, useCallback, useEffect } from "react";

/**
 *
 * @param minZoom
 * @param maxZoom
 * @param step
 */
export default function useZoomPan(minZoom = 0.1, maxZoom = 2, step = 0.1) {
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const isSpacePressed = useRef(false); // 记录空格是否按下

  /** 滚轮缩放（支持 Ctrl+滚轮） */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Ctrl + 滚轮才缩放（避免页面整体缩放）
      if (!e.ctrlKey) return;
      e.preventDefault();

      const scaleDelta = e.deltaY > 0 ? -step : step;
      const newZoom = Math.min(Math.max(zoom + scaleDelta, minZoom), maxZoom);

      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const ratio = newZoom / zoom;
      const newTranslate = {
        x: mouseX - ratio * (mouseX - translate.x),
        y: mouseY - ratio * (mouseY - translate.y),
      };

      setZoom(newZoom);
      setTranslate(newTranslate);
    },
    [zoom, translate, minZoom, maxZoom, step]
  );

  /** 鼠标按下（右键拖动 / 空格+左键拖动） */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2 || (isSpacePressed.current && e.button === 0)) {
      e.preventDefault();
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  /** 鼠标移动（拖动逻辑） */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      setTranslate((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /** 监听键盘事件（+ / - 缩放, 空格控制拖动模式） */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = true;
      }
      if (e.key === "+") {
        setZoom((z) => Math.min(z + step, maxZoom));
      }
      if (e.key === "-") {
        setZoom((z) => Math.max(z - step, minZoom));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [minZoom, maxZoom, step]);

  return {
    zoom,
    translate,
    containerRef,
    eventHandlers: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    },
    setZoom,
    setTranslate,
  };
}
