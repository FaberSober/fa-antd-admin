import { useCallback, useMemo, useState } from "react";

export default function useViewItemPro<T>(list?: T[]): {
  open: boolean,
  item: T|undefined,
  index: number|undefined,
  hide: () => void,
  show: (v:T, index?: number) => void,
  prev: () => void,
  next: () => void,
  hasPrev: boolean,
  hasNext: boolean,
} {
  const [state, setState] = useState<{
    item: T|undefined;
    open: boolean;
    index: number|undefined;
  }>({
    item: undefined,
    open: false,
    index: undefined,
  })

  // 翻页逻辑 - 上一条
  const prev = useCallback(() => {
    if (!list || state.index === undefined || state.index <= 0) return;
    const newIndex = state.index - 1;
    setState({
      item: list[newIndex],
      open: true,
      index: newIndex,
    });
  }, [list, state.index]);

  // 翻页逻辑 - 下一条
  const next = useCallback(() => {
    if (!list || state.index === undefined || state.index >= list.length - 1) return;
    const newIndex = state.index + 1;
    setState({
      item: list[newIndex],
      open: true,
      index: newIndex,
    });
  }, [list, state.index]);

  // 计算边界状态
  const hasPrev = useMemo(() => {
    return state.index !== undefined && state.index > 0;
  }, [state.index]);

  const hasNext = useMemo(() => {
    return list !== undefined && state.index !== undefined && state.index < list.length - 1;
  }, [list, state.index]);

  return {
    open: state.open,
    item: state.item,
    index: state.index,
    hide: () => {
      setState({
        item: undefined,
        open: false,
        index: undefined,
      })
    },
    show: (v:T, index?: number) => {
      setState({
        item: v,
        open: true,
        index,
      })
    },
    prev,
    next,
    hasPrev,
    hasNext,
  }
}