import { useState } from "react";

export default function useViewItem<T>(): {
  open: boolean,
  item: T|undefined,
  hide: () => void,
  show: (v:T) => void,
} {
  const [item, setItem] = useState<T>();
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    item,
    hide: () => {
      setOpen(false)
    },
    show: (v:T) => {
      setItem(v);
      setOpen(true);
    },
  }
}