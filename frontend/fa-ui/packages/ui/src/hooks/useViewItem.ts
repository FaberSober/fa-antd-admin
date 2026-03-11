import { useState } from "react";

export default function useViewItem<T>(): {
  open: boolean,
  item: T|undefined,
  index: number|undefined,
  hide: () => void,
  show: (v:T, index?: number) => void,
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
  }
}