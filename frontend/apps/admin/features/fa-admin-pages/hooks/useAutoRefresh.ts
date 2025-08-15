import { useEffect, useRef, useState } from "react";

/**
 *
 * @param autoRefreshSecInit 刷新间隔，单位：秒，-1表示不刷新
 * @param refresh 刷新方法
 */
const useAutoRefresh = (autoRefreshSecInit: number, refresh: () => void) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(autoRefreshSecInit)

  useEffect(() => {
    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 设置新的定时器（如果 autoRefreshSec > 0）
    if (autoRefreshSec > 0) {
      intervalRef.current = setInterval(() => {
        refresh();
      }, autoRefreshSec * 1000);
    }

    // 清理函数：组件卸载或依赖变化时清除定时器
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefreshSec, refresh]);

  return {autoRefreshSec, setAutoRefreshSec}
};

export default useAutoRefresh;
