import { useEffect, useRef, useState, useCallback } from "react";

interface ZoomPanOptions {
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  initialZoom?: number;
}

export default function useZoomPan(options: ZoomPanOptions = {}) {
  const {
    minZoom = 0.1,
    maxZoom = 2,
    step = 0.1,
    initialZoom = 1,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const spacePressed = useRef(false);

  // ====== Zoom handling ======
  const zoomTo = useCallback(
    (delta: number, centerX: number, centerY: number) => {
      setZoom((prevZoom) => {
        const newZoom = Math.min(Math.max(prevZoom + delta, minZoom), maxZoom);

        if (contentRef.current) {
          const rect = contentRef.current.getBoundingClientRect();

          // 计算缩放中心偏移
          const offsetX = (centerX - rect.left) / prevZoom;
          const offsetY = (centerY - rect.top) / prevZoom;

          setPosition((prev) => ({
            x: prev.x - offsetX * (newZoom - prevZoom),
            y: prev.y - offsetY * (newZoom - prevZoom),
          }));
        }

        return newZoom;
      });
    },
    [minZoom, maxZoom]
  );

  // ====== Reset handling (双击复位) ======
  const resetView = useCallback(() => {
    setZoom(1);
    if (containerRef.current && contentRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const content = contentRef.current.getBoundingClientRect();

      const centerX = (container.width - content.width) / 2;
      const centerY = (container.height - content.height) / 2;

      setPosition({ x: centerX, y: centerY });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  // ====== Mouse wheel ======
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -step : step;
        zoomTo(delta, e.clientX, e.clientY);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoomTo, step]);

  // ====== Mouse drag ======
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || (spacePressed.current && e.button === 0)) {
        isPanning.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // ====== Keyboard ======
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spacePressed.current = true;
      }
      if (e.key === "+") {
        zoomTo(step, window.innerWidth / 2, window.innerHeight / 2);
      }
      if (e.key === "-") {
        zoomTo(-step, window.innerWidth / 2, window.innerHeight / 2);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spacePressed.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [zoomTo, step]);

  // ====== Double click reset ======
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleDblClick = (e: MouseEvent) => {
      e.preventDefault();
      resetView();
    };

    content.addEventListener("dblclick", handleDblClick);
    return () => {
      content.removeEventListener("dblclick", handleDblClick);
    };
  }, [resetView]);

  const transform = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
    transformOrigin: "0 0",
  };

  return { containerRef, contentRef, zoom, position, transform, resetView };
}
